from dataclasses import fields
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
        exclude = ['actualizado_en', 'creado_en']

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
    tipo = serializers.StringRelatedField(read_only=True)
    marca = serializers.StringRelatedField(read_only=True)
    estado = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Tecnologia
        fields = '__all__'

class MaterialDidacticoSerializer(serializers.ModelSerializer):
    estado = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = MaterialDidactico
        fields = '__all__'


class PrestamoSerializer(serializers.ModelSerializer):
    # Campos para la lectura (GET)
    solicitante = serializers.StringRelatedField(read_only=True)
    tecnologia = serializers.StringRelatedField(read_only=True)
    material_didactico = serializers.StringRelatedField(read_only=True)

    # Campos para la escritura (POST, PUT, PATCH)
    solicitante_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='solicitante', write_only=True
    )
    tecnologia_id = serializers.PrimaryKeyRelatedField(
        queryset=Tecnologia.objects.all(), source='tecnologia', write_only=True, required=False, allow_null=True
    )
    material_didactico_id = serializers.PrimaryKeyRelatedField(
        queryset=MaterialDidactico.objects.all(), source='material_didactico', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Prestamo
        # Incluye los campos de lectura y los de escritura
        fields = [
            'id', 'solicitante', 'tecnologia', 'material_didactico',
            'solicitante_id', 'tecnologia_id', 'material_didactico_id',
            'fecha_prestamo', 'fecha_devolucion', 'observacion'
        ]
        read_only_fields = ['id', 'fecha_prestamo', 'fecha_devolucion']

    def validate(self, data):
        tecnologia = data.get('tecnologia')
        material = data.get('material_didactico')

        if not tecnologia and not material:
            raise serializers.ValidationError({
                'non_field_errors': "Debe proporcionar 'tecnologia' o 'material_didactico'."
            })
        
        # Validación extra: si ambos campos tienen valor, levanta un error
        if tecnologia and material:
             raise serializers.ValidationError({
                'non_field_errors': "No se pueden prestar una 'tecnologia' y un 'material_didactico' en la misma solicitud."
            })

        return data

class ReporteSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()
    centro = serializers.StringRelatedField()
    ubicacion = serializers.StringRelatedField()
    estado = serializers.StringRelatedField()
    prioridad = serializers.StringRelatedField()
    tipo = serializers.StringRelatedField()

    class Meta:
        model = Reporte
        fields = '__all__'



class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        exclude = ["groups", "user_permissions", "password"]

    def create(self, validated_data):
        alfabeto = string.ascii_letters + string.digits + "!@#$%^&*()"
        contrasena_generada = ''.join(secrets.choice(alfabeto) for _ in range(12))
        usuario = Usuario(**validated_data)
        usuario.set_password(contrasena_generada)
        usuario.save()
        usuario._contrasena_plana = contrasena_generada
        return usuario
