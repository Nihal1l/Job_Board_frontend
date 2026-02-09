import axios from "axios";

export default axios.create({
  baseURL: "https://job-board-backend-api.vercel.app/api/v1",
});