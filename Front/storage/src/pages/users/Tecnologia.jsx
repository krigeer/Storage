import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Pagination, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const TecnologiaManager = () => {
  const [tecnologias, setTecnologias] = useState([]);
  const [filteredTecnologias, setFilteredTecnologias] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    serie_fabricante: "",
    serie_sena: "",
    tipo: "",
    marca: "",
    caracteristicas: "",
    ubicacion: "",
    estado: "",
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Cargar datos
  useEffect(() => {
    fetchTecnologias();
  }, []);

  const fetchTecnologias = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://127.0.0.1:8000/inventario/tecnologias/");
      setTecnologias(res.data);
      setFilteredTecnologias(res.data);
    } catch (err) {
      setError("Error al obtener las tecnologías. Intente nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar
  useEffect(() => {
    const filtered = tecnologias.filter((t) =>
      `${t.nombre} ${t.serie_sena} ${t.marca?.nombre}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredTecnologias(filtered);
    setCurrentPage(1);
  }, [search, tecnologias]);

  // Abrir modal (crear/editar)
  const handleShowModal = (tecnologia = null) => {
    setEditing(tecnologia);
    setError("");
    setSuccess("");
    if (tecnologia) {
      setFormData(tecnologia);
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        serie_fabricante: "",
        serie_sena: "",
        tipo: "",
        marca: "",
        caracteristicas: "",
        ubicacion: "",
        estado: "",
      });
    }
    setShowModal(true);
  };

  // Guardar cambios
  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      if (editing) {
        await axios.put(`/api/tecnologias/${editing.id}/`, formData);
        setSuccess("Tecnología actualizada correctamente ✅");
      } else {
        await axios.post("/api/tecnologias/", formData);
        setSuccess("Tecnología registrada correctamente ✅");
      }
      fetchTecnologias();
      setShowModal(false);
    } catch (err) {
      setError("No se pudo guardar la tecnología. Revise los datos.");
      console.error(err);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tecnología?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`/api/tecnologias/${id}/`);
      setSuccess("Tecnología eliminada correctamente 🗑️");
      fetchTecnologias();
    } catch (err) {
      setError("No se pudo eliminar la tecnología.");
      console.error(err);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTecnologias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTecnologias.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Gestión de Tecnologías</h3>

      {/* Alertas */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Buscador */}
      <Form.Control
        type="text"
        placeholder="Buscar tecnología..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Botón agregar */}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        ➕ Registrar Tecnología
      </Button>

      {/* Tabla */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" /> <p>Cargando...</p>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Serie SENA</th>
              <th>Marca</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((t) => (
                <tr key={t.id}>
                  <td>{t.nombre}</td>
                  <td>{t.serie_sena}</td>
                  <td>{t.marca?.nombre}</td>
                  <td>{t.tipo?.nombre}</td>
                  <td>{t.ubicacion?.nombre}</td>
                  <td>{t.estado?.nombre}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(t)}
                    >
                      ✏️ Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(t.id)}
                    >
                      🗑️ Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No se encontraron tecnologías
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? "Editar Tecnología" : "Registrar Tecnología"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Serie Fabricante</Form.Label>
              <Form.Control
                type="text"
                value={formData.serie_fabricante}
                onChange={(e) =>
                  setFormData({ ...formData, serie_fabricante: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Serie SENA</Form.Label>
              <Form.Control
                type="text"
                value={formData.serie_sena}
                onChange={(e) =>
                  setFormData({ ...formData, serie_sena: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Características</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.caracteristicas}
                onChange={(e) =>
                  setFormData({ ...formData, caracteristicas: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </Form.Group>

            {/* TODO: Selects dinámicos (tipo, marca, estado, ubicación) */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TecnologiaManager;
