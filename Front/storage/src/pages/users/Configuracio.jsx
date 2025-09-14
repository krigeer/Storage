import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Simulación de URL API
  const API_URL = "https://api.midominio.com/usuarios/1";

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, []);

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      if (response.ok) {
        setMensaje("✅ Datos actualizados correctamente");
        setEditando(false);
      } else {
        setMensaje("❌ Error al actualizar datos");
      }
    } catch (error) {
      console.error("Error guardando:", error);
      setMensaje("❌ Error de conexión con la API");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!usuario) {
    return <Alert variant="danger">No se pudieron cargar los datos.</Alert>;
  }

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Perfil de Usuario</h5>
        <Button
          variant={editando ? "secondary" : "warning"}
          onClick={() => setEditando(!editando)}
        >
          {editando ? "Cancelar" : "Editar"}
        </Button>
      </Card.Header>
      <Card.Body>
        {mensaje && <Alert variant="info">{mensaje}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={usuario.nombre || ""}
              onChange={handleChange}
              readOnly={!editando}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={usuario.email || ""}
              onChange={handleChange}
              readOnly={!editando}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={usuario.telefono || ""}
              onChange={handleChange}
              readOnly={!editando}
            />
          </Form.Group>
          {editando && (
            <Button variant="success" onClick={handleGuardar}>
              Guardar Cambios
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PerfilUsuario;
