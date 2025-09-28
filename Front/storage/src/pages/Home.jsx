import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FaSignInAlt, FaBoxes, FaChartLine, FaUsers, FaCogs, FaBars, FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Icon from '../assets/img/cgti.png';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLight, setIsLight] = useState(
      localStorage.getItem('tema') === 'light'
    );
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      disable: window.innerWidth < 768,
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
      const prefer = localStorage.getItem('tema') || 'light';
      const light = prefer === 'light';
      setIsLight(light);
      if (light) {
        document.body.classList.add('light');
      } else {
        document.body.classList.remove('light');
      }
    }, []);

  const toggleTheme = () => {
    setIsLight((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('light');
        localStorage.setItem('tema', 'light');
      } else {
        document.body.classList.remove('light');
        localStorage.setItem('tema', 'dark');
      }
      return next;
    });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <FaBoxes size={40} className="home-icon-color mb-3" />,
      title: 'Gestión de Inventario',
      description: 'Controla y administra tu inventario de manera eficiente y en tiempo real.'
    },
    {
      icon: <FaChartLine size={40} className="home-icon-color mb-3" />,
      title: 'Reportes en Tiempo Real',
      description: 'Obtén informes detallados y análisis de tu inventario al instante.'
    },
    {
      icon: <FaUsers size={40} className="home-icon-color mb-3" />,
      title: 'Multi-usuario',
      description: 'Trabaja en equipo con diferentes niveles de acceso y permisos.'
    },
    {
      icon: <FaCogs size={40} className="home-icon-color mb-3" />,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva que facilita la gestión de tu inventario.'
    }
  ];

  return (
    <div className={`min-vh-100 d-flex flex-column ${isLight ? 'Modo claro' : 'Modo oscuro'}`}>
      {/* Navbar */}
      <Navbar
        expand="lg"
        className={`fixed-top ${isScrolled ? 'shadow-sm home-nav-scrolled' : 'home-nav-top'}`}
        style={{ transition: 'all 0.3s ease' }}
      >
        <Container>
          <Navbar.Brand href="#home" className="fw-bold home-brand-text">
            <span className="h3 mb-0 text-color">Inventario Sena</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <FaBars className="home-brand-text" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
              {/* Botón de Toggle de Tema */}
              <Button
                variant="link"
                className="me-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto home-brand-text text-decoration-none"
                onClick={toggleTheme}
                aria-label="Toggle dark/light mode"
              >
                {isLight ? <FaToggleOff size={24} /> : <FaToggleOn size={24} />}
                <span className="ms-2 d-lg-none">{isLight ? 'Modo claro' : 'Modo oscuro'}</span>
              </Button>
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
      <section
        className="py-5 mt-5 home-bg-secondary"
        style={{ paddingTop: '6rem' }}
      >
        <Container>
          <Row className="align-items-center flex-column-reverse flex-lg-row my-5">
            <Col lg={6} className="mb-5 mb-lg-0 text-center text-lg-start" data-aos="fade-right">
              <h1 className="display-4 fw-bold mb-4 home-text-color">
                Control Total de tu <span className="text-success">Inventario</span>
              </h1>
              <p className="lead mb-4 home-text-muted">
                Optimizamos la gestión de inventario con nuestro sistema en la nube.
                Fácil de usar, potente y accesible desde cualquier dispositivo.
              </p>
              <div className="d-grid gap-3 d-sm-flex justify-content-center justify-content-lg-start">
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
            <Col lg={6} data-aos="fade-left" className="text-center">
              <img
                src={Icon}
                alt="Sistema de Inventario"
                className="img-fluid rounded-3 shadow mb-4 mb-lg-0"
                style={{ maxWidth: '85%' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Características Section */}
      <section className="py-5 home-bg-primary">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold home-text-color">Características Principales</h2>
            <p className="home-text-muted">Descubre todo lo que nuestro sistema puede hacer por ti</p>
          </div>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col sm={12} md={6} lg={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="h-100 border-0 shadow-sm home-card">
                  <Card.Body className="text-center p-4">
                    {feature.icon}
                    <h5 className="card-title home-text-color">{feature.title}</h5>
                    <p className="card-text home-text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 home-bg-secondary">
        <Container className="text-center py-5">
          <h2 className="fw-bold mb-4 home-text-color" data-aos="fade-up">¿Listo para optimizar tu inventario?</h2>
          <p className="lead mb-4 home-text-muted" data-aos="fade-up" data-aos-delay="100">
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
