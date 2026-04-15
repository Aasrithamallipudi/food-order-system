import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "https://food-order-system-4.onrender.com/api").replace(/\/$/, "")
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  console.log("Full URL:", config.baseURL + config.url);
  console.log("Headers:", config.headers);
  
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.config?.url, error.message);
    console.error("Error details:", error.response?.data || error);
    return Promise.reject(error);
  }
);

export default api;
