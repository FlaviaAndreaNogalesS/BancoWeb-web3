export interface Transferencia {
    id?: number;
    cuenta_origen: number;
    beneficiario: number;
    monto: number;
    descripcion?: string;
    fecha?: string;
}
