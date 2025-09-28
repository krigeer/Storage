from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import Usuario, Rol, TipoDocumento, Centro, EstadoUsuario, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, MaterialDidactico
from .models import Tecnologia, Prestamo, Reporte, PrioridadReporte, EstadoReporte
import secrets
import string
from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from django.db.models import Q

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

# Tablas Heredadas 
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


# Tablas que heredan (CORREGIDOS)
class TecnologiaSerializer(serializers.ModelSerializer):
    #  (GET)
    tipo_nombre = serializers.StringRelatedField(source='tipo', read_only=True)
    marca_nombre = serializers.StringRelatedField(source='marca', read_only=True)
    estado_nombre = serializers.StringRelatedField(source='estado', read_only=True)
    ubicacion_nombre = serializers.StringRelatedField(source='ubicacion', read_only=True)

    # (POST)
    tipo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoTecnologia.objects.all(), source='tipo', write_only=True)
    marca_id = serializers.PrimaryKeyRelatedField(
        queryset=Marca.objects.all(), source='marca', write_only=True)
    estado_id = serializers.PrimaryKeyRelatedField(
        queryset=EstadoInventario.objects.all(), source='estado', write_only=True)
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(), source='ubicacion', write_only=True)

    class Meta:
        model = Tecnologia
        fields = '__all__'
        
        #  EXTRA_KWARGS: Evita que DRF pida los campos originales ('tipo', 'marca', etc.) al momento de la escritura
        #  proporcionando sus valores a través de los *_id.
        extra_kwargs = {
            'tipo': {'required': False},
            'marca': {'required': False},
            'estado': {'required': False},
            'ubicacion': {'required': False},
        }

class MaterialDidacticoSerializer(serializers.ModelSerializer):
    #  (GET) ---
    estado_nombre = serializers.StringRelatedField(source='estado', read_only=True)
    ubicacion_nombre = serializers.StringRelatedField(source='ubicacion', read_only=True)
    
    # (POST/PUT) ---
    estado_id = serializers.PrimaryKeyRelatedField(
        queryset=EstadoInventario.objects.all(), source='estado', write_only=True
    )
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(), source='ubicacion', write_only=True
    )
    
    class Meta:
        model = MaterialDidactico
        fields = '__all__'
        extra_kwargs = {
            'estado': {'required': False},
            'ubicacion': {'required': False},
        }


class PrestamoSerializer(serializers.ModelSerializer):
    # ------------------ (GET - READ ONLY FIELDS) ------------------
    solicitante = serializers.StringRelatedField(read_only=True)
    tecnologia = serializers.StringRelatedField(read_only=True)
    material_didactico = serializers.StringRelatedField(read_only=True)
    
    elemento = serializers.SerializerMethodField(read_only=True)
    
    #  saber si el préstamo está activo
    is_active = serializers.SerializerMethodField(read_only=True)

    # ------------------ (POST, PUT, PATCH - WRITE ONLY FIELDS) ------------------
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
        fields = [
            'id', 'solicitante', 'tecnologia', 'material_didactico', 'elemento', 'is_active', # Añadido is_active
            'solicitante_id', 'tecnologia_id', 'material_didactico_id',
            'fecha_prestamo', 'fecha_devolucion', 'observacion'
        ]
        # is_active se añade a read_only_fields
        read_only_fields = ['id', 'fecha_prestamo', 'fecha_devolucion', 'elemento', 'is_active'] 

    # ------------------ Métodos Helper ------------------

    # Implementación del campo is_active
    def get_is_active(self, obj) -> bool:
        # Un préstamo está activo si su fecha_devolucion es None
        return obj.fecha_devolucion is None

    def get_elemento(self, obj):
        if obj.tecnologia:
            return f"Tecnología: {obj.tecnologia.__str__()}" 
        elif obj.material_didactico:
            return f"Material Didáctico: {obj.material_didactico.__str__()}" 
        return "N/A"

    # ------------------ Validaciónes ------------------

    def validate(self, data):
        # El self.instance es None cuando se está CREANDO (POST)
        is_creating = self.instance is None

        # Para operaciones de DEVOLUCIÓN (PATCH) donde data={} o PUT donde ambos son null:
       
        # Obtenemos los valores de la data o de la instancia (si no están en la data)
        tecnologia = data.get('tecnologia', getattr(self.instance, 'tecnologia', None))
        material_didactico = data.get('material_didactico', getattr(self.instance, 'material_didactico', None))

        # La validación SOLO debe fallar si AMBOS campos son nulos
        if tecnologia is None and material_didactico is None:
            # Si estamos creando, lanzamos el error
            if is_creating:
                raise serializers.ValidationError(
                    'Debe proporcionar una Tecnología o un Material Didáctico.',
                    code='invalid'
                )
            
            # Si estamos ACTUALIZANDO (y no estamos enviando nada),
            # Como la devolución envía data={}, el serializer asume que no hay campos. 
            # Si self.instance tiene un activo, la validación se salta.
            
            # Aquí, si el préstamo YA tiene un activo (instance.tecnologia o instance.material_didactico),
            # y no estamos enviando los campos
            
            pass # Si el préstamo existe, permiti el paso si no se están modificando los activos.

        return data
    # ------------------ Método Create ------------------
    # create para cambiar a 'Prestado' ...
    def create(self, validated_data):
        try:
            ubicacion_prestado = Ubicacion.objects.get(nombre__iexact='Prestado') 
        except Ubicacion.DoesNotExist:
            raise serializers.ValidationError({"error": "La Ubicación 'Prestado' no existe en la base de datos."})

        tecnologia_obj = validated_data.get('tecnologia')
        material_obj = validated_data.get('material_didactico')
        activo = None

        if tecnologia_obj:
            activo = tecnologia_obj
            validated_data['content_type'] = ContentType.objects.get_for_model(Tecnologia)
            validated_data['objeto_id'] = activo.id
            validated_data['material_didactico'] = None
        elif material_obj:
            activo = material_obj
            validated_data['content_type'] = ContentType.objects.get_for_model(MaterialDidactico)
            validated_data['objeto_id'] = activo.id
            validated_data['tecnologia'] = None
        else:
            raise serializers.ValidationError("Falta el elemento a prestar.")

        prestamo = super().create(validated_data)
        activo.ubicacion = ubicacion_prestado
        activo.save(update_fields=['ubicacion']) 

        return prestamo


    #  Update para DEVOLUCIÓN
    def update(self, instance, validated_data):
        """
        Maneja la lógica de DEVOLUCIÓN cuando se hace PATCH sin datos,
        simplemente para finalizar el préstamo.
        """
        #  devolución si la fecha_devolucion aún NO está establecida
        if instance.fecha_devolucion is None:
            
            #  Obtener la ubicación de 'Bodega'
            try:
                ubicacion_bodega = Ubicacion.objects.get(nombre__iexact='Bodega') 
            except Ubicacion.DoesNotExist:
                raise serializers.ValidationError({"error": "La ubicación 'Bodega' no existe."})
            
            #  Identificar el activo
            activo = instance.tecnologia or instance.material_didactico
            
            if not activo:
                raise serializers.ValidationError({"error": "El préstamo no tiene un activo asociado."})

            # Cambia la ubicación del elemento a 'Bodega'
            activo.ubicacion = ubicacion_bodega
            activo.save(update_fields=['ubicacion'])
            
            # Actualiza la fecha de devolución en el Préstamo (finaliza el préstamo)
            instance.fecha_devolucion = timezone.now()
            
            # Guardamos la instancia actualizada
            instance.save(update_fields=['fecha_devolucion'])
            return instance
        
        # Si ya se devolvió o es un update normal, aplica el update estándar
        return super().update(instance, validated_data)


# ReporteSerializer y UsuarioSerializer (Se mantienen iguales)
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
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(), source='rol', write_only=True
    )
    rol = serializers.StringRelatedField(read_only=True)
    tipo_documento = serializers.StringRelatedField(read_only=True)
    centro = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Usuario
        exclude = [
            "groups", "user_permissions", "password", "last_login", "is_active",
            "is_staff", "is_superuser", "date_joined", "contrasena_establecida_en",
            "contrasena_expira_en", "historial_contrasenas"
        ]

    def create(self, validated_data):
        # Aquí puedes agregar tu lógica de creación personalizada
        alfabeto = string.ascii_letters + string.digits + "!@#$%^&*()"
        # ejemplo: validated_data['some_field'] = generate_password(alfabeto)
        return super().create(validated_data)