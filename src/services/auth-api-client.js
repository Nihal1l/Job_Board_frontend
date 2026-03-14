import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocal 
  ? "http://127.0.0.1:8000/api/v1" 
  : "https://job-board-backend-api.vercel.app/api/v1";

const authApiClient = axios.create({
  baseURL
});


authApiClient.interceptors.request.use(
  (config) => {
    const tokensRaw = localStorage.getItem("authTokens");
    if (tokensRaw) {
      const tokens = JSON.parse(tokensRaw);
      if (tokens?.access) {
        config.headers.Authorization = `JWT ${tokens.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 and it's not a retry already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokensRaw = localStorage.getItem("authTokens");
        const tokens = tokensRaw ? JSON.parse(tokensRaw) : null;
        
        if (tokens?.refresh) {
          console.log("Token expired. Attempting refresh...");
          const res = await axios.post(`${baseURL}/auth/jwt/refresh/`, { 
            refresh: tokens.refresh 
          });
          
          if (res.status === 200) {
            console.log("Token refreshed successfully.");
            const newTokens = { ...tokens, access: res.data.access };
            localStorage.setItem("authTokens", JSON.stringify(newTokens));
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `JWT ${res.data.access}`;
            return authApiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login if refresh fails
        localStorage.removeItem("authTokens");
        if (window.location.pathname !== "/login") {
           window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default authApiClient;