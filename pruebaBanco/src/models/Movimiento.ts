export interface Movimiento {
    id?: number;
    cuenta: number;
    tipo: "INGRESO" | "EGRESO";
    monto: number;
    descripcion?: string;
    fecha?: string;
}
