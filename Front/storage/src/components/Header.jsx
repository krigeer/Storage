import React from 'react';
import { FaSearch, FaUserCircle, FaBars, FaSun, FaMoon } from 'react-icons/fa';

export default function Header(props) {
  const { userName, search, onSearchChange, onSearchSubmit, onToggleSidebar, isLight, onToggleTheme } = props;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && typeof onSearchSubmit === 'function') {
      onSearchSubmit();
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        {onToggleSidebar && (
          <button className="icon-btn" onClick={onToggleSidebar} aria-label="Abrir menú">
            <FaBars />
          </button>
        )}
        <h1 className="title">Panel</h1>
      </div>

      <div className="header-right">
        <div className="searchbar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={onSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {onToggleTheme && (
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={isLight ? 'cambiar a modo oscuro' : 'cambiar a modo claro'}
            title={isLight ? 'Modo claro' : 'Modo oscuro'}
          >
            {isLight ? <FaMoon /> : <FaSun />}
          </button>
        )}

        <div className="avatar" title={userName || 'Usuario'}>
          {userName ? userName[0]?.toUpperCase() : <FaUserCircle />}
        </div>
      </div>
    </div>
  );
}
