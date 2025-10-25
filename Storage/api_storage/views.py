#metodos
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .services import enviar_credenciales_por_correo, PasswordService ,EmailService
from djoser.serializers import SendEmailResetSerializer
from django.shortcuts import get_object_or_404
from rest_framework.parsers import JSONParser

#decoradores
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from .permissions import IsAdministrador, UserBasic
from rest_framework.decorators import action 
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
#

#modelos
from .models import Rol, Centro, TipoDocumento, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, PrioridadReporte, EstadoReporte, Tecnologia, MaterialDidactico, Prestamo, Reporte, Usuario, Configuracion
from .serializers import LoginSerializer, CentroSerializer, TipoDocumentoSerializer, UbicacionSerializer,  TipoTecnologiaSerializer, MarcaSerializer,  TecnologiaSerializer, MaterialDidacticoSerializer, PrestamoSerializer, ReporteSerializer, UsuarioSerializer
from . serializers import RecordarContrasenaSerializer, ConfirmarResetPasswordSerializer

#IA
from google import genai
from google.genai import types
from .gemini_tools import GEMINI_FUNCTIONS, contar_activos_por_ubicacion, obtener_prestamos_activos_recientes, obtener_conteo_reportes_por_estado_y_prioridad


#python
import os




class LoginWiew(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({
                "Refresh": str(refresh),
                "Access": str(refresh.access_token),
                "user":{
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "documento": user.documento,
                    "rol": user.rol,
                    "contacto": user.contacto_principal,
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CentroViewSet(viewsets.ModelViewSet):
    queryset = Centro.objects.all()
    serializer_class = CentroSerializer
    permission_classes = [IsAdministrador]


class TipoDocumentosViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer
    permission_classes = [IsAdministrador]


class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [IsAdministrador]


class TipoTecnologiaViewSet(viewsets.ModelViewSet):
    queryset = TipoTecnologia.objects.all()
    serializer_class = TipoTecnologiaSerializer
    permission_classes = [IsAdministrador]

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [IsAdministrador]



class TecnologiaViewSet(viewsets.ModelViewSet):
    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer
    permission_classes = [IsAdministrador]

class MaterialDidacticoViewSet(viewsets.ModelViewSet):
    queryset = MaterialDidactico.objects.all()
    serializer_class = MaterialDidacticoSerializer
    permission_classes = [IsAdministrador]

class PrestamoViewSet(viewsets.ModelViewSet):
   queryset = Prestamo.objects.all().select_related('solicitante', 'tecnologia', 'material_didactico')
   permission_classes = [AllowAny]
   serializer_class = PrestamoSerializer
    # ------------------ Endpoint de BÚSQUEDA por Documento ------------------
   @action(detail=False, methods=['get'], url_path='activos')
   def listar_activos(self, request):
        documento_raw = request.query_params.get('documento') 
        if not documento_raw:
            return Response({"detail": "Se requiere el parámetro 'documento'."}, status=status.HTTP_400_BAD_REQUEST)

        #  Limpiar la cadena eliminando cualquier caracter no numérico
        documento = documento_raw.strip().strip('/').replace('/', '')

        if not documento.isdigit():
             return Response({"detail": f"El documento '{documento_raw}' debe contener solo números."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # consulta se hace con el valor limpio
            usuario = Usuario.objects.get(documento=documento) 
        except Usuario.DoesNotExist:
            return Response({"detail": f"Usuario con documento {documento} no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Filtra préstamos activos para ese usuario
        queryset = self.queryset.filter(
            solicitante=usuario,
            fecha_devolucion__isnull=True
        )
        
        serializer = self.get_serializer(queryset, many=True) 
        return Response(serializer.data)
    # ------------------ Endpoint de DEVOLUCIÓN ------------------
   @action(detail=True, methods=['patch'])
   def devolver(self, request, pk=None):
        prestamo = self.get_object()
        serializer = self.get_serializer(prestamo, data={}, partial=True)
        
        # FORZAMOS LA REVELACIÓN DE LA EXCEPCIÓN DEL SERIALIZER
        try:
            serializer.is_valid(raise_exception=True) # Esto lanza 400 
            serializer.save() 
        except Exception as e:
            # CAPTURARÁ CUALQUIER ERROR DE BASE DE DATOS O VALIDACION NO CAPTURADO
            print("--- ERROR FATAL DE DEVOLUCIÓN ---")
            import traceback
            traceback.print_exc()
            print("--- FIN DEL ERROR FATAL ---")
            
            #  500 para ver la traza de error en la consola
            return Response({"error": "Error interno al procesar la devolución."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"detail": "Devolución procesada exitosamente.", "data": serializer.data}, 
            status=status.HTTP_200_OK
        )

class ReporteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdministrador, UserBasic]
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    # permission_classes = [IsAdministrador]

class ReporteListViewSet(viewsets.ViewSet):
    permission_classes = [IsAdministrador]
    def list(self, request):
        data = {
            'total_reportes': Reporte.objects.all().count(),
            'pendientes': Reporte.objects.filter(estado='NUE').count(),
            'en_proceso': Reporte.objects.filter(estado='REV').count(),
            'finalizados': Reporte.objects.filter(estado='CER').count(),
        }
        return Response(data)
    # permission_classes = [IsAdministrador]


class StadisticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdministrador]
    def list(self, request):
        data = {
            'total_usuarios': Usuario.objects.all().count(),
            'total_tecnologias': Tecnologia.objects.all().count(),
            'total_material': MaterialDidactico.objects.all().count(),
            'total_prestamos': Prestamo.objects.filter(fecha_devolucion__isnull=True).count(),
            'total_reportes': Reporte.objects.filter(estado='NUE').count(),
        }
        return Response(data)


class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdministrador]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class CrearUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all() 
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdministrador]

class EditarUsuarioViewSet(RetrieveUpdateAPIView):
    permission_classes = [IsAdministrador, UserBasic]
    queryset = Usuario.objects.all()
    lookup_field = 'id'
    serializer_class = UsuarioSerializer


class DetalleUsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdministrador, UserBasic]
    queryset = Usuario.objects.all()
    lookup_field = 'id'
    serializer_class = UsuarioSerializer


class RecordarContrasenaView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RecordarContrasenaSerializer
    # ¡Añadir esta línea es la solución!
    parser_classes = [JSONParser] 
    
    def post(self, request, *args, **kwargs):
        print("Content-Type RECEIVED:", request.content_type)
        print("Full Headers:", request.headers)
        
        # El serializer ahora podrá acceder a request.data
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        documento = serializer.validated_data.get('documento')
        
        # Llamada al servicio
        PasswordService().iniciar_reset_por_documento(documento, request)
        
        return Response(
            {"detail": "Si la cuenta existe, recibirá un correo electrónico con un enlace para restablecer su contraseña."},
            status=status.HTTP_200_OK
        )
    
class UserViewSet(viewsets.ModelViewSet):
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def reset_password(self, request):
        serializer =  RecordarContrasenaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        # Llamar al servicio de envío de email
        EmailService.enviar_email_reset_password(email, request)
        
        return Response(
            {"detail": "Si la cuenta existe, recibirá un correo."},
            status=status.HTTP_200_OK
        )


class ConfirmarResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ConfirmarResetPasswordSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            # Decodificar el uid
            user_id = force_str(urlsafe_base64_decode(uid))
            user = Usuario.objects.get(pk=user_id)
            
            # Validar el token
            if not default_token_generator.check_token(user, token):
                return Response(
                    {"detail": "El enlace de restablecimiento es inválido o ha expirado."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Cambiar la contraseña
            user.set_password(new_password)
            user.save()
            
            return Response(
                {"detail": "Contraseña restablecida exitosamente."},
                status=status.HTTP_200_OK
            )
            
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response(
                {"detail": "El enlace de restablecimiento es inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )


# Vista opcional para validar el token antes de mostrar el formulario
class ValidarTokenResetView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = Usuario.objects.get(pk=user_id)
            
            if default_token_generator.check_token(user, token):
                return Response(
                    {"detail": "Token válido", "valid": True},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"detail": "Token inválido o expirado", "valid": False},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response(
                {"detail": "Token inválido", "valid": False},
                 status=status.HTTP_400_BAD_REQUEST
            )

  
               
class RolChoicesView(APIView):
    def get(self, request):
        roles = [{'id': c.value, 'nombre': c.label} for c in Rol]
        return Response(roles)



try:
    client = genai.Client()
except Exception as e:
    print(f"Error al inicializar el cliente Gemini: {e}")
    client = None 
MODEL = 'gemini-2.5-flash' 

function_map = {
    'contar_activos_por_ubicacion': contar_activos_por_ubicacion,
    'obtener_prestamos_activos_recientes': obtener_prestamos_activos_recientes,
    'obtener_conteo_reportes_por_estado_y_prioridad': obtener_conteo_reportes_por_estado_y_prioridad,
}

class GeminiChatView(APIView):
    permission_classes = [AllowAny]
    """
    Endpoint para manejar la conversación con Gemini, integrando Function Calling
    para acceder a la base de datos  (RAG).
    """
    def post(self, request):
        user_prompt = request.data.get('prompt')
        
        if not user_prompt:
            return Response({"error": "Prompt (pregunta) es requerido."}, status=400)
        
        if not client:
             return Response({"error": "El cliente Gemini no está inicializado. Verifica tu clave API."}, status=500)

        #  historial de mensajes (solo el prompt inicial)
        contents = [user_prompt]
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    tools=GEMINI_FUNCTIONS 
                )
            )
            if response.function_calls:
                function_call = response.function_calls[0]
                func_name = function_call.name
                func_args = dict(function_call.args)
                
                print(f"-> Gemini solicitó la función: {func_name} con argumentos: {func_args}")
                if func_name in function_map:
                    function_to_call = function_map[func_name]
                    function_response_content = function_to_call(**func_args)
                else:
                    function_response_content = f"Error: La función '{func_name}' solicitada por Gemini no está definida en el mapeo local."

                print(f"-> Resultado de la BD (retorno al modelo):\n{function_response_content[:150]}...")
                contents.append(
                    types.Part.from_function_call(function_call)
                )
                contents.append(
                    types.Part.from_function_response(
                        name=func_name,
                        response={"content": function_response_content}
                    )
                )
                second_response = client.models.generate_content(
                    model=MODEL,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        tools=GEMINI_FUNCTIONS
                    )
                )
                final_text = second_response.text
            else:

                final_text = response.text

            return Response({"response": final_text})

        except Exception as e:
            print(f"Error general en la vista GeminiChatView: {e}")
            return Response({"error": f"Ocurrió un error en el proceso de IA: {str(e)}"}, status=500)













# class configuracion(viewsets.ModelViewSet):
#     permission_classes = [AllowAny]
#     queryset = Configuracion.objects.all()
#     serializer_class = configuracionSerializers
