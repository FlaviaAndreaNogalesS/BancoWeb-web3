import { useForm, SubmitHandler } from "react-hook-form";
import { Transferencia } from "../models/Transferencia";
import { TransferenciaService } from "../services/TransferenciaService";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { Beneficiario } from "../models/Beneficiario";
import { BeneficiarioService } from "../services/BeneficiarioService";
import { Cuenta } from "../models/Cuenta";
import { CuentaService } from "../services/CuentaService";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";

export const TransferenciaForm = () => {
    const { register, handleSubmit } = useForm<Transferencia>();
    const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]); //lista de benes
    const [cuentas, setCuentas] = useState<Cuenta[]>([]); //lista de cuentas del user
    const [cuentaOrigen, setCuentaOrigen] = useState<number | null>(null); //id cuenta selec
    const navigate = useNavigate();

    useEffect(() => {
        //obtiene los benes y cuentas
        new BeneficiarioService().getAll().then(setBeneficiarios);
        new CuentaService().getMisCuentas()
            .then(data => {
                setCuentas(data);
                if (data.length > 0) setCuentaOrigen(Number(data[0].id));
            })
            .catch(() => alert("No se pudieron cargar tus cuentas"));
    }, []);

    const onSubmit: SubmitHandler<Transferencia> = (data) => {
        if (!cuentaOrigen) return;

        data.cuenta_origen = cuentaOrigen; //asignamos cuenta origen
        data.beneficiario = Number(data.beneficiario); // Convierte el id del benefiiario a num

        new TransferenciaService().insert(data) //llama servicio
            .then(() => {
                alert("Transferencia realizada");
                navigate(URLS.DASHBOARD);
            })
            .catch(err => alert(err.message));
    };

    return (
        <Container>
            <Card title="Nueva Transferencia">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label>Cuenta origen:</label>
                        <select
                            value={cuentaOrigen ?? ''}
                            onChange={e => setCuentaOrigen(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Selecciona una cuenta</option>
                            {cuentas.map(c => (
                                <option key={c.id} value={Number(c.id)}>
                                    {c.nombre_completo} - {c.nro_cuenta} (Saldo: ${Number(c.saldo).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField>
                        <label>Beneficiario:</label>
                        <select {...register("beneficiario")} className="w-full p-2 border rounded">
                            {beneficiarios.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.nombre} - {b.nro_cuenta}
                                </option>
                            ))}
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

                    <Button type="submit" title="Transferir" />
                </form>
            </Card>
        </Container>
    );
};
