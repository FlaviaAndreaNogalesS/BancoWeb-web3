from rest_framework import viewsets, permissions
from banco.models.cuenta import Beneficiario
from .beneficiario_serializer import BeneficiarioSerializer

class BeneficiarioViewSet(viewsets.ModelViewSet):
    serializer_class = BeneficiarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    #filtra benes p cada user
    def get_queryset(self):
        return Beneficiario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
