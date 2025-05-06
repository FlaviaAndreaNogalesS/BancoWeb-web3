import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
//import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { URLS } from "../navigation/CONTANTS";
import { useAuth } from "../hooks/useAuth";
import { Cuenta } from "../models/Cuenta";
import { CuentaService } from "../services/CuentaService";

const Dashboard = () => {
    const navigate = useNavigate();
    const { email, doLogout } = useAuth(); //Hook obtiene el email
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);

    //carga las cuentas
    useEffect(() => {
        new CuentaService().getMisCuentas()
            .then((data) => setCuentas(data))
            .catch(() => setCuentas([]));
    }, []);

    //cerrar sesion
    const handleLogout = () => {
        doLogout();
        navigate("/login");
    };

    return (
        <Container>
            <Card title="Bienvenido al Sistema Bancario">
                <p className="text-lg mb-2">
                    <strong>Sesión iniciada como:</strong> {email ?? "usuario"}
                </p>

                {/* Botones de acción */}
                <div className="flex flex-wrap gap-3 my-4">
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded">
                        Cerrar sesión
                    </button>
                    <button onClick={() => navigate(URLS.CUENTA.MOVIMIENTO)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
                        Registrar ingreso o egreso
                    </button>
                    <button onClick={() => navigate(URLS.TRANSFERENCIA)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded">
                        Hacer una transferencia
                    </button>
                    <button onClick={() => navigate(URLS.BENEFICIARIOS)} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
                        Administrar beneficiarios
                    </button>
                    <button onClick={() => navigate(URLS.CUENTA.NUEVA)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded">
                        Crear nueva cuenta bancaria
                    </button>
                </div>

                <hr className="my-4" />

                {/* Lista de cuentas */}
                {cuentas.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {cuentas.map((cuenta) => (
                            <div key={cuenta.id} className="bg-white text-gray-800 p-4 rounded shadow-md border">
                                <p><strong>Nombre completo:</strong> {cuenta.nombre_completo}</p>
                                <p><strong>CI:</strong> {cuenta.ci}</p>
                                <p><strong>Nro de cuenta:</strong> {cuenta.nro_cuenta}</p>
                                <p><strong>Saldo:</strong> ${Number(cuenta.saldo).toFixed(2)}</p>
                                <button
                                    onClick={() => navigate(URLS.CUENTA.MOVIMIENTOS(Number(cuenta.id)))}
                                    className="mt-3 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded"
                                >
                                    Ver movimientos
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 mt-4">No tienes cuentas bancarias aún.</p>
                )}
            </Card>
        </Container>
    );
};

export default Dashboard;
