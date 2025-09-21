import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8000/api/materiales/"; 

const MaterialDidacticoManager = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cantidad: "",
    ubicacion: "",
  });

  
  const fetchMateriales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setMateriales(res.data);
    } catch (err) {
      setError("Error al cargar materiales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Registrar / Editar material
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, formData);
        setSuccess("Material actualizado ✅");
      } else {
        await axios.post(API_URL, formData);
        setSuccess("Material registrado ✅");
      }

      setFormData({ nombre: "", descripcion: "", cantidad: "", ubicacion: "" });
      setEditingId(null);
      setShowModal(false);
      fetchMateriales();
    } catch (err) {
      setError("Error al guardar el material");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este material?")) return;

    try {
      await axios.delete(`${API_URL}${id}/`);
      setSuccess("Material eliminado ❌");
      fetchMateriales();
    } catch (err) {
      setError("Error al eliminar el material");
    }
  };

  // Abrir modal en modo edición
  const handleEdit = (material) => {
    setEditingId(material.id);
    setFormData({
      nombre: material.nombre,
      descripcion: material.descripcion,
      cantidad: material.cantidad,
      ubicacion: material.ubicacion,
    });
    setShowModal(true);
  };

  // Abrir modal en modo registro
  const handleNew = () => {
    setEditingId(null);
    setFormData({ nombre: "", descripcion: "", cantidad: "", ubicacion: "" });
    setShowModal(true);
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h4 className="mb-3">Gestión de Material Didáctico</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button className="mb-3" onClick={handleNew}>
        ➕ Registrar Material
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.id}</td>
                <td>{mat.nombre}</td>
                <td>{mat.descripcion}</td>
                <td>{mat.cantidad}</td>
                <td>{mat.ubicacion}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(mat)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(mat.id)}
                  >
                    🗑 Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal Registrar/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Editar Material Didáctico" : "Registrar Material"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MaterialDidacticoManager;
