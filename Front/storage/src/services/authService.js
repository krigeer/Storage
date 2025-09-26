import axios from "axios";

const API_URL = "http://127.0.0.1:8000/inventario";

export const login = async ({ documento, password }) => {
  try {
    const response = await axios.post(
      `${API_URL}/login/`,
      { documento, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const { Refresh, Access, user } = response.data;

    localStorage.setItem("accessToken", Access);
    localStorage.setItem("refreshToken", Refresh);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error("Error login:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      "Error en la autenticación"
    );
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export function removeAccessToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}