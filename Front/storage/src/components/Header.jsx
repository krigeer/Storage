import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Header.css';

export default function Header() {
    const userName = "Usuario"; 

    return (
        <header className="header-container">
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="search-input"
                />
            </div>
            <div className="user-profile">
                <FaUserCircle className="user-icon" />
                <span className="user-name">{userName}</span>
            </div>
        </header>
    );
}
