import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram, 
  FaPaperPlane, 
  FaHeart,
  FaChevronRight 
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5">
            <Container className="py-5">
                <Row>
                    <Col lg={4} className="mb-4 mb-lg-0">
                        <div className="footer-section">
                            <h2>Sobre Nosotros</h2>
                            <p className="text-white-50">
                                Somos una plataforma dedicada a la gestión de inventarios tecnológicos, optimizando procesos y mejorando la
                                eficiencia en el SENA.
                            </p>
                            <div className="social-icons d-flex gap-3">
                                <a href="#" className="text-white"><FaFacebookF /></a>
                                <a href="#" className="text-white"><FaTwitter /></a>
                                <a href="#" className="text-white"><FaLinkedinIn /></a>
                                <a href="#" className="text-white"><FaInstagram /></a>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} className="mb-4 mb-lg-0">
                        <div className="footer-section">
                            <h2>Enlaces Rápidos</h2>
                            <ul className="list-unstyled">
                                {['Inicio', 'Nosotros', 'Servicios', 'Galería', 'Contacto'].map((item, index) => (
                                    <li key={index} className="mb-2">
                                        <a 
                                            href={`#${item.toLowerCase()}`} 
                                            className="text-white-50 text-decoration-none d-flex align-items-center"
                                        >
                                            <FaChevronRight className="me-2" size={12} />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="footer-section">
                            <h2>Nuestros Aliados</h2>
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                {['ALIADO 1', 'ALIADO 2', 'CGTI'].map((aliado, index) => (
                                    <div key={index} className="bg-light p-2 rounded">
                                        <div className="text-dark text-center p-2">{aliado}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h5 className="mb-3">Suscríbete a nuestro boletín</h5>
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
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="border-top border-secondary py-3">
                <Container>
                    <Row>
                        <Col md={6} className="text-center text-md-start">
                            <p className="mb-0">© {new Date().getFullYear()} Inventario SENA. Todos los derechos reservados.</p>
                        </Col>
                        <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
                            <p className="mb-0">
                                Diseñado con <FaHeart className="text-danger" /> por CGTI
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;