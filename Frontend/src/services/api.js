import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your Node.js backend URL
});

// Interceptor: Attach JWT Token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
