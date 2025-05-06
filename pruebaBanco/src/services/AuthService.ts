import axios from "axios";
import { LoginResponse } from "../models/dto/LoginResponse";
import { RefreshTokenResponse } from "../models/dto/RefreshTokenResponse";
import { RegisterResponse } from "../models/dto/RegisterResponse";
import apiClient from "./interceptos"

export class AuthService {
    login(username: string, password: string): Promise<LoginResponse> {
        return axios.post("http://localhost:8000/api/token/", {
            username,
            password
        }).then((res) => res.data)
    }

    refreshToken(refresh: string): Promise<RefreshTokenResponse> {
        return axios.post("http://localhost:8000/api/token/refresh/", {
            refresh
        }).then((res) => res.data)
    }

    register(email: string, password: string): Promise<RegisterResponse> {
        return axios.post("http://localhost:8000/banco/auth/register/", {
            email,
            password
        }).then((res) => res.data)
    }

    getMe(): Promise<{ email: string }> {
        return apiClient.get("banco/auth/me/")
            .then(res => res.data)
    }


}
