from django.conf import settings
from rest_framework import serializers
from django.core.mail import send_mail
from djoser.serializers import SendEmailResetSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from djoser.views import UserViewSet
from .models import Usuario, Rol, Centro, TipoDocumento, Configuracion 
from django.utils import timezone
import secrets
import string
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from rest_framework.parsers import JSONParser
from django.urls import reverse

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
    


class EmailService:
    @staticmethod
    def enviar_email_reset_password(email: str, request):
        """
        Envía el email de reset de contraseña
        """
        try:
            user = Usuario.objects.get(email=email)
            
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_encode
            from django.utils.encoding import force_bytes
            
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
           
            relative_url = reverse('reset_password_confirm', kwargs={'uid': uid, 'token': token})
            reset_url = request.build_absolute_uri(relative_url)
            
            from django.core.mail import send_mail
            
            send_mail(
                subject='Restablecer contraseña',
                message=f'Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n{reset_url}\n\nEste enlace expirará en 24 horas.',
                from_email='noreply@tuapp.com',
                recipient_list=[email],
                fail_silently=False,
            )
            
            # print(f" Email enviado a {email}")
            # print(f" URL de reset: {reset_url}")
            
        except Usuario.DoesNotExist:
            pass
        except Exception as e:
            print(f" Error al enviar email: {e}")


class PasswordService:
    def iniciar_reset_por_documento(self, documento: str, request):
        """
        Busca al usuario por documento y envía email de reset
        """
        try:
            user = Usuario.objects.get(documento=documento)
            # Llamar directamente al servicio de email
            EmailService.enviar_email_reset_password(user.email, request)
        except Usuario.DoesNotExist:
            pass
        
        return True