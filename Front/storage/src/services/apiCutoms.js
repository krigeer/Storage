import axios from "axios";
import { getAccessToken } from "./authService";

export const apiCall = async (endpoint) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }

    const response = await axios.get(
      `http://127.0.0.1:8000/inventario/${endpoint}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al consultar ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};
