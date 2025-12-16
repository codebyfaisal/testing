import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:4000/api/v1",
    baseURL: "https://testing-psi-pied.vercel.app/api/v1",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Something went wrong";
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);

export default api;
