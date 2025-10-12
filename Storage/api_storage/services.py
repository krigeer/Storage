from django.conf import settings
from rest_framework import serializers
from django.conf import settings
from django.core.mail import send_mail
from .models import Usuario, Rol, Centro, TipoDocumento, Configuracion 
from django.utils import timezone
import secrets
import string


def enviar_credenciales_por_correo(usuario, contrasena_plana):
    """Implementación de la utilidad de envío de correo."""
    asunto = 'Credenciales de Acceso al Sistema de Inventario'
    mensaje = f"""
    Hola {usuario.first_name} {usuario.last_name},

    Su cuenta ha sido creada exitosamente. Aquí están sus credenciales:

    Identificador (Documento): {usuario.documento}
    Contraseña temporal: {contrasena_plana}

    Por favor, cambie su contraseña después del primer inicio de sesión.
    """
    try:
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [usuario.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"ERROR al enviar correo: {e}")
        return False