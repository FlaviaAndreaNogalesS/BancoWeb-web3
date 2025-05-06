import axios from "axios";
import { AuthService } from "./AuthService";

const apiClient = axios.create({ //url backend
    baseURL: "http://localhost:8000/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
});

//Añade el token de acceso a cada petición
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error("Error en la solicitud: ", error);
    return Promise.reject(error);
});

//respuestas de error
apiClient.interceptors.response.use((response) => response, async (error) => {
    if (error.response?.status === 401) {
        try {
            const tokenResponse = await new AuthService().refreshToken(localStorage.getItem("refresh_token")!);
            localStorage.setItem("access_token", tokenResponse.access);
            error.config.headers["Authorization"] = `Bearer ${tokenResponse.access}`;
            return apiClient.request(error.config);
        } catch (authError) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(authError);
        }
    }

    return Promise.reject(error);
});

export default apiClient;
