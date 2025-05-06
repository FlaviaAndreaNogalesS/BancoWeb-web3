import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import { Container } from "../components/Container";

type Inputs = {
    email: string;
    password: string;
};

export const LoginForm = () => {

    const navigate = useNavigate(); //redirigir
    const { doLogin } = useAuth(); //gestiona sesion
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    //ejecuta login
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        new AuthService().login(data.email, data.password)
            .then(response => {
                doLogin({
                    access_token: response.access,
                    refresh_token: response.refresh,
                    email: data.email
                });
                navigate(URLS.DASHBOARD);
            })
            .catch(err => alert(err.message));
    };

    return (
        <Container>
            <Card title="Iniciar sesión">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label>Email</label>
                        <Input {...register("email", { required: true })} />
                        {errors.email && <span>Campo requerido</span>}
                    </FormField>
                    <FormField>
                        <label>Contraseña</label>
                        <Input type="password" {...register("password", { required: true })} />
                        {errors.password && <span>Campo requerido</span>}
                    </FormField>
                    <Button type="submit" title="Iniciar sesión" />
                </form>
    
                <div className="mt-4 text-center">
                    <span>¿No tienes cuenta?</span>
                    <br />
                    <Button title="Registrarse" onClick={() => navigate(URLS.REGISTER)} />
                </div>
            </Card>
        </Container>
    );    
};
