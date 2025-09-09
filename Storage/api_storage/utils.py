import string
import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def generar_contrasena_temporal(longitud=12):
    """Genera una contraseña temporal aleatoria"""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    # Aseguramos que la contraseña tenga al menos un número y un carácter especial
    while True:
        contrasena = ''.join(random.choice(caracteres) for _ in range(longitud))
        if (any(c.isdigit() for c in contrasena) and 
            any(c in string.punctuation for c in contrasena)):
            return contrasena

def enviar_correo_bienvenida(usuario, contrasena_temporal):
    """Envía un correo de bienvenida con las credenciales temporales"""
    asunto = 'Bienvenido a Storage SENA - Tus Credenciales de Acceso'
    
    # Renderizar plantilla HTML
    contexto = {
        'nombre_usuario': f"{usuario.first_name} {usuario.last_name}",
        'usuario': usuario.username,
        'contrasena_temporal': contrasena_temporal,
        'soporte_email': settings.DEFAULT_FROM_EMAIL
    }
    
    mensaje_html = render_to_string('emails/bienvenida.html', contexto)
    mensaje_texto = strip_tags(mensaje_html)
    
    try:
        send_mail(
            subject=asunto,
            message=mensaje_texto,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            html_message=mensaje_html,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False
