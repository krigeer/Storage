import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://127.0.0.1:8000/inventario/'; // Reemplaza con la URL de tu API

// Configuración por defecto para axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login/', credentials);
    
    // Guardar token en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Opcional: Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    // Manejo de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      throw new Error(error.response.data.message || 'Error al iniciar sesión');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo pasó en la configuración de la petición
      throw new Error('Error al configurar la petición');
    }
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirigir al login
  window.location.href = '/login';
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default api;
