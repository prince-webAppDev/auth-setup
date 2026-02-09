import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3210",
  withCredentials: true // REQUIRED for cookies
});

// auto refresh access token
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      try {
        await api.post("/api/auth/refresh");
        return api(err.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
