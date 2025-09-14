import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Aliado_uno from "../assets/img/partners/aliado1.png";
import Aliado_dos from "../assets/img/partners/aliado2.png";
import Aliado_tres from "../assets/img/cgti.png";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane,
  FaHeart,
  FaChevronRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <Container className="py-5">
        <Row>
          {/* Columna Sobre Nosotros */}
          <Col lg={4} className="mb-4 mb-lg-0">
            <div className="m-auto">
              <h5 className="fw-bold mb-3">Sobre Nosotros</h5>
              <p className="text-white-50 small">
                Somos una plataforma dedicada a la gestión de inventarios
                tecnológicos, optimizando procesos y mejorando la eficiencia en
                el SENA.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-white fs-5">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-white fs-5">
                  <FaTwitter />
                </a>
                <a href="#" className="text-white fs-5">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="text-white fs-5">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </Col>

          {/* Columna Enlaces Rápidos */}
          <Col lg={2} className="mb-4 mb-lg-0 flex m-auto">
            <div>
              <h5 className="fw-bold mb-3">Enlaces Rápidos</h5>
              <ul className="list-unstyled">
                {["Inicio", "Nosotros", "Servicios", "Galería", "Contacto"].map(
                  (item, index) => (
                    <li key={index} className="mb-2">
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="text-white-50 text-decoration-none d-flex align-items-center"
                      >
                        <FaChevronRight className="me-2" size={12} />
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </Col>

          {/* Columna Aliados y Boletín */}
          <Col lg={4}>
            <div>
              <h5 className="fw-bold mb-3">Nuestros Aliados</h5>
              <div className="d-flex gap-3 flex-wrap mb-4">
                {[Aliado_uno, Aliado_dos, Aliado_tres].map((aliado, index) => (
                  <div
                    key={index}
                    className="p-2 rounded shadow-sm d-flex align-items-center"
                  >
                    <img
                      src={aliado}
                      alt={`Aliado ${index + 1}`}
                      style={{ maxHeight: "40px", objectFit: "contain" }}
                    />
                  </div>
                ))}
              </div>

              <h6 className="mb-3">Suscríbete a nuestro boletín</h6>
              <div className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="rounded-0"
                />
                <Button variant="success" className="rounded-0">
                  <FaPaperPlane />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Línea inferior */}
      <div className="border-top border-secondary py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={5} className="text-center text-md-start">
              <p className="mb-0 small">
                © {new Date().getFullYear()} Inventario SENA. Todos los derechos
                reservados.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
              <p className="mb-0 small d-inline-flex align-items-center">
                Diseñado con <FaHeart className="text-danger ms-1 me-1" /> 
                por <span className="fw-bold ms-1">CGTI</span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
