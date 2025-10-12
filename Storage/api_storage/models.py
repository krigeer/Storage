from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from datetime import timedelta
from django.db import models
from django.core.exceptions import ValidationError

# ////////////////////////////////////////// ROLES /////////////////////////////////////////////////////
class Rol(models.TextChoices):
    ADMIN = "ADM", "Bodega (Administrador)"
    USER = "INS", "Instructor"

# ////////////////////////////////////////// IDIOMA  /////////////////////////////////////////////////////
class Lenguaje(models.TextChoices):
    ESPANOL = "ES", "Español"
    INGLES = "EN", "Inglés"

# ////////////////////////////////////////// DISEÑO //////////////////////////////////////////////////////
class Diseno(models.TextChoices):
    STANDART = "STD", "Estándar" 
    CLASIC = "CLS", "Clásico"
    MATERIAL = "MAT", "Material Design"

# ////////////////////////////////////////// CONFIGURACION ///////////////////////////////////////////////
class Configuracion(models.Model):
    lenguaje = models.CharField(
        max_length=50,
        choices=Lenguaje.choices,
        default=Lenguaje.ESPANOL,
        verbose_name="idioma"
    )
    diseno = models.CharField(
        max_length=100,
        choices=Diseno.choices,
        default=Diseno.STANDART,
        verbose_name="Diseño"
    )

# ////////////////////////////////////////// CENTROS /////////////////////////////////////////////////////
class Centro(models.Model):
    nombre = models.CharField(max_length=100, blank=False, unique=True)
    direccion = models.CharField(max_length=100, blank=False)
    descripcion = models.TextField(max_length=200)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Centro"
        verbose_name_plural = "Centros"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


# ////////////////////////////////////////// TIPOS DE DOCUMENTO /////////////////////////////////////////////////////
class TipoDocumento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    simbolo = models.CharField(max_length=20, unique=True)

    class Meta:
        db_table = "tipo_documento"
        verbose_name = "Tipo de documento"
        verbose_name_plural = "Tipos de documento"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


# ////////////////////////////////////////// ESTADO USUARIO /////////////////////////////////////////////////////
class EstadoUsuario(models.TextChoices):
    ACTIVO = "ACT", "Activo"
    INACTIVO = "INA", "Inactivo"
    BLOQUEADO = "BLO", "Bloqueado"


# ////////////////////////////////////////// USUARIO /////////////////////////////////////////////////////
class Usuario(AbstractUser):
    username = None 
    documento = models.BigIntegerField(unique=True, verbose_name="Documento")
    USERNAME_FIELD = 'documento'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']
    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.ADMIN,
        verbose_name="Rol"
        )
    centro = models.ForeignKey(Centro, on_delete=models.PROTECT, verbose_name="Centro", default=1)
    tipo_documento = models.ForeignKey(TipoDocumento, on_delete=models.PROTECT, verbose_name="Tipo de documento", default=1)
    contacto_principal = models.BigIntegerField(verbose_name="Contacto principal")
    contacto_secundario = models.BigIntegerField(null=True, blank=True, verbose_name="Contacto secundario")
    estado = models.CharField(
        max_length=10,
        choices=EstadoUsuario.choices,
        default=EstadoUsuario.ACTIVO,
        verbose_name="Estado"
    )
    configuracion = models.ForeignKey(Configuracion, on_delete=models.PROTECT,verbose_name="configuracion", default="1")

    # --- Gestión de contraseña ---
    contrasena_establecida_en = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de establecimiento")
    contrasena_expira_en = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de expiración")
    historial_contrasenas = models.JSONField(default=list, verbose_name="Historial de hashes")  

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["documento"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def establecer_contrasena(self, contrasena_plana: str, dias_validez: int = 90, guardar: bool = True):
        """
        Establece una nueva contraseña, guarda el hash en el historial y define expiración.
        """
        # Guardar hash actual en historial antes de cambiar
        if self.password and self.password not in self.historial_contrasenas:
            self.historial_contrasenas.insert(0, self.password)
        # Actualizar contraseña
        self.set_password(contrasena_plana)
        # Registrar fecha de establecimiento y expiración
        self.contrasena_establecida_en = timezone.now()
        self.contrasena_expira_en = timezone.now() + timedelta(days=dias_validez) if dias_validez else None
        if guardar:
            self.save(update_fields=["password", "contrasena_establecida_en", "contrasena_expira_en", "historial_contrasenas"])

    def contrasena_expirada(self) -> bool:
        """
        Verifica si la contraseña ya está expirada según 'contrasena_expira_en'.
        """
        return self.contrasena_expira_en is not None and timezone.now() >= self.contrasena_expira_en
    def contrasena_reutilizada(self, contrasena_plana: str, ultimas: int = 5) -> bool:
        """
        Verifica si la contraseña ya fue usada en las últimas  contraseñas.
        """
        for hash_antiguo in self.historial_contrasenas[:ultimas]:
            if check_password(contrasena_plana, hash_antiguo):
                return True
        return False


# ////////////////////////////////////////// INVENTARIO /////////////////////////////////////////////////////
class Ubicacion(models.Model):
    centro = models.ForeignKey(Centro, on_delete=models.PROTECT, blank=False)
    nombre = models.CharField(max_length=100, unique=True, blank=False)
    descripcion = models.TextField(blank=False, max_length=200)

    class Meta:
        db_table = "ubicacion"
        verbose_name = "Ubicación"
        verbose_name_plural = "Ubicaciones"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class EstadoInventario(models.TextChoices):
    BUENO = "BUE", "Bueno" 
    REGULAR = "REG", "Regular"
    MALO = "MAL", "Malo"  


class TipoTecnologia(models.Model):
    nombre = models.CharField(max_length=100, unique=True, blank=False)
    class Meta:
        db_table = "tipo_tecnologia"
        verbose_name = "Tipo de tecnología"
        verbose_name_plural = "Tipos de tecnología"
        ordering = ["nombre"]
    def __str__(self):
        return self.nombre


class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True, blank=False)
    class Meta:
        db_table = "marca"
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ["nombre"]
    def __str__(self):
        return self.nombre


class Activo(models.Model):
    db_table = "activo"
    serie_fabricante = models.CharField(max_length=100, unique=True, blank=False)
    serie_sena = models.CharField(max_length=100, unique=True, blank=False)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, blank=False, default=1)
    estado = models.CharField(
        max_length=100,
        choices=EstadoInventario.choices,
        default=EstadoInventario.BUENO,
        verbose_name="estado"
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    class Meta:
        abstract = True


class Tecnologia(Activo):
    tipo = models.ForeignKey(TipoTecnologia, on_delete=models.PROTECT, blank=False)
    marca = models.ForeignKey(Marca, on_delete=models.PROTECT, blank=False)
    cpu = models.TextField(max_length=100, blank=False)
    ram = models.CharField(max_length=100, blank=False)
    disco = models.CharField(max_length=100, blank=False)


    class Meta:
        db_table = "tecnologia"
        verbose_name = "Tecnología"
        verbose_name_plural = "Tecnologías"

    def __str__(self):
        return f"{self.tipo} - {self.marca} - {self.serie_sena}"


class MaterialDidactico(Activo):
    cantidad = models.PositiveIntegerField(blank=False)
    descripcion = models.TextField(max_length=200)
    class Meta:
        db_table = "material_didactico"
        verbose_name = "Material Didáctico"
        verbose_name_plural = "Materiales Didácticos"
    def __str__(self):
        return f"{self.descripcion} ({self.cantidad})"


# ////////////////////////////////////////// PRÉSTAMOS /////////////////////////////////////////////////////
class Prestamo(models.Model):
    tecnologia = models.ForeignKey(Tecnologia, on_delete=models.PROTECT, null=True, blank=True)
    material_didactico = models.ForeignKey(MaterialDidactico, on_delete=models.PROTECT, null=True, blank=True)
    solicitante = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion = models.DateTimeField(null=True, blank=True)
    observacion = models.TextField(blank=True)
    class Meta:
        db_table = "prestamo"
        verbose_name = "Préstamo"
        verbose_name_plural = "Préstamos"
        ordering = ["-fecha_prestamo"]
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(tecnologia__isnull=False) | models.Q(material_didactico__isnull=False)
                ),
                name="prestamo_tecnologia_o_material",
            )
        ]
    def __str__(self):
        return f"Préstamo {self.id} - {self.solicitante}"


# ////////////////////////////////////////// REPORTES /////////////////////////////////////////////////////
class TipoReporte(models.TextChoices):
    FALLA_TECNICA = "TEC", "Falla Técnica/Electrónica"
    FISICO = "FIS", "Daño Físico/Estructural"
    FALTANTE = "FAL", "Faltante o Accesorio Incompleto"   

class EstadoReporte(models.TextChoices):
    NUEVO = "NUE", "Nuevo"
    EN_REVISION = "REV", "En Revisión"
    CERRADO = "CER", "Cerrado (Solucionado)"
    ANULADO = "ANU", "Anulado/Inválido"   


class PrioridadReporte(models.TextChoices):
    BAJA = "B", "Baja (Estético o Menor)"
    MEDIA = "M", "Media (Afecta Eficiencia)"
    ALTA = "A", "Alta (Operación Detenida/Riesgo)"
    CRITICA = "C", "Crítica (Riesgo Inminente)"   


class Reporte(models.Model):
    titulo = models.CharField(max_length=100)
    observacion = models.TextField(max_length=200)
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    estado = models.CharField(
        max_length=100,
        choices=EstadoReporte.choices,
        default=EstadoReporte.NUEVO,
        verbose_name="estado"
    )
    prioridad = models.CharField(
        max_length=100,
        choices=PrioridadReporte.choices,
        default=PrioridadReporte.BAJA,
        verbose_name="prioridad"
    )
    tipo = models.CharField(
        max_length=100,
        choices=TipoReporte.choices,
        default=TipoReporte.FALLA_TECNICA,
        verbose_name="tipo"
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = "reporte"
        verbose_name = "Reporte"
        verbose_name_plural = "Reportes"
        ordering = ["-creado_en"]

    def __str__(self):
        return f"Reporte {self.id} - {self.usuario}"
    


class Seguimiento(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, blank=False)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, blank=False)
    cantidad_equipos = models.IntegerField(blank=False)
    cantidad_cargadores = models.IntegerField(blank=False)
    cantidad_mouses = models.IntegerField(blank=False)
    cantidad_teclados = models.IntegerField(blank=False)
    fecha_registro = models.DateTimeField(blank=False, auto_now=True)

    class Meta:
        db_table = "seguimiento"
        verbose_name = "Seguimiento"
        verbose_name_plural = "Seguimientos"
        ordering = ["-fecha_registro"]

    def __str__(self):
        return f"Seguimiento por {self.usuario.get_full_name()} en {self.ubicacion} ({self.fecha_registro.strftime('%Y-%m-%d')})"

    def clean(self):
        """
        Valida que el usuario que intenta registrar el seguimiento
        tenga el rol de 'instructor'.
        """
        if self.usuario:
            rol_esperado = "instructor" 
            if self.usuario.rol.lower() != rol_esperado:
                raise ValidationError(
                    {
                        'usuario': f'Permiso denegado: Solo los usuarios con el rol de Instructor pueden registrar un Seguimiento. El rol actual es: {self.usuario.rol}.'
                    }
                )
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


