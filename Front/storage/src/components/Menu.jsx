import React from 'react';
import { useMenu } from '../context/MenuContext';

const menuContent = {
    inicio: (
        <div>
            <h2>Bienvenido al Sistema</h2>
            <p>Seleccione una opción del menú para comenzar.</p>
        </div>
    ),
    productos: (
        <div>
            <h2>Gestión de Productos</h2>
            <p>Contenido de la sección de productos.</p>
        </div>
    ),
    usuarios: (
        <div>
            <h2>Gestión de Usuarios</h2>
            <p>Contenido de la sección de usuarios.</p>
        </div>
    ),
    configuracion: (
        <div>
            <h2>Configuración</h2>
            <p>Ajustes de configuración del sistema.</p>
        </div>
    )
};

export default function Menu() {
    const { activeMenu } = useMenu();
    
    return (
        <div className="menu-container">
            {menuContent[activeMenu] || menuContent.inicio}
        </div>
    );
}
