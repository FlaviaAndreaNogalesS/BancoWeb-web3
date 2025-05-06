export const URLS = {
    HOME: '/login',
    LOGIN: '/login',
    REGISTER: '/register',
    CUENTA: {
        NUEVA: '/cuenta/nueva',
        MOVIMIENTO: '/cuenta/movimiento',
        MOVIMIENTOS: (id: number) => `/cuenta/${id}/movimientos`
    },
    DASHBOARD: '/dashboard',
    TRANSFERENCIA: '/transferencia',
    BENEFICIARIOS: '/beneficiarios',
}
