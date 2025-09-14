import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    FaHome, 
    FaLaptop, 
    FaBoxes,
    FaExchangeAlt,
    FaUsers, 
    FaChartBar,
    FaDatabase,
    FaCog, 
    FaRobot,
    FaChevronLeft, 
    FaChevronRight,
    FaBars
} from 'react-icons/fa';
import { useMenu } from '../context/MenuContext';
import '../styles/Nav.css';

const Nav = ({ isCollapsed, toggleCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeMenu, setActiveMenu } = useMenu();

    const navItems = [
        { id: 'inicio', icon: <FaHome />, label: 'Inicio' },
        { id: 'GestionarTecnologia', icon: <FaLaptop />, label: 'Gestionar Tecnologia' },
        { id: 'GestionarMateriales', icon: <FaBoxes />, label: 'Gestionar Materiales' },
        { id: 'GestionarPrestamos', icon: <FaExchangeAlt />, label: 'Gestionar Prestamos' },
        { id: 'GestionarUsuarios', icon: <FaUsers />, label: 'Gestionar Usuarios' },
        { id: 'GestionarReportes', icon: <FaChartBar />, label: 'Gestionar Reportes' },
        { id: 'GestionarBD', icon: <FaDatabase />, label: 'Gestionar BD' },
        { id: 'configuracion', icon: <FaCog />, label: 'Configuración' },
    ];

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
        navigate(`/dashboard/${menuId}`, { replace: true });
    };

   
    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const currentMenu = pathSegments[pathSegments.length - 1];
        if (currentMenu && currentMenu !== activeMenu && navItems.some(item => item.id === currentMenu)) {
            setActiveMenu(currentMenu);
        }
    }, [location.pathname, activeMenu, setActiveMenu, navItems]);

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