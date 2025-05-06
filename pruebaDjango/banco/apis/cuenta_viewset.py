from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated
from banco.models import CuentaBancaria
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

class CuentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaBancaria
        fields = '__all__'
        read_only_fields = ['nro_cuenta', 'usuario']

class CuentaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] #solo autorizados
    serializer_class = CuentaSerializer
    queryset = CuentaBancaria.objects.all()

    def get_queryset(self):
        #devuelve las cuentas
        return CuentaBancaria.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Genera número de cuenta aleatorio único
        import random
        while True:
            nro = str(random.randint(10 ** 9, 10 ** 10 - 1))
            if not CuentaBancaria.objects.filter(nro_cuenta=nro).exists():
                break
        #guarda
        serializer.save(usuario=self.request.user, nro_cuenta=nro)

    #verifica si existe una cuenta con ese numero
    @action(detail=False, methods=["get"], url_path="numero/(?P<nro_cuenta>[^/.]+)")
    def verificar_nro_cuenta(self, request, nro_cuenta=None):
        existe = CuentaBancaria.objects.filter(nro_cuenta=nro_cuenta).exists()
        if not existe:
             return Response({"detail": "No existe cuenta con ese número"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"detail": "Cuenta válida"})
