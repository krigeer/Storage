import axios from "axios";
import { getAccessToken } from "./authService";
import { API_BASE_URL } from "../config/data";

export const apiCall = async (endpoint) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }

    const response = await axios.get(
      `${API_BASE_URL}${endpoint}/`,
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
