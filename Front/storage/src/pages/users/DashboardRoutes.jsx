import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from '../../components/Menu';

export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="inicio" element={<Menu />} />
            <Route path="productos" element={<Menu />} />
            <Route path="usuarios" element={<Menu />} />
            <Route path="configuracion" element={<Menu />} />
            <Route path="*" element={<Menu />} />
        </Routes>
    );
}
