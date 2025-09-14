from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import Usuario, Rol, TipoDocumento, Centro, EstadoUsuario, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, TipoTecnologia, MaterialDidactico
from .models import Tecnologia, Prestamo, Reporte, PrioridadReporte, EstadoReporte

class LoginSerializer(serializers.Serializer):
    documento = serializers.IntegerField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        documento = data.get("documento")
        password = data.get("password")

        try:
            usuario = Usuario.objects.get(documento=documento)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado")


        if not usuario.check_password(password):
            raise serializers.ValidationError("Contraseña incorrecta")

        user = authenticate(username=usuario.username, password=password)
        if not user:
            raise serializers.ValidationError("Credenciales inválidas")

        if not user.is_active:
            raise serializers.ValidationError("Usuario inactivo")

        data["user"] = user
        return data


#Tablas Heredadas 
class CentroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centro
        fields = '__all__'

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = '__all__'


class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = '__all__'

class EstadoInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoInventario
        fields = '__all__'


class TipoTecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTecnologia
        fields = '__all__'
        
    
class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'


class TipoReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReporte
        fields = '__all__'


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
        fields = '__all__'
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
        }

    def create(self, validated_data):
        # Generar contraseña segura (12 caracteres con letras, dígitos y símbolos)
        alfabeto = string.ascii_letters + string.digits + "!@#$%^&*()"
        contrasena_generada = ''.join(secrets.choice(alfabeto) for _ in range(12))

        # Crear instancia sin guardar aún
        usuario = Usuario(**validated_data)
        usuario.establecer_contrasena(contrasena_generada)  # Usa tu método seguro

        # Guardar en DB
        usuario.save()

        # Enviar correo con credenciales
        enviar_correo_credenciales(usuario.email, contrasena_generada)

        return usuario

