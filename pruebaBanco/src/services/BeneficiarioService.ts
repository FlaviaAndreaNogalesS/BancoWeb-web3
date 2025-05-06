import { Beneficiario } from "../models/Beneficiario";
import apiClient from "./interceptos";

export class BeneficiarioService {
    getAll(): Promise<Beneficiario[]> {
        return apiClient.get("banco/beneficiarios/").then(res => res.data);
    }

    insert(benef: Beneficiario): Promise<Beneficiario> {
        return apiClient.post("banco/beneficiarios/", benef).then(res => res.data);
    }

    delete(id: number): Promise<void> {
        return apiClient.delete(`banco/beneficiarios/${id}/`);
    }
    
    update(id: number, benef: Beneficiario): Promise<Beneficiario> {
        return apiClient.put(`banco/beneficiarios/${id}/`, benef).then(res => res.data);
    }
    
}
