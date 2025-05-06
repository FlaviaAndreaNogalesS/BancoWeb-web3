import { useForm, SubmitHandler } from "react-hook-form";
import { Movimiento } from "../models/Movimiento";
import { MovimientoService } from "../services/MovimientoService";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Cuenta } from "../models/Cuenta";
import { CuentaService } from "../services/CuentaService";
import { URLS } from "../navigation/CONTANTS";

export const MovimientoForm = () => {
    const { register, handleSubmit } = useForm<Movimiento>();
    const navigate = useNavigate();
    //cuntas diponibles
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    //seleccion de la cuenta
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<number | null>(null);

    //pide las cuentas y su preseleccion
    useEffect(() => {
        new CuentaService().getMisCuentas()
            .then(data => {
                setCuentas(data);
                if (data.length > 0) {
                    setCuentaSeleccionada(Number(data[0].id));
                }
            })
            .catch(() => alert("No se pudieron cargar las cuentas"));
    }, []);

    //ejecuta la solicitud
    const onSubmit: SubmitHandler<Movimiento> = (data) => {
        if (!cuentaSeleccionada) return;
        data.cuenta = cuentaSeleccionada; //cuenta selec
        new MovimientoService().insertMovimiento(data)
            .then(() => {
                alert("Movimiento registrado");
                navigate(URLS.DASHBOARD);
            })
            .catch(err => alert(err.message));
    };

    return (
        <Container>
            <Card title="Registrar Movimiento">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label>Cuenta:</label>
                        <select
                            value={cuentaSeleccionada ?? ''}
                            onChange={e => setCuentaSeleccionada(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Selecciona una cuenta</option>
                            {cuentas.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre_completo} - {c.nro_cuenta} (Saldo: ${Number(c.saldo).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField>
                        <label>Tipo:</label>
                        <select {...register("tipo")} className="w-full p-2 border rounded">
                            <option value="INGRESO">Ingreso</option>
                            <option value="EGRESO">Egreso</option>
                        </select>
                    </FormField>
                    <FormField>
                        <label>Monto:</label>
                        <Input type="number" step="0.01" {...register("monto", { required: true })} />
                    </FormField>
                    <FormField>
                        <label>Descripción:</label>
                        <Input {...register("descripcion")} />
                    </FormField>
                    <Button type="submit" title="Registrar" />
                </form>
            </Card>
        </Container>
    );
};
