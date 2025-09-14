import React from 'react';
import { useMenu } from '../context/MenuContext';
import Estadisticas from '../pages/users/Estadisticas';
import Gestionar_bd from '../pages/users/Gestionar_bd';
import Gestion_usuario from '../pages/users/Gestion_usuario';
import Reportes from '../pages/users/Ver_reportes';
import Configuracio from '../pages/users/Configuracio';
import Prestamos from '../pages/users/Prestamos';
import Tecnologia from '../pages/users/Tecnologia';
import Materiales from '../pages/users/Materiales';

const menuContent = {
    inicio: (
        <div>
           <Estadisticas/>
        </div>
    ),
    GestionarTecnologia: (
        <div>
            <Tecnologia/>
        </div>
    ),
    GestionarMateriales: (
        <div>
            <Materiales/>
        </div>
    ),
    GestionarPrestamos: (
        <div>
           <Prestamos/>
        </div>
    ),
    GestionarUsuarios:(
        <div>
           <Gestion_usuario/>
        </div>
    ),
    GestionarReportes:(
        <div>
            <Reportes/>
        </div>
    ),
    GestionarBD:(
        <div>
            <Gestionar_bd/>
        </div>
    ),
    configuracion:(
        <div>
           <Configuracio/>
        </div>
    ),
};

export default function Menu() {
    const { activeMenu } = useMenu();
    
    return (
        <div className="menu-container">
            {menuContent[activeMenu] || menuContent.inicio}
        </div>
    );
}
