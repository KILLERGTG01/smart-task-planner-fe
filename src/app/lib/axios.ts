// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 60000,
});

api.interceptors.request.use(async (cfg) => {
  if (!cfg) return cfg;
  try {
    // token is stored by Auth0 wrapper (localStorage) when user logs in
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore
  }
  return cfg;
});

export default api;
