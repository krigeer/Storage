import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import AIChatButton from '../../components/AIChatButton';
import { useMenu } from '../../context/MenuContext';
import Menu from '../../components/Menu';
import '../../styles/Dashboard.css';

export default function Dashboard() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const { activeMenu } = useMenu();
    const location = useLocation();
    const navigate = useNavigate();

    // Update active menu based on URL
    useEffect(() => {
        try {
            const pathSegments = location.pathname.split('/');
            const menuId = pathSegments[pathSegments.length - 1] || 'inicio';
            
            if (!['inicio', 'productos', 'usuarios', 'configuracion'].includes(menuId)) {
                navigate('inicio', { replace: true });
            }
        } catch (error) {
            console.error('Error in Dashboard useEffect:', error);
            navigate('inicio', { replace: true });
        }
    }, [location.pathname, navigate]);

    const toggleNav = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    return (
        <div className={`dashboard-layout ${isNavCollapsed ? 'nav-collapsed' : ''}`}>
            <header className="dashboard-header">
                <Header />
            </header>
            <nav className={`dashboard-nav ${isNavCollapsed ? 'collapsed' : ''}`}>
                <Nav isCollapsed={isNavCollapsed} toggleCollapse={toggleNav} />
            </nav>
            <main className="dashboard-main">
                <Menu />
                <AIChatButton />
            </main>
            <footer className="dashboard-footer">
                <Footer />
            </footer>
        </div>
    );
}