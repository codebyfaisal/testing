import axios from "axios";

export const BASE_API_URL = "http://localhost:4000/api/v1";
// export const BASE_API_URL = "https://testing-psi-pied.vercel.app/api/v1"

const api = axios.create({
    baseURL: BASE_API_URL,
});

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Something went wrong";
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);

export default api;
