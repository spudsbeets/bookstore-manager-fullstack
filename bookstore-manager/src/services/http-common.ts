// src/services/http-common.ts
import axios, { type AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
   baseURL: "http://localhost:3001/api/v1", // Backend is running on port 3001
   headers: {
      "Content-Type": "application/json",
   },
});

export default http;
