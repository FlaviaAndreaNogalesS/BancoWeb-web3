from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')

class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny] #cualquiera

    #registro
    @action(methods=['post'], detail=False, url_path='register')
    def register(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=400)
        if User.objects.filter(username=email).exists():
            return Response({'error': 'Usuario ya existe'}, status=400)
        user = User.objects.create_user(username=email, email=email, password=password)
        return Response({'id': user.id, 'email': user.email}, status=201)

    @action(detail=False, methods=["get"], url_path="me", permission_classes=[IsAuthenticated])
    def me(self, request):
        #devuelve el email
        return Response({"email": request.user.email})

