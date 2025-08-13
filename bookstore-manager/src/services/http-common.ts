// src/services/http-common.ts
import axios, { type AxiosInstance } from "axios";

// Get the API base URL from environment variables
const getApiBaseUrl = () => {
   // Use environment variable if available, otherwise fall back to development logic
   const envUrl = import.meta.env.VITE_API_BASE_URL;
   if (envUrl) {
      return envUrl;
   }

   // Fallback logic - only for development
   if (import.meta.env.DEV) {
      return "http://localhost:60730/api/v1";
   }

   // If no environment variable and not in dev mode, throw an error
   throw new Error(
      "VITE_API_BASE_URL environment variable is required for production builds"
   );
};

const http: AxiosInstance = axios.create({
   baseURL: getApiBaseUrl(),
   headers: {
      "Content-Type": "application/json",
   },
});

export default http;
