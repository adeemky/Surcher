import axios from "axios";

const BASE_URL = "http://localhost:8000/api/user";

export const loginUser = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/token/`, {
    username,
    password,
  });

  if (response.status === 200) {
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    return true;
  } else {
    throw new Error("Login failed");
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("access");
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const response = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
  localStorage.setItem("access", response.data.access);
  return response.data.access;
};
