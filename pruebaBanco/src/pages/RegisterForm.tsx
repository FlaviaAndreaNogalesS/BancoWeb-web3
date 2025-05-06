import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { AuthService } from "../services/AuthService";
import { Container } from "../components/Container";

type Inputs = {
    email: string;
    password: string;
};

export const RegisterForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        new AuthService().register(data.email, data.password)
            .then(() => {
                alert("Registro exitoso");
                navigate(URLS.LOGIN); //navega
            })
            .catch((err) => alert(err.message));
    };

    return (
        <Container>
            <Card title="Registro de usuario">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label>Email</label>
                        <Input {...register("email", { required: true })} />
                        {errors.email && <span>Este campo es requerido</span>}
                    </FormField>
                    <FormField>
                        <label>Contraseña</label>
                        <Input type="password" {...register("password", { required: true })} />
                        {errors.password && <span>Este campo es requerido</span>}
                    </FormField>
                    <Button type="submit" title="Registrarse" />
                </form>
            </Card>
        </Container>
    );
};
