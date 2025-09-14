import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import AIChatButton from '../../components/AIChatButton';
import Menu from '../../components/Menu';
import '../../styles/Dashboard.css';

export default function Dashboard() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const location = useLocation();

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