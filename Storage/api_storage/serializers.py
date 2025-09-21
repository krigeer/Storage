from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from rest_framework.decorators import permission_classes
from .models import Usuario, Rol, TipoDocumento, Centro, EstadoUsuario, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, TipoTecnologia, MaterialDidactico
from .models import Tecnologia, Prestamo, Reporte, PrioridadReporte, EstadoReporte
import secrets
import string

class LoginSerializer(serializers.Serializer):
    documento = serializers.IntegerField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        documento = data.get("documento")
        password = data.get("password")

        try:
            usuario = Usuario.objects.get(documento=documento)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError({"message": "Usuario no encontrado"})

        if not usuario.check_password(password):
            raise serializers.ValidationError({"message": "Contraseña incorrecta"})

        if not usuario.is_active:
            raise serializers.ValidationError({"message": "Usuario inactivo"})
        
        

        data["user"] = usuario
        return data


#Tablas Heredadas 
class CentroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centro
        exclude = ['id', 'actualizado_en', 'creado_en']

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        exclude = ['id']

class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        exclude = ['id']


class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        exclude = ['id']

class EstadoInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoInventario
        exclude = ['id']


class TipoTecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTecnologia
        exclude = ['id']
        
    
class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        exclude = ['id']


class TipoReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReporte
        exclude = ['id']


class PrioridadReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrioridadReporte
        fields = '__all__'

class EstadoReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoReporte
        fields = '__all__'



#Tablas que heredan

class TecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnologia
        fields = '__all__'

class MaterialDidacticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialDidactico
        fields = '__all__'


class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'



class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        exclude = ["groups", "user_permissions", "password"]

    def create(self, validated_data):
        # Generar contraseña aleatoria segura
        alfabeto = string.ascii_letters + string.digits + "!@#$%^&*()"
        contrasena_generada = ''.join(secrets.choice(alfabeto) for _ in range(12))

        # Crear usuario con contraseña
        usuario = Usuario(**validated_data)
        usuario.set_password(contrasena_generada)
        usuario.save()

        # Retornar usuario y contraseña generada
        usuario._contrasena_plana = contrasena_generada
        return usuario

