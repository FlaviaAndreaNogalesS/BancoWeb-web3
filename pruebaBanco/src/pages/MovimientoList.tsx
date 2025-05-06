import { useEffect, useState } from "react";
import { Movimiento } from "../models/Movimiento";
import { MovimientoService } from "../services/MovimientoService";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { useParams } from "react-router";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";

const MovimientoList = () => {
    const { cuentaId } = useParams(); //obtiene id
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const navigate = useNavigate();

    useEffect(() => { //obtiene los movimientos
        if (cuentaId) {
            new MovimientoService().getPorCuenta(Number(cuentaId))
                .then(setMovimientos)
                .catch(() => alert("No se pudo obtener los movimientos."));
        }
    }, [cuentaId]);

    return (
        <Container>
            <Card title={`Movimientos de la cuenta #${cuentaId}`}>
                <Button title="Volver al dashboard" onClick={() => navigate(URLS.DASHBOARD)} />
                <div className="mt-4">
                    {movimientos.length === 0 ? (
                        <p>No hay movimientos para esta cuenta.</p>
                    ) : (
                        <ul>
                            {movimientos.map((m) => (
                                <li key={m.id} className="border-b py-2">
                                    <strong>{m.tipo}</strong> - ${Number(m.monto).toFixed(2)} - {m.fecha ? new Date(m.fecha).toLocaleString() : "Fecha no disponible"}
                                    <br />
                                    <em>{m.descripcion}</em>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Card>
        </Container>
    );
};

export default MovimientoList;
