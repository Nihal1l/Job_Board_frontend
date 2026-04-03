const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || (isLocal ? "http://127.0.0.1:8000" : "https://job-board-backend-api.onrender.com")) + "/api/v1/";

export const WS_BASE_URL = (import.meta.env.VITE_WS_URL || (isLocal ? "ws://127.0.0.1:8000" : "wss://job-board-backend-api.onrender.com")) + "/ws/chat";
