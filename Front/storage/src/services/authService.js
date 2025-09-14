import axios from "axios";

const API_URL = "http://127.0.0.1:8000/inventario"; 

export const login = async ({ documento, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      documento,
      password,
    });

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Error en el inicio de sesión"
    );
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};


export const getAccessToken = () => localStorage.getItem("access");
export const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
