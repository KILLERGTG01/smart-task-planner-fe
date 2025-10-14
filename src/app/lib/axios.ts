import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 60000,
});

api.interceptors.request.use(async (cfg) => {
  if (!cfg) return cfg;
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return cfg;
});

export default api;
