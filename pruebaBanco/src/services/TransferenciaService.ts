import { Transferencia } from "../models/Transferencia";
import apiClient from "./interceptos";

export class TransferenciaService {

    //registra una transferencia
    insert(transf: Transferencia): Promise<Transferencia> {
        return new Promise((resolve, reject) => {
            apiClient.post("banco/transferencias/", transf)
                .then(res => resolve(res.data))
                .catch(err => {
                    let msg = "Error al realizar transferencia";
                    
                    if (err.response?.data) {
                        const data = err.response.data;
    
                        // Verifica distintos formatos posibles del error
                        if (typeof data === "string") msg = data;
                        else if (data.detail) msg = data.detail;
                        else if (data.non_field_errors?.length) msg = data.non_field_errors.join("\n");
                        else msg = JSON.stringify(data);
                    }
    
                    reject(new Error(msg));
                });
        });
    }
    
}
