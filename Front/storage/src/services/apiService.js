import axios from "axios";
import { getAccessToken } from "./authService";
import { API_BASE_URL } from "../config/data";

export const registerData = async (endpoint, data) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }
    const response = await axios.post(
      `${API_BASE_URL}${endpoint}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al registrar en ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }
    
    const response = await axios.patch( // Cambiado de PUT a PATCH
      `http://127.0.0.1:8000/inventario/editar_usuarios/${userId}/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al editar usuario:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }
    
    const response = await axios.put(
      `http://127.0.0.1:8000/inventario/${endpoint}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar en ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

export const patchData = async (endpoint, data = {}) => { 
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }
    
   
    const response = await axios.patch(
      `${API_BASE_URL}${endpoint}/`,
      data, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message;
    console.error(`Error al aplicar PATCH en ${endpoint}:`, errorMessage);
    throw new Error(errorMessage);
  }
};
