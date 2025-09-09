import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FaSignInAlt, FaBoxes, FaChartLine, FaUsers, FaCogs } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Icon from '../assets/img/cgti.png';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
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
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg navbar-light bg-white fixed-top ${isScrolled ? 'shadow-sm' : ''}`} style={{ transition: 'all 0.3s ease' }}>
        <Container>
          <a className="navbar-brand fw-bold text-success" href="#">
            <span className="h3 mb-0">Inventario Sena</span>
          </a>
          <div className="ms-auto d-flex align-items-center">
            <Button 
              variant="outline-success" 
              className="ms-3"
              onClick={handleLogin}
            >
              <FaSignInAlt className="me-2" />
              Ingresar
            </Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-5 mt-5" style={{ backgroundColor: '#f8f9fa', paddingTop: '6rem !important' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0" data-aos="fade-right">
              <h1 className="display-4 fw-bold mb-4">
                Control Total de tu <span className="text-success">Inventario</span>
              </h1>
              <p className="lead mb-4">
                Optimizamos la gestión de inventario con nuestro sistema de inventario en la nube. 
                Fácil de usar, potente y accesible desde cualquier dispositivo.
              </p>
              <div className="d-flex gap-3">
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
            <Col lg={6} data-aos="fade-left">
              <img 
                src={Icon} 
                alt="Sistema de Inventario" 
                className="img-fluid rounded-3 shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">Características Principales</h2>
            <p className="text-muted">Descubre todo lo que nuestro sistema puede hacer por ti</p>
          </div>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
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
