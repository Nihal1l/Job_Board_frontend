import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = (import.meta.env.VITE_BACKEND_URL || (isLocal ? "http://127.0.0.1:8000" : "https://job-board-backend-api.onrender.com")) + "/api/v1/";

export default axios.create({
  baseURL
});