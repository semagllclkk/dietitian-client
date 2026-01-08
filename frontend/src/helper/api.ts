import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
});

export function setToken(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
