import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    FaHome, 
    FaBox, 
    FaUsers, 
    FaCog, 
    FaChevronLeft, 
    FaChevronRight,
    FaBars
} from 'react-icons/fa';
import { useMenu } from '../context/MenuContext';
import './Nav.css';

const Nav = ({ isCollapsed, toggleCollapse }) => {
    const navigate = useNavigate();
    const { activeMenu, setActiveMenu } = useMenu();

    const navItems = [
        { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
        { id: 'productos', icon: <FaBox />, label: 'Productos' },
        { id: 'usuarios', icon: <FaUsers />, label: 'Usuarios' },
        { id: 'configuracion', icon: <FaCog />, label: 'Configuración' },
    ];

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
        // Actualizar la URL sin recargar la página
        navigate(`/dashboard/${menuId}`, { replace: true });
    };

    return (
        <>
            <div className="mobile-menu-toggle" onClick={toggleCollapse}>
                <FaBars />
            </div>
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
                            className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
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