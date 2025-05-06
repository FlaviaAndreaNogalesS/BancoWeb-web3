from rest_framework import serializers
from banco.models.cuenta import Transferencia

class TransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transferencia
        fields = '__all__'
        read_only_fields = ['fecha']
