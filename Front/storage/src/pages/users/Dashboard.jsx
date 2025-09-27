import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import AIChatButton from '../../components/AIChatButton';
import '../../styles/Dashboard.css';
import { getUser } from '../../services/authContext.js';
import Swal from 'sweetalert2';
import { removeAccessToken } from '../../services/authService';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLight, setIsLight] = useState(
    localStorage.getItem('tema') === 'light'
  );
  const navigate = useNavigate();

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

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
      Swal.close();
    } else {
      setLoading(true);
      Swal.fire({
        title: "Cargando...",
        text: "Cargando datos del usuario...",
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: "Salir",
        didOpen: () => {
          Swal.showLoading();
        },
      }).then((result) => {
        if (result.isConfirmed) {
          removeAccessToken();
          navigate('/login', { replace: true });
        }
      });
    }
  }, [navigate]);

  const onSearchChange = (e) => setSearch(e.target.value);
  const onSearchSubmit = () => {
    const q = encodeURIComponent(search.trim());
    if (q) {
      navigate(`/dashboard/buscar?q=${q}`);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (loading) return null;

  return (
    <div className="layout">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {Nav && (
          <Nav
            rol={user?.rol}
          />
        )}
      </aside>

      <div className="content">
        {Header && (
          <Header
            userName={user?.first_name}
            search={search}
            onSearchChange={onSearchChange}
            onSearchSubmit={onSearchSubmit}
            onToggleSidebar={toggleSidebar}
            isLight={isLight}
            onToggleTheme={toggleTheme}
          />
        )}

        <main className="main">
          <Outlet />
          {AIChatButton && <AIChatButton />}
        </main>

        {Footer && <Footer />}
      </div>
    </div>
  );
}