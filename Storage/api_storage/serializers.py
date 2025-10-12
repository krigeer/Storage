from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import Usuario, Rol, TipoDocumento, Centro, EstadoUsuario, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, MaterialDidactico
from .models import Tecnologia, Prestamo, Reporte, PrioridadReporte, EstadoReporte, Configuracion
import secrets
import string
from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from django.db.models import Q
from .utils import solo_letras

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


class CentroSerializer(serializers.ModelSerializer):
    def validate_nombre(self, value):
        if any(char.isdigit() for char in value ):
            raise serializers.ValidationError("El nombre del documento no debe contener numeros")
        if len(value) > 50:
            raise serializers.ValidationError("El nombre no debe contener mas de 50 letras")
        if not value:
            raise serializers.ValidationError("El campo no debe estar vacio")
        return value
    
    def validate_direccion(self, value):
        if len(value)>50:
            raise serializers.ValidationError("La direccion no debe contener mas de 50 caracteres")
        if not value:
            raise serializers.ValidationError("El campo no debe estar vacio")
        return value
    
    def validate_descripcion(self, value):
        if len(value)>200:
            raise serializers.ValidationError("La descripcion es demasiado Larga, debe ser menor a 200 caracteres")
        if not value:
            raise serializers.ValidationError("El campo no debe estar vacio")
        return value 
    class Meta:
        model = Centro
        exclude = ['actualizado_en', 'creado_en']



class TipoDocumentoSerializer(serializers.ModelSerializer):
    # nombre = serializers.CharField(validators=[solo_letras])
    def validate_nombre(self, value):
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El nombre del documento no debe contener números.")
        return value
    
    def validate_simbolo(self, value):
        if len(value) > 4:
            raise serializers.ValidationError("El simbolo no debe tener mas de 4 letras")
        if not value.isalpha() or not value.isupper():
            raise serializers.ValidationError("El simbolo solo debe contener letras mayusculas")
        return value
    
    
    class Meta:
        model = TipoDocumento
        fields = '__all__'


class UbicacionSerializer(serializers.ModelSerializer):
    def validate_centro(self, value):
        if not value:
            raise serializers.ValidationError("el campo no debe estar vacio")
        return value
    
    def validate_nombre(self, value):
        if not value:
            raise serializers.ValidationError("el campo no debe estar vacio")
        if len(value)>50:
            raise serializers.ValidationError("Elnombre no debe contener mas de 50 caracteres")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El campo no debe contener numeros")
        return value
    
    def validate_descripcion(self, value):
        if not value:
            raise serializers.ValidationError("el campo no debe estar vacio")
        if len(value)>200:
            raise serializers.ValidationError("Elnombre no debe contener mas de 200 caracteres")
        return value
    
    class Meta:
        model = Ubicacion
        fields = '__all__'



class TipoTecnologiaSerializer(serializers.ModelSerializer):
    def validate_nombre(self, value):
        if len(value)>50:
            raise serializers.ValidationError("El nombre no debe ser mayor a 50 caracteres")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El campo no debe contener numeros")
        if not value:
            raise serializers.ValidationError("El campo no debe estar vacio")
        return value
    class Meta:
        model = TipoTecnologia
        fields = '__all__'
        
    
class MarcaSerializer(serializers.ModelSerializer):
    def validate_nombre(self, value):
        if len(value)>50:
            raise serializers.ValidationError("El nombre no debe ser mayor a 50 caracteres")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El campo no debe contener numeros")
        if not value:
            raise serializers.ValidationError("El campo no debe estar vacio")
        return value
    class Meta:
        model = Marca
        fields = '__all__'

 


class TecnologiaSerializer(serializers.ModelSerializer):
    # --- GET ---
    tipo_nombre = serializers.StringRelatedField(source='tipo', read_only=True)
    marca_nombre = serializers.StringRelatedField(source='marca', read_only=True)
    ubicacion_nombre = serializers.StringRelatedField(source='ubicacion', read_only=True)

    # --- POST  ---
    tipo_id = serializers.PrimaryKeyRelatedField(queryset=TipoTecnologia.objects.all(), source='tipo', write_only=True)
    marca_id = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all(), source='marca', write_only=True)
    ubicacion_id = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all(), source='ubicacion', write_only=True)
    
    def validate_serie_fabricante(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Serie de fabricante debe tener al menos 4 caracteres.")
        return value
    
    def validate_serie_sena(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Serie SENA debe tener al menos 4 caracteres.")
        return value
        
    def validate_estado(self, value):
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El campo estado solo debe contener texto (sin números).")
        return value

    class Meta:
        model = Tecnologia
        fields = '__all__' 
        extra_kwargs = {
            'tipo': {'required': False, 'write_only': True}, 
            'marca': {'required': False, 'write_only': True},
            'ubicacion': {'required': False, 'write_only': True},
        }
    
    class Meta:
        model = Tecnologia
        fields = '__all__'
        extra_kwargs = {
            'tipo': {'required': False},
            'marca': {'required': False},
            'estado': {'required': False},
            'ubicacion': {'required': False},
        }

class MaterialDidacticoSerializer(serializers.ModelSerializer):
    # --- GET  ---
    ubicacion_nombre = serializers.StringRelatedField(source='ubicacion', read_only=True)
    
    # --- POST/PUT  ---
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(), 
        source='ubicacion', 
        write_only=True
    )

    def validate_serie_fabricante(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Serie de fabricante debe tener al menos 4 caracteres.")
        return value
    
    def validate_serie_sena(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Serie SENA debe tener al menos 4 caracteres.")
        return value
    

    def validate_estado(self, value):
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El campo estado solo debe contener texto (sin números).")
        return value
        
    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError("La cantidad debe ser 1 o mayor.")
        return value
    
    
    class Meta:
        model = MaterialDidactico
        fields = '__all__'
        extra_kwargs = {
            'estado': {'required': False, 'write_only': True},
            'ubicacion': {'required': False, 'write_only': True},
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
    
    #GET 
    rol = serializers.CharField(source='get_rol_display', read_only=True) 
    tipo_documento = serializers.StringRelatedField(read_only=True)
    centro = serializers.StringRelatedField(read_only=True)

    # POST/Creación/Actualización
    email = serializers.EmailField(required=True) 
    class Meta:
        model = Usuario
        # Campos excluidos por seguridad
        exclude = [
            "groups", "user_permissions", "password", "last_login", 
            "is_active", "is_staff", "is_superuser", "date_joined", 
            "contrasena_establecida_en", 'contrasena_expira_en', 
            'historial_contrasenas'
        ]
        
        # Solo lectura
        # read_only_fields = ('documento',)
        
    def create(self, validated_data):
        """
        Maneja la lógica de creación y generación de contraseña.
        El envío del correo se delega a los signals.
        """
        #Generar Contraseña
        alfabeto = string.ascii_letters + string.digits + "!@#$%^&*()"
        contrasena_generada = ''.join(secrets.choice(alfabeto) for _ in range(12))
        
        # Crear instancia (sin guardar todavía)
        usuario = Usuario(**validated_data)
        
        # Hashear la contraseña
        usuario.establecer_contrasena(contrasena_generada, dias_validez=90, guardar=False)
        
        # Adjuntar la contraseña plana a la instancia temporalmente (llama el services)
        usuario._contrasena_plana_temporal = contrasena_generada
        
        # Guardar el objeto en la DB. Esto dispara el services.
        usuario.save()
        return usuario
        
    def update(self, instance, validated_data):
        """Maneja la lógica para PATCH/PUT (Actualización)."""
        
        # Si se quiere actualizar la contraseña, se debe hacer con un endpoint separado 
        # (ej: /set_password) o se debe usar .establecer_contrasena().
        # Aquí solo manejamos la actualización de campos normales (ej: nombre, contacto).
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance
    


# class configuracionSerializers(serializers.ModelSerializer):
#     class Meta:
#         model = Configuracion
#         fields = '__all__'