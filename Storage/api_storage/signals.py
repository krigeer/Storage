# Este archivo se utiliza para las señales de la aplicación (automatizacion)
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Usuario

@receiver(post_save, sender=Usuario)
def enviar_correo_bienvenida(sender, instance, created, **kwargs):
    if created:  # Solo cuando el usuario es nuevo
        send_mail(
            "Bienvenido al sistema",
            f"Hola {instance.first_name}, tu cuenta fue creada con éxito.",
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
        )
