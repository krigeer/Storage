import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/users/Dashboard";
import Estadisticas from "./pages/users/Estadisticas";
import Gestionar_bd from "./pages/users/Gestionar_bd";
import Gestion_usuario from "./pages/users/Gestion_usuario";
import Reportes from "./pages/users/Ver_reportes";
import Configuracio from "./pages/users/Configuracio";
import Prestamos from "./pages/users/Prestamos";
import Tecnologia from "./pages/users/Tecnologia";
import Materiales from "./pages/users/Materiales";
import NotFound  from "./pages/errores/NotFound"
import Recordar_contrasena from "./pages/Recordar_contrasena";

function AppContent() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Recordar-contrasena" element={<Recordar_contrasena />} />
            {/* La ruta del dashboard actúa como un layout para las sub-rutas */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                <Route index element={<Estadisticas />} /> {/* Ruta por defecto para /dashboard */}
                <Route path="inicio" element={<Estadisticas />} />
                <Route path="GestionarTecnologia" element={<Tecnologia />} />
                <Route path="GestionarMateriales" element={<Materiales />} />
                <Route path="GestionarPrestamos" element={<Prestamos />} />
                <Route path="GestionarUsuarios" element={<Gestion_usuario />} />
                <Route path="GestionarReportes" element={<Reportes />} />
                <Route path="GestionarBD" element={<Gestionar_bd />} />
                <Route path="configuracion" element={<Configuracio />} />
            </Route>
            <Route patch="*" element={<NotFound />}/>
        </Routes>
    );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
