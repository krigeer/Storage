from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from datetime import timedelta


# ////////////////////////////////////////// CENTROS /////////////////////////////////////////////////////

class Centro(models.Model):
    nombre = models.CharField(max_length=100, blank=True)
    direccion = models.CharField(max_length=100, blank=True)
    descripcion = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Centro"
        verbose_name_plural = "Centros"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


# ////////////////////////////////////////// ROLES /////////////////////////////////////////////////////

class Rol(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "rol"
        verbose_name = "Rol"
        verbose_name_plural = "Roles"
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
    ACTIVO = "activo", "Activo"
    INACTIVO = "inactivo", "Inactivo"
    BLOQUEADO = "bloqueado", "Bloqueado"


# ////////////////////////////////////////// USUARIO /////////////////////////////////////////////////////

class Usuario(AbstractUser):
    documento = models.BigIntegerField(unique=True, verbose_name="Documento")
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, verbose_name="Rol", default=1)
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

    # --- Gestión de contraseña ---
    contrasena_establecida_en = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de establecimiento")
    contrasena_expira_en = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de expiración")
    historial_contrasenas = models.JSONField(default=list, verbose_name="Historial de hashes")  
    # Ejemplo: ["pbkdf2_sha256$...", "pbkdf2_sha256$..."]

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["username"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    # --- Métodos de gestión de contraseña ---

    def establecer_contrasena(self, contrasena_plana: str, dias_validez: int = 90, guardar: bool = True):
        """
        Establece una nueva contraseña, guarda el hash en el historial y define expiración.
        """
        # Guardar hash actual en historial antes de cambiar
        if self.password and self.password not in self.historial_contrasenas:
            self.historial_contrasenas.insert(0, self.password)

        # Actualizar contraseña con el sistema seguro de Django
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
        Verifica si la contraseña ya fue usada en las últimas N contraseñas.
        """
        for hash_antiguo in self.historial_contrasenas[:ultimas]:
            if check_password(contrasena_plana, hash_antiguo):
                return True
        return False


# ////////////////////////////////////////// INVENTARIO /////////////////////////////////////////////////////

class Ubicacion(models.Model):
    centro = models.ForeignKey(Centro, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    class Meta:
        db_table = "ubicacion"
        verbose_name = "Ubicación"
        verbose_name_plural = "Ubicaciones"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class EstadoInventario(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "estado_inventario"
        verbose_name = "Estado de inventario"
        verbose_name_plural = "Estados de inventario"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class TipoTecnologia(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "tipo_tecnologia"
        verbose_name = "Tipo de tecnología"
        verbose_name_plural = "Tipos de tecnología"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "marca"
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


# Modelo abstracto para activos
class Activo(models.Model):
    db_table = "activo"
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    serie_fabricante = models.CharField(max_length=100)
    serie_sena = models.CharField(max_length=100)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT)
    estado = models.ForeignKey(EstadoInventario, on_delete=models.PROTECT)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Tecnologia(Activo):
    tipo = models.ForeignKey(TipoTecnologia, on_delete=models.PROTECT)
    marca = models.ForeignKey(Marca, on_delete=models.PROTECT)
    caracteristicas = models.TextField()

    class Meta:
        db_table = "tecnologia"
        verbose_name = "Tecnología"
        verbose_name_plural = "Tecnologías"

    def __str__(self):
        return f"{self.tipo} - {self.marca} - {self.serie_sena}"


class MaterialDidactico(Activo):
    cantidad = models.PositiveIntegerField()

    class Meta:
        db_table = "material_didactico"
        verbose_name = "Material Didáctico"
        verbose_name_plural = "Materiales Didácticos"

    def __str__(self):
        return f"{self.nombre} ({self.cantidad})"


# ////////////////////////////////////////// PRÉSTAMOS /////////////////////////////////////////////////////

class Prestamo(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objeto_id = models.PositiveIntegerField()
    objeto = GenericForeignKey("content_type", "objeto_id")
    solicitante = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion = models.DateTimeField(null=True, blank=True)
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = "prestamo"
        verbose_name = "Préstamo"
        verbose_name_plural = "Préstamos"
        ordering = ["-fecha_prestamo"]

    def __str__(self):
        return f"Préstamo {self.id} - {self.solicitante}"


# ////////////////////////////////////////// REPORTES /////////////////////////////////////////////////////

class TipoReporte(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "tipo_reporte"
        verbose_name = "Tipo de reporte"
        verbose_name_plural = "Tipos de reporte"

    def __str__(self):
        return self.nombre


class EstadoReporte(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "estado_reporte"
        verbose_name = "Estado de reporte"
        verbose_name_plural = "Estados de reporte"

    def __str__(self):
        return self.nombre


class PrioridadReporte(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Prioridad de reporte"
        verbose_name_plural = "Prioridades de reporte"

    def __str__(self):
        return self.nombre


class Reporte(models.Model):
    titulo = models.CharField(max_length=100)
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    centro = models.ForeignKey(Centro, on_delete=models.PROTECT)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objeto_id = models.PositiveIntegerField()
    objeto = GenericForeignKey("content_type", "objeto_id")
    estado = models.ForeignKey(EstadoReporte, on_delete=models.PROTECT)
    prioridad = models.ForeignKey(PrioridadReporte, on_delete=models.PROTECT)
    tipo = models.ForeignKey(TipoReporte, on_delete=models.PROTECT)
    observacion = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reporte"
        verbose_name = "Reporte"
        verbose_name_plural = "Reportes"
        ordering = ["-creado_en"]

    def __str__(self):
        return f"Reporte {self.id} - {self.usuario}"

    
    