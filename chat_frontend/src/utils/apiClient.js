import axios from "axios";

export const endpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

const apiClient = axios.create({
  baseURL: endpoint
});

export default apiClient;
