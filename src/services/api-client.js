import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocal 
  ? "http://127.0.0.1:8000/api/v1" 
  : "https://job-board-backend-api.vercel.app/api/v1";

export default axios.create({
  baseURL
});