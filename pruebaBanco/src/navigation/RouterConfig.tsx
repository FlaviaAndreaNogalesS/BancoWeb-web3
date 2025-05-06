import { Routes, Route, Navigate } from "react-router";
import { CuentaForm } from "../pages/CuentaForm";
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/RegisterForm";
import Dashboard from "../pages/Dashboard";
import { URLS } from "./CONTANTS";
import { useAuth } from "../hooks/useAuth";
import BeneficiarioList from "../pages/BeneficiarioList";
import { TransferenciaForm } from "../pages/TransferenciaForm";
import { MovimientoForm } from "../pages/MovimientoForm";
import MovimientoList from "../pages/MovimientoList";

const RouterConfig = () => {
    const { email } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    email
                        ? <Navigate to={URLS.DASHBOARD} replace />
                        : <Navigate to={URLS.LOGIN} replace />
                }
            />
            <Route path={URLS.LOGIN} element={<LoginForm />} />
            <Route path={URLS.REGISTER} element={<RegisterForm />} />
            <Route path={URLS.DASHBOARD} element={<Dashboard />} />
            <Route path={URLS.CUENTA.NUEVA} element={<CuentaForm />} />
            <Route path={URLS.CUENTA.MOVIMIENTO} element={<MovimientoForm />} />
            <Route path={URLS.TRANSFERENCIA} element={<TransferenciaForm />} />
            <Route path={URLS.BENEFICIARIOS} element={<BeneficiarioList />} />
            <Route path="/cuenta/:cuentaId/movimientos" element={<MovimientoList />} />
            
        </Routes>
    );
};

export default RouterConfig;
