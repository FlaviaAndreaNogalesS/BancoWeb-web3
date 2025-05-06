from rest_framework import serializers
from banco.models.cuenta import Beneficiario

class BeneficiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiario
        fields = '__all__'
        read_only_fields = ['usuario']
