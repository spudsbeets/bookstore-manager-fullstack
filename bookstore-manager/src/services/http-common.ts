// src/services/http-common.ts
import axios, { type AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
   baseURL: "http://classwork.engr.oregonstate.edu:60730/api/v1", // Backend is running on port 60730
   headers: {
      "Content-Type": "application/json",
   },
});

export default http;
