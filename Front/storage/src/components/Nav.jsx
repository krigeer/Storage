import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {removeAccessToken} from '../services/authService';
import {
    FaHome,
    FaLaptop,
    FaBoxes,
    FaExchangeAlt,
    FaUsers,
    FaChartBar,
    FaDatabase,
    FaCog,
    FaChevronLeft,
    FaChevronRight,
    FaSignOutAlt
} from 'react-icons/fa';
import '../styles/Nav.css';

const Nav = ({ isCollapsed, toggleCollapse, rol }) => {
    const navigate = useNavigate();
    const location = useLocation();

    
    const pathSegments = location.pathname.split('/');
    const activePath = pathSegments[pathSegments.length - 1];

    let navItems = [];

    if (rol === 1) {
        navItems = [
            { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
            { id: 'GestionarTecnologia', icon: <FaLaptop />, label: 'Gestionar Tecnologia' },
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
    }else{
        navItems = [
            { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
            { id: 'cerrarSesion', icon: <FaSignOutAlt />, label: 'Cerrar Sesión' },
        ];
    }

    const handleMenuClick = (menuId) => {
        if (menuId === 'cerrarSesion') {
            removeAccessToken();
            navigate('/login', { replace: true });
        } else {
            navigate(`/dashboard/${menuId}`, { replace: true });
        }
    };


    return (
        <>
            <div className={`nav-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="nav-header">
                    {!isCollapsed && <h3>Menú</h3>}
                    <button onClick={toggleCollapse} className="collapse-btn">
                        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
                </div>

                <ul className="nav-menu">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className={`nav-item ${activePath === item.id ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.id)}
                        >
                            <div className="nav-link">
                                <span className="nav-icon">{item.icon}</span>
                                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Nav;