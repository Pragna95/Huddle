import axios from "axios";

// Read endpoints from environment variables
const dataURL = import.meta.env.VITE_DATA_URL || "http://localhost:8000";
const authURL = import.meta.env.VITE_AUTH_URL || "http://localhost:8002";

// Configure global interceptors for all Axios requests
axios.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem("api_key");
    const userId = localStorage.getItem("user_id");

    // Add API Key and User parameters depending on target URL
    if (config.url) {
      const isMicroservice = config.url.includes(dataURL) || config.url.includes("127.0.0.1:8000") || config.url.includes("localhost:8000");
      const isAuthBackend = config.url.includes(authURL) || config.url.includes("localhost:8001") || config.url.includes("localhost:8002") || config.url.startsWith('/api');

      if (isMicroservice) {
        if (apiKey) {
          config.headers["x-api-key"] = apiKey;
          config.headers["X-API-Key"] = apiKey;
        }
        // Send user_id in the body for POST/PUT requests to microservices
        if ((config.method === "post" || config.method === "put") && userId) {
          if (config.data && typeof config.data === "object") {
            config.data.user_id = userId;
          } else if (!config.data) {
            config.data = { user_id: userId };
          }
        }
      } else if (isAuthBackend) {
        if (apiKey) {
          config.headers["x-api-key"] = apiKey;
          config.headers["X-API-Key"] = apiKey;
        }
        if (userId) {
          config.headers["X-User-Id"] = userId;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const api = axios.create({
  baseURL: `${dataURL}/api`,
});

export default api;