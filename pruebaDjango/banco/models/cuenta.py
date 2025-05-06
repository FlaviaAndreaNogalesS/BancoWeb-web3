from django.db import models
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

class CuentaBancaria(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=255)
    ci = models.CharField(max_length=20)
    nro_cuenta = models.CharField(max_length=20, unique=True, editable=False)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.nombre_completo} - {self.nro_cuenta}"

class Movimiento(models.Model):
    TIPO_CHOICES = (
        ('INGRESO', 'Ingreso'),
        ('EGRESO', 'Egreso'),
    )

    cuenta = models.ForeignKey(CuentaBancaria, on_delete=models.CASCADE, related_name="movimientos")
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            if self.tipo == 'INGRESO':
                self.cuenta.saldo += self.monto  # Suma
            elif self.tipo == 'EGRESO':
                if self.monto > self.cuenta.saldo:
                    raise ValidationError("Saldo insuficiente")  # Verifica que haya saldo
                self.cuenta.saldo -= self.monto  # Resta
            self.cuenta.save()  # Guarda el nuevo saldo actualizado
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo} - {self.monto} ({self.fecha.date()})"

# Almacena los beneficiarios
class Beneficiario(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="beneficiarios")
    nombre = models.CharField(max_length=255)
    nro_cuenta = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nombre} ({self.nro_cuenta})"

#Registra las transferencias entre cuentas
class Transferencia(models.Model):
    cuenta_origen = models.ForeignKey(CuentaBancaria, on_delete=models.CASCADE, related_name="transferencias_realizadas")
    beneficiario = models.ForeignKey(Beneficiario, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            if self.monto > self.cuenta_origen.saldo:
                raise ValidationError("Saldo insuficiente para transferencia.")

            # Verifica si la cuenta destino existe
            try:
                cuenta_destino = CuentaBancaria.objects.get(nro_cuenta=self.beneficiario.nro_cuenta)
            except CuentaBancaria.DoesNotExist:
                raise ValidationError("La cuenta del beneficiario no existe.")

            # Registra el egreso
            Movimiento.objects.create(
                cuenta=self.cuenta_origen,
                tipo="EGRESO",
                monto=self.monto,
                descripcion=f"Transferencia a {self.beneficiario.nombre}"
            )

            # Registra el ingreso
            Movimiento.objects.create(
                cuenta=cuenta_destino,
                tipo="INGRESO",
                monto=self.monto,
                descripcion=f"Transferencia recibida de {self.cuenta_origen.nombre_completo}"
            )

        super().save(*args, **kwargs)
