import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { MenuProvider } from './context/MenuContext';
import ErrorBoundary from './components/ErrorBoundary';
// import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Recordar_contrasena from "./pages/Recordar_contrasena";
import Dashboard from "./pages/users/Dashboard";
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/inicio', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recordar-contrasena" element={<Recordar_contrasena />} />
      <Route 
        path="/dashboard/*" 
        element={
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        } 
      />
      {/* Uncomment this when you want to enable protected routes */}
      {/* <Route 
        path="/dashboard/*" 
        element={
          <ErrorBoundary>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </ErrorBoundary>
        } 
      /> */}
    </Routes>
  );
}

function App() {
  return (
    <MenuProvider>
      <AppContent />
    </MenuProvider>
  );
}

export default App;
