import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";

const PrestamoElementos = () => {
  const [tipo, setTipo] = useState("tecnologico");
  const [tecnologicos, setTecnologicos] = useState([]);
  const [didacticos, setDidacticos] = useState([]);
  const [elementoTecnologico, setElementoTecnologico] = useState("");
  const [elementoDidactico, setElementoDidactico] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [buscarUsuario, setBuscarUsuario] = useState("");

  const [mensaje, setMensaje] = useState(null);

  const API_URL = "https://api.midominio.com/prestamos";
  const API_USUARIOS = "https://api.midominio.com/usuarios";

  // Simulación de carga de elementos
  useEffect(() => {
    setTecnologicos([
      { id: 1, nombre: "Portátil Dell" },
      { id: 2, nombre: "Proyector Epson" },
    ]);
    setDidacticos([
      { id: 3, nombre: "Juego de geometría" },
      { id: 4, nombre: "Cartillas de inglés" },
    ]);
  }, []);

  // Simulación de carga de usuarios desde API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(API_USUARIOS);
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setUsuarios([
          { id: 1, nombre: "Carlos Pérez" },
          { id: 2, nombre: "Ana Gómez" },
          { id: 3, nombre: "Luis Rodríguez" },
        ]);
      }
    };

    fetchUsuarios();
  }, []);

  const handlePrestar = async () => {
    if (!usuarioSeleccionado || cantidad <= 0) {
      setMensaje("❌ Debe seleccionar un usuario y una cantidad válida.");
      return;
    }

    let elementosPrestados = [];

    if (tipo === "tecnologico" && elementoTecnologico) {
      elementosPrestados.push({ tipo: "tecnologico", elemento: elementoTecnologico });
    }

    if (tipo === "didactico" && elementoDidactico) {
      elementosPrestados.push({ tipo: "didactico", elemento: elementoDidactico });
    }

    if (tipo === "ambos") {
      if (elementoTecnologico) {
        elementosPrestados.push({ tipo: "tecnologico", elemento: elementoTecnologico });
      }
      if (elementoDidactico) {
        elementosPrestados.push({ tipo: "didactico", elemento: elementoDidactico });
      }
    }

    if (elementosPrestados.length === 0) {
      setMensaje("❌ Debe seleccionar al menos un elemento.");
      return;
    }

    const data = {
      usuario: usuarioSeleccionado,
      elementos: elementosPrestados,
      cantidad,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje("✅ Préstamo registrado correctamente.");
        setUsuarioSeleccionado("");
        setElementoTecnologico("");
        setElementoDidactico("");
        setCantidad(1);
      } else {
        setMensaje("❌ Error al registrar el préstamo.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error de conexión con la API.");
    }
  };

  // Filtrado de usuarios en tiempo real
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(buscarUsuario.toLowerCase())
  );

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Registrar Préstamo</h5>
      </Card.Header>
      <Card.Body>
        {mensaje && <Alert variant="info">{mensaje}</Alert>}
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Buscar Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del usuario"
                  value={buscarUsuario}
                  onChange={(e) => setBuscarUsuario(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Seleccionar Usuario</Form.Label>
                <Form.Select
                  value={usuarioSeleccionado}
                  onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                >
                  <option value="">-- Seleccione --</option>
                  {usuariosFiltrados.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de elemento</Form.Label>
                <Form.Select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="tecnologico">Tecnológico</option>
                  <option value="didactico">Material Didáctico</option>
                  <option value="ambos">Ambos</option>
                </Form.Select>
              </Form.Group>

              {tipo === "tecnologico" && (
                <Form.Group className="mb-3">
                  <Form.Label>Elemento Tecnológico</Form.Label>
                  <Form.Select
                    value={elementoTecnologico}
                    onChange={(e) => setElementoTecnologico(e.target.value)}
                  >
                    <option value="">-- Seleccione --</option>
                    {tecnologicos.map((el) => (
                      <option key={el.id} value={el.nombre}>
                        {el.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              {tipo === "didactico" && (
                <Form.Group className="mb-3">
                  <Form.Label>Material Didáctico</Form.Label>
                  <Form.Select
                    value={elementoDidactico}
                    onChange={(e) => setElementoDidactico(e.target.value)}
                  >
                    <option value="">-- Seleccione --</option>
                    {didacticos.map((el) => (
                      <option key={el.id} value={el.nombre}>
                        {el.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              {tipo === "ambos" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Elemento Tecnológico</Form.Label>
                    <Form.Select
                      value={elementoTecnologico}
                      onChange={(e) => setElementoTecnologico(e.target.value)}
                    >
                      <option value="">-- Seleccione --</option>
                      {tecnologicos.map((el) => (
                        <option key={el.id} value={el.nombre}>
                          {el.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Material Didáctico</Form.Label>
                    <Form.Select
                      value={elementoDidactico}
                      onChange={(e) => setElementoDidactico(e.target.value)}
                    >
                      <option value="">-- Seleccione --</option>
                      {didacticos.map((el) => (
                        <option key={el.id} value={el.nombre}>
                          {el.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="success" onClick={handlePrestar}>
            Prestar Elemento
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PrestamoElementos;
