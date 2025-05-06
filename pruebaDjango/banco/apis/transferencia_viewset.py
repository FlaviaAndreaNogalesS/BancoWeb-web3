from rest_framework import viewsets, permissions
from banco.models.cuenta import Transferencia
from .transferencia_serializer import TransferenciaSerializer

class TransferenciaViewSet(viewsets.ModelViewSet):
    serializer_class = TransferenciaSerializer
    permission_classes = [permissions.IsAuthenticated]

    #deuelve las trans realizadas
    def get_queryset(self):
        return Transferencia.objects.filter(cuenta_origen__usuario=self.request.user)
