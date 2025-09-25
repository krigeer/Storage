from django.core.mail import send_mail
from django.conf import settings

def enviar_correo_credenciales(email_destino: str, contrasena: str):
    asunto = "Bienvenido al sistema - Credenciales de acceso"
    mensaje = f"""
    Hola, tu usuario ha sido creado exitosamente.

    📌 Usuario: {email_destino}
    🔑 Contraseña temporal: {contrasena}

    Por seguridad, cambia tu contraseña en el primer inicio de sesión.
    """
    remitente = settings.DEFAULT_FROM_EMAIL

    send_mail(
        asunto,
        mensaje,
        remitente,
        [email_destino],
        fail_silently=False,
    )
