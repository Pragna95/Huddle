import axios from "axios";
import "@/lib/api"; // Import lib/api to register global request interceptors

const dataURL = import.meta.env.VITE_DATA_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${dataURL}/api/meetings/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;