from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from banco.models.cuenta import Movimiento, CuentaBancaria
from .movimiento_serializer import MovimientoSerializer

class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [permissions.IsAuthenticated]

    #devuelve los movimientos de las cuentas
    def get_queryset(self):
        return Movimiento.objects.filter(cuenta__usuario=self.request.user)

    #lista los mvs por id de la cuenta
    @action(detail=False, methods=["get"], url_path="cuenta/(?P<cuenta_id>[^/.]+)")
    def listar_por_cuenta(self, request, cuenta_id=None):
        try:
            cuenta = CuentaBancaria.objects.get(id=cuenta_id, usuario=request.user)
        except CuentaBancaria.DoesNotExist:
            return Response({"detail": "Cuenta no encontrada o no pertenece al usuario"}, status=status.HTTP_404_NOT_FOUND)
        #filtra y ordena descente
        movimientos = Movimiento.objects.filter(cuenta=cuenta).order_by("-fecha")
        serializer = self.get_serializer(movimientos, many=True)
        return Response(serializer.data)
