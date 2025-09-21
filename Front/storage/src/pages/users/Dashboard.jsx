// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
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
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    removeAccessToken();
                    navigate('/login', { replace: true });
                }
            });
        }
    }, [navigate]);

    const toggleNav = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };
    if (loading) {
        return null; 
    }

    return (
        <div className={`dashboard-layout ${isNavCollapsed ? 'nav-collapsed' : ''}`}>
            <header className="dashboard-header">
                {Header && <Header userName={user?.first_name} />}
            </header>
            <nav className={`dashboard-nav ${isNavCollapsed ? 'collapsed' : ''}`}>
                {Nav && (
                    <Nav rol={user?.rol} isCollapsed={isNavCollapsed} toggleCollapse={toggleNav} />
                )}
            </nav>
            <main className="dashboard-main">
                <Outlet />
                {AIChatButton && <AIChatButton />}
            </main>
            <footer className="dashboard-footer">
                {Footer && <Footer />}
            </footer>
        </div>
    );
}