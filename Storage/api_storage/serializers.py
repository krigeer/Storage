from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from . import models

class CentroSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Centro
        fields = ['id', 'nombre', 'direccion', 'descripcion', 'creado_en', 'actualizado_en']
        read_only_fields = ['creado_en', 'actualizado_en']

class CentroSerializers(serializers.ModelSerializer):
    class Meta:
        model: models.Centro
        fields = '__all__'


class RolSerializers(serializers.ModelSerializer):
    class Meta:
        model: models.Rol
        fields = '__all__'


class UbicacionSerializer(serializers.ModelSerializer):
    centro_nombre = serializers.CharField(source='centro.nombre', read_only=True)
    
    class Meta:
        model = models.Ubicacion
        fields = ['id', 'centro', 'centro_nombre', 'nombre', 'descripcion']
        read_only_fields = ['centro_nombre']


class UbicacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Ubicacion
        fields = ['centro', 'nombre', 'descripcion']


class LoginSerializer(serializers.Serializer):
    documento = serializers.CharField(
        label=_("Documento"),
        write_only=True
    )
    password = serializers.CharField(
        label=_("Contraseña"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def validate(self, attrs):
        documento = attrs.get('documento')
        password = attrs.get('password')

        if documento and password:
            # Verificar si el usuario existe y la contraseña es correcta
            try:
                user = models.Usuario.objects.get(documento=documento)
                if user.check_password(password):
                    # Verificar si el usuario está activo
                    if user.estado != 'activo':
                        msg = _('Usuario inactivo o bloqueado.')
                        raise serializers.ValidationError(msg, code='authorization')
                    
                    # Verificar si la contraseña ha expirado
                    if user.contrasena_expira_en and user.contrasena_expira_en < timezone.now():
                        msg = _('La contraseña ha expirado.')
                        raise serializers.ValidationError(msg, code='password_expired')
                    
                    # Si todo está bien, devolver el usuario
                    attrs['user'] = user
                    return attrs
                else:
                    msg = _('No se pudo iniciar sesión con las credenciales proporcionadas.')
                    raise serializers.ValidationError(msg, code='authorization')
            except models.Usuario.DoesNotExist:
                msg = _('No existe un usuario con este documento.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Debe incluir "documento" y "contraseña".')
            raise serializers.ValidationError(msg, code='authorization')

        return attrs    


# Serializadores para Tecnología
class TipoTecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TipoTecnologia
        fields = ['id', 'nombre']


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Marca
        fields = ['id', 'nombre']


class TecnologiaSerializer(serializers.ModelSerializer):
    tipo_nombre = serializers.CharField(source='tipo.nombre', read_only=True)
    marca_nombre = serializers.CharField(source='marca.nombre', read_only=True)
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)

    class Meta:
        model = models.Tecnologia
        fields = [
            'id', 'nombre', 'descripcion', 'serie_fabricante', 'serie_sena',
            'tipo', 'tipo_nombre', 'marca', 'marca_nombre', 'ubicacion',
            'ubicacion_nombre', 'estado', 'estado_nombre', 'caracteristicas',
            'creado_en'
        ]
        read_only_fields = ['creado_en']


class TecnologiaCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tecnologia
        fields = [
            'nombre', 'descripcion', 'serie_fabricante', 'serie_sena',
            'tipo', 'marca', 'ubicacion', 'estado', 'caracteristicas'
        ]


# Serializadores para Material Didáctico
class MaterialDidacticoSerializer(serializers.ModelSerializer):
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)

    class Meta:
        model = models.MaterialDidactico
        fields = [
            'id', 'nombre', 'descripcion', 'serie_fabricante', 'serie_sena',
            'ubicacion', 'ubicacion_nombre', 'estado', 'estado_nombre',
            'cantidad', 'creado_en'
        ]
        read_only_fields = ['creado_en']


class MaterialDidacticoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MaterialDidactico
        fields = [
            'nombre', 'descripcion', 'serie_fabricante', 'serie_sena',
            'ubicacion', 'estado', 'cantidad'
        ]


# Serializadores para Préstamos
class PrestamoSerializer(serializers.ModelSerializer):
    solicitante_nombre = serializers.SerializerMethodField()
    objeto_tipo = serializers.SerializerMethodField()
    objeto_info = serializers.SerializerMethodField()
    estado = serializers.SerializerMethodField()

    class Meta:
        model = models.Prestamo
        fields = [
            'id', 'content_type', 'objeto_id', 'objeto', 'solicitante',
            'solicitante_nombre', 'fecha_prestamo', 'fecha_devolucion',
            'observacion', 'objeto_tipo', 'objeto_info', 'estado'
        ]
        read_only_fields = ['solicitante', 'fecha_prestamo']

    def get_solicitante_nombre(self, obj):
        return f"{obj.solicitante.first_name} {obj.solicitante.last_name}"

    def get_objeto_tipo(self, obj):
        return obj.content_type.model

    def get_objeto_info(self, obj):
        objeto = obj.objeto
        if hasattr(objeto, 'nombre'):
            return objeto.nombre
        return str(objeto)

    def get_estado(self, obj):
        return 'Devuelto' if obj.fecha_devolucion else 'Prestado'


class PrestamoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Prestamo
        fields = ['content_type', 'objeto_id', 'observacion']

    def create(self, validated_data):
        # Asignar el usuario autenticado como solicitante
        validated_data['solicitante'] = self.context['request'].user
        return super().create(validated_data)


class PrestamoDevolverSerializer(serializers.Serializer):
    observacion = serializers.CharField(required=False, allow_blank=True)


class UsuarioCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = models.Usuario
        fields = [
            'username', 'first_name', 'last_name', 'email',
            'documento', 'rol', 'centro', 'tipo_documento',
            'contacto_principal', 'contacto_secundario'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'estado': {'read_only': True}
        }
    
    def create(self, validated_data):
        from .utils import generar_contrasena_temporal, enviar_correo_bienvenida
        from django.contrib.sites.shortcuts import get_current_site
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        
        # Generar contraseña temporal
        contrasena_temporal = generar_contrasena_temporal()
        
        # Crear el usuario
        user = models.Usuario(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            documento=validated_data['documento'],
            rol=validated_data['rol'],
            centro=validated_data['centro'],
            tipo_documento=validated_data['tipo_documento'],
            contacto_principal=validated_data['contacto_principal'],
            contacto_secundario=validated_data.get('contacto_secundario'),
            estado='activo'
        )
        
        # Establecer la contraseña temporal
        user.establecer_contrasena(contrasena_temporal)
        user.save()
        
        # Obtener el dominio actual para el enlace en el correo
        request = self.context.get('request')
        protocol = 'https' if request and request.is_secure() else 'http'
        domain = None
        
        try:
            current_site = get_current_site(request)
            domain = current_site.domain
        except:
            domain = 'tu-dominio.com'  # Reemplaza con tu dominio real
        
        # Enviar correo de bienvenida
        enviar_correo_bienvenida(user, contrasena_temporal)
        
        return user