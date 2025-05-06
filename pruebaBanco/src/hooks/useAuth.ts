import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { AuthService } from "../services/AuthService";

type LoginParams = {
    access_token: string;
    refresh_token: string;
    email: string;
};

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const email = useAppSelector((state) => state.auth.email);

    const doLogin = (params: LoginParams) => {
        dispatch(loginUser(params.email));
        localStorage.setItem("access_token", params.access_token);
        localStorage.setItem("refresh_token", params.refresh_token);
    };

    const doLogout = () => {
        dispatch(logoutUser());
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    };

   //verifica si hay token al cargar
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token && !email) {
            new AuthService().getMe()
                .then((res) => {
                    dispatch(loginUser(res.email)); // recupera email
                })
                .catch(() => {
                    doLogout(); // si el token no es válido
                });
        }
    }, [email]);

    return { email, doLogin, doLogout };
};
