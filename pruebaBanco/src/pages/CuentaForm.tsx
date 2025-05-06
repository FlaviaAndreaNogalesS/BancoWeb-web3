import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "../components/Input"
import { FormField } from "../components/FormField"
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { CuentaService } from "../services/CuentaService";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";

type Inputs = {
    nombre_completo: string
    ci: string
}

export const CuentaForm = () => {
    const navigate = useNavigate()
    useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        new CuentaService().insertCuenta(data)
            .then(() => {
                alert("Cuenta creada exitosamente")
                navigate(URLS.DASHBOARD)
            })
            .catch((error) => {
                console.error("Error al crear cuenta:", error)
                alert("Error al crear cuenta")
            })
    }

    return (
        <Container>
            <Card title="Crear Cuenta Bancaria" className="mx-5 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label htmlFor="nombre_completo">Nombre completo:</label>
                        <Input id="nombre_completo" {...register("nombre_completo", { required: true })} />
                        {errors.nombre_completo && <span>Este campo es requerido</span>}
                    </FormField>
                    <FormField>
                        <label htmlFor="ci">CI:</label>
                        <Input id="ci" {...register("ci", { required: true })} />
                        {errors.ci && <span>Este campo es requerido</span>}
                    </FormField>
                    <Button type="submit" title="Crear Cuenta" />
                </form>
            </Card>
        </Container>
    );
}
