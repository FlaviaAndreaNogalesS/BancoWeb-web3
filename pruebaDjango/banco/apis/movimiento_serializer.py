from rest_framework import serializers
from banco.models.cuenta import Movimiento

class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = '__all__'
        read_only_fields = ['fecha']
