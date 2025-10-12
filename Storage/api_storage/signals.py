# Este archivo se utiliza para las señales de la aplicación (automatizacion)
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Usuario
from .services import enviar_credenciales_por_correo

@receiver(post_save, sender=Usuario)
def enviar_correo_bienvenida(sender, instance, created, **kwargs):
    if created:  # Solo cuando el usuario es nuevo
        send_mail(
            "Bienvenido al sistema",
            f"Hola {instance.first_name}, tu cuenta fue creada con éxito.",
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
        )

@receiver(post_save, sender=Usuario)
def manejar_nuevo_usuario(sender, instance, created, **kwargs):
    """
    Se ejecuta después de guardar un Usuario. 
    Envía el correo solo si el usuario es nuevo y tiene la contraseña temporal adjunta.
    """
    if created and hasattr(instance, '_contrasena_plana_temporal'):
        contrasena_plana = instance._contrasena_plana_temporal
        enviar_credenciales_por_correo(instance, contrasena_plana)
        delattr(instance, '_contrasena_plana_temporal')