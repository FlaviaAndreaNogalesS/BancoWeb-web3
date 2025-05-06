from django.urls import path, include
from rest_framework import routers
from banco.apis.cuenta_viewset import CuentaViewSet
from banco.apis.user_viewset import UserViewSet
from banco.apis.movimiento_viewset import MovimientoViewSet
from banco.apis.beneficiario_viewset import BeneficiarioViewSet
from banco.apis.transferencia_viewset import TransferenciaViewSet
router = routers.DefaultRouter()
router.register("auth", UserViewSet, basename="auth")
router.register(r"movimientos", MovimientoViewSet, basename="movimientos")
router.register(r"beneficiarios", BeneficiarioViewSet, basename="beneficiarios")
router.register(r"transferencias", TransferenciaViewSet, basename="transferencias")
router.register(r'cuentas', CuentaViewSet, basename='cuentas')
urlpatterns = [
    path('', include(router.urls)),
]
