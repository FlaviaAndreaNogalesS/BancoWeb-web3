import { Cuenta } from "../models/Cuenta"
import apiClient from "./interceptos"

export class CuentaService {
    insertCuenta(cuenta: Cuenta): Promise<Cuenta> {
        return new Promise<Cuenta>((resolve, reject) => {
            apiClient.post("banco/cuentas/", cuenta)
                .then((response) => resolve(response.data))
                .catch((error) => reject(new Error("Error al crear la cuenta: " + error.message)))
        })
    }

    /*
    getMiCuenta(): Promise<Cuenta> {
        return new Promise<Cuenta>((resolve, reject) => {
            apiClient.get("banco/cuentas/")
                .then((response) => resolve(response.data[0])) // porque get_queryset devuelve 1
                .catch((error) => reject(new Error("Error al obtener la cuenta: " + error.message)))
        })
    }*/

    getMisCuentas(): Promise<Cuenta[]> {
        return apiClient.get("banco/cuentas/").then(res => res.data);
    }      

    verificarCuentaPorNumero(nro_cuenta: string): Promise<void> {
        return apiClient.get(`banco/cuentas/numero/${nro_cuenta}/`)
            .then(() => {}); // si encuentra, no hace nada
    }
    
}
