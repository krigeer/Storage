import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { removeAccessToken } from '../services/authService';
import {
  FaHome,
  FaLaptop,
  FaBoxes,
  FaExchangeAlt,
  FaUsers,
  FaChartBar,
  FaDatabase,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';


const MOBILE_BREAKPOINT = '992px'; 

const Nav = ({ rol }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const activePath = pathSegments[pathSegments.length - 1] || 'inicio';

    // ref para referenciar el contenedor <nav> completo
    const navRef = useRef(null); 
    const menuRef = useRef(null);
    const storageKey = 'navScrollTop';

    // Función auxiliar para verificar si es móvil
    const isMobile = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT})`).matches;

    // Lógica para cerrar el sidebar 
    const closeSidebar = () => {
        // Solo cerrar si estamos en móvil
        if (isMobile()) {
            // recibe la clase 'open' (o 'active') para mostrar el menú.
            const sidebar = document.querySelector('.sidebar'); 
            
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    };

    //  Cierre por Click Fuera 
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Solo aplica  si esta en un dispositivo móvil
            if (!isMobile()) return; 

            // Verificar si el clic fue FUERA del contenedor <nav>
            // navRef.current.contains(event.target) verifica si el clic fue DENTRO del nav
            if (navRef.current && !navRef.current.contains(event.target)) {
                closeSidebar();
            }
        };

        // Adjuntar el listener al documento
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

    // 2. Lógica de Persistencia de Scroll 
    useEffect(() => {
        if (menuRef.current && isMobile()) {
            const saved = Number(localStorage.getItem(storageKey));
            if (!Number.isNaN(saved)) menuRef.current.scrollTop = saved;
        }
    }, [location.pathname]);

    // 3. Guardar la posición del scroll
    useEffect(() => {
        const el = menuRef.current;
        if (!el) return;
        
        const onScroll = () => {
            if (isMobile()) localStorage.setItem(storageKey, String(el.scrollTop));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);


    const handleMenuClick = (menuId) => {
        // 1. Guardar scroll actual antes de navegar
        if (menuRef.current) {
            localStorage.setItem(storageKey, String(menuRef.current.scrollTop));
        }

        // 2. Cerrar el menú después de hacer clic 
        closeSidebar();

        // 3. Navegar o cerrar sesión
        if (menuId === 'cerrarSesion') {
            removeAccessToken();
            navigate('/login', { replace: true }); 
        } else {
            const path = menuId === 'inicio' ? '/dashboard' : `/dashboard/${menuId}`;
            navigate(path, { replace: true });
        }
    };
    
    let navItems = [];
    if (rol === 1) {
        navItems = [
            { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
            { id: 'GestionarTecnologia', icon: <FaLaptop />, label: 'Gestionar Tecnología' },
            { id: 'GestionarMateriales', icon: <FaBoxes />, label: 'Gestionar Materiales' },
            { id: 'GestionarPrestamos', icon: <FaExchangeAlt />, label: 'Gestionar Prestamos' },
            { id: 'GestionarUsuarios', icon: <FaUsers />, label: 'Gestionar Usuarios' },
            { id: 'GestionarReportes', icon: <FaChartBar />, label: 'Gestionar Reportes' },
            { id: 'GestionarBD', icon: <FaDatabase />, label: 'Gestionar BD' },
            { id: 'configuracion', icon: <FaCog />, label: 'Configuración' },
            { id: 'cerrarSesion', icon: <FaSignOutAlt />, label: 'Cerrar Sesión' },
        ];
    } else if (rol === 2) {
        navItems = [
            { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
            { id: 'GestionarPrestamos', icon: <FaExchangeAlt />, label: 'Gestionar Prestamos' },
            { id: 'GestionarReportes', icon: <FaChartBar />, label: 'Gestionar Reportes' },
            { id: 'configuracion', icon: <FaCog />, label: 'Configuración' },
            { id: 'cerrarSesion', icon: <FaSignOutAlt />, label: 'Cerrar Sesión' },
        ];
    } else {
        navItems = [
            { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
            { id: 'cerrarSesion', icon: <FaSignOutAlt />, label: 'Cerrar Sesión' },
        ];
    }

    return (
        <nav ref={navRef}>
            <div className="brand">
                <div className="logo">📦</div>
                <div className="brand-text">Inventario SENA</div>
            </div>
            <div className="menu" ref={menuRef}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`menu-item ${activePath === item.id ? 'active' : ''}`}
                        onClick={() => handleMenuClick(item.id)}
                    >
                        <span style={{ marginRight: 8 }}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Nav;