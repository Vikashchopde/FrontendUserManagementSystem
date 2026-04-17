import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-user-management-system-eight.vercel.app",
});

// attach token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;