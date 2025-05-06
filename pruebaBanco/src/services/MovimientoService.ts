import { Movimiento } from "../models/Movimiento";
import apiClient from "./interceptos";

export class MovimientoService {

    insertMovimiento(mov: Movimiento): Promise<Movimiento> {
        return new Promise((resolve, reject) => {
            apiClient.post("banco/movimientos/", mov)
                .then(res => resolve(res.data))
                .catch(err => {
                    let msg = "Error al registrar movimiento";
                
                    if (err.response?.data) {
                        const data = err.response.data;
                
                        if (typeof data === "string") {
                            msg = data;
                        } else if (data.detail) {
                            msg = data.detail;
                        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
                            msg = data.non_field_errors[0];
                        } else {
                            msg = JSON.stringify(data);
                        }
                    }
                
                    reject(new Error(msg));
                });                
                
        });
    }

    //obtiene los mov de una cuenta por id
    getPorCuenta(id: number): Promise<Movimiento[]> {
        return apiClient.get(`/banco/movimientos/cuenta/${id}/`).then(res => res.data)
    }
    
    
    
}
