import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';


export default function Header(props) {
    const userName = props.userName;
    const search = props.search;
    return (
        <header className="header-container">
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="search-input"
                    value={search}
                    onChange={props.onSearchChange}
                />
            </div>
            <div className="user-profile">
                <FaUserCircle className="user-icon" />
                <span className="user-name">{userName}</span>
            </div>
        </header>
    );
}
