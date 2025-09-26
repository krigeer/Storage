import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FaSignInAlt, FaBoxes, FaChartLine, FaUsers, FaCogs, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Icon from '../assets/img/cgti.png';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      // Desactivar AOS en pantallas muy pequeñas para evitar problemas de rendimiento o diseño
      disable: window.innerWidth < 768, 
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <FaBoxes size={40} className="text-success mb-3" />,
      title: 'Gestión de Inventario',
      description: 'Controla y administra tu inventario de manera eficiente y en tiempo real.'
    },
    {
      icon: <FaChartLine size={40} className="text-success mb-3" />,
      title: 'Reportes en Tiempo Real',
      description: 'Obtén informes detallados y análisis de tu inventario al instante.'
    },
    {
      icon: <FaUsers size={40} className="text-success mb-3" />,
      title: 'Multi-usuario',
      description: 'Trabaja en equipo con diferentes niveles de acceso y permisos.'
    },
    {
      icon: <FaCogs size={40} className="text-success mb-3" />,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva que facilita la gestión de tu inventario.'
    }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar 
        expand="lg" 
        className={`bg-white fixed-top ${isScrolled ? 'shadow-sm' : ''}`} 
        style={{ transition: 'all 0.3s ease' }}
      >
        <Container>
          <Navbar.Brand href="#home" className="fw-bold text-success">
            <span className="h3 mb-0">Inventario Sena</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <FaBars className="text-success" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
              <Button 
                variant="success" 
                className="ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto" 
                onClick={handleLogin}
              >
               Ingresar
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="py-5 mt-5" style={{ backgroundColor: '#f8f9fa', paddingTop: '6rem !important' }}>
        <Container>
          <Row className="align-items-center flex-column-reverse flex-lg-row my-5"> {/* Invertir orden en móvil, my-5 para más espacio en móviles */}
            <Col lg={6} className="mb-5 mb-lg-0 text-center text-lg-start" data-aos="fade-right"> {/* Alinear texto en móvil */}
              <h1 className="display-4 fw-bold mb-4">
                Control Total de tu <span className="text-success">Inventario</span>
              </h1>
              <p className="lead mb-4">
                Optimizamos la gestión de inventario con nuestro sistema de inventario en la nube. 
                Fácil de usar, potente y accesible desde cualquier dispositivo.
              </p>
              <div className="d-grid gap-3 d-sm-flex justify-content-center justify-content-lg-start"> {/* Botones apilados en móviles */}
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handleLogin}
                >
                  Comenzar Ahora
                </Button>
                <Button variant="outline-secondary" size="lg">
                  Preguntas
                </Button>
              </div>
            </Col>
            <Col lg={6} data-aos="fade-left" className="text-center"> {/* Centrar imagen en móvil */}
              <img 
                src={Icon} 
                alt="Sistema de Inventario" 
                className="img-fluid rounded-3 shadow mb-4 mb-lg-0" // Añadir margen inferior para móvil
                style={{ maxWidth: '85%' }} // Limitar tamaño de imagen un poco en pantallas grandes si es necesario
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section - Responsividad en el grid de tarjetas */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">Características Principales</h2>
            <p className="text-muted">Descubre todo lo que nuestro sistema puede hacer por ti</p>
          </div>
          <Row className="g-4">
            {features.map((feature, index) => (
              // sm={12}: Una tarjeta por fila en móviles
              // md={6}: Dos tarjetas por fila en tabletas
              // lg={3}: Cuatro tarjetas por fila en escritorio
              <Col sm={12} md={6} lg={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    {feature.icon}
                    <h5 className="card-title">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <h2 className="fw-bold mb-4" data-aos="fade-up">¿Listo para optimizar tu inventario?</h2>
          <p className="lead mb-4" data-aos="fade-up" data-aos-delay="100">
            Ingresa con tu cuenta y empieza a optimizar tu inventario.
          </p>
          <Button 
            variant="success" 
            size="lg" 
            className="px-4"
            onClick={handleLogin}
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Comenzar Gratis
          </Button>
        </Container>
      </section>
      <Footer />
    </div>
  );
}