#metodos
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .services import enviar_correo_credenciales
#decoradores
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from .permissions import IsAdministrador

#modelos
from .models import Rol, Centro, TipoDocumento, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, PrioridadReporte, EstadoReporte, Tecnologia, MaterialDidactico, Prestamo, Reporte, Usuario
from .serializers import LoginSerializer, RolSerializer, CentroSerializer, TipoDocumentoSerializer, UbicacionSerializer, EstadoInventarioSerializer, TipoTecnologiaSerializer, MarcaSerializer, TipoReporteSerializer, PrioridadReporteSerializer, EstadoReporteSerializer, TecnologiaSerializer, MaterialDidacticoSerializer, PrestamoSerializer, ReporteSerializer, UsuarioSerializer



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
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "documento": user.documento,
                    "rol": user.rol.id,
                    "contacto": user.contacto_principal,
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
class CentroViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Centro.objects.all()
    serializer_class = CentroSerializer
    # permission_classes = [IsAdministrador]

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [AllowAny]


class TipoDocumentosViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer
    permission_classes = [AllowAny]


class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [AllowAny]

class EstadoInventarioViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = EstadoInventario.objects.all()
    serializer_class = EstadoInventarioSerializer
    permission_classes = [AllowAny] 

class TipoTecnologiaViewSet(viewsets.ModelViewSet):
    queryset = TipoTecnologia.objects.all()
    serializer_class = TipoTecnologiaSerializer
    permission_classes = [AllowAny]

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [AllowAny]

class TipoReporteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = TipoReporte.objects.all()
    serializer_class = TipoReporteSerializer
    # permission_classes = [IsAdministrador]

class PrioridadReporteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = PrioridadReporte.objects.all()
    serializer_class = PrioridadReporteSerializer
    # permission_classes = [IsAdministrador]

class EstadoReporteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = EstadoReporte.objects.all()
    serializer_class = EstadoReporteSerializer
    # permission_classes = [IsAdministrador]

class TecnologiaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer
    # permission_classes = [IsAdministrador]

class MaterialDidacticoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = MaterialDidactico.objects.all()
    serializer_class = MaterialDidacticoSerializer
    # permission_classes = [IsAdministrador]

class PrestamoViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    # permission_classes = [IsAdministrador]

class ReporteViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    # permission_classes = [IsAdministrador]

class ReporteListViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    def list(self, request):
        data = {
            'total_reportes': Reporte.objects.all().count(),
            'pendientes': Reporte.objects.filter(estado__nombre='pendiente').count(),
            'en_proceso': Reporte.objects.filter(estado__nombre='en_proceso').count(),
            'finalizados': Reporte.objects.filter(estado__nombre='finalizado').count(),
        }
        return Response(data)
    # permission_classes = [IsAdministrador]


class StadisticsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    def list(self, request):
        data = {
            'total_usuarios': Usuario.objects.all().count(),
            'total_tecnologias': Tecnologia.objects.all().count(),
            'total_material': MaterialDidactico.objects.all().count(),
            'total_prestamos': Prestamo.objects.all().count(),
            'total_reportes': Reporte.objects.all().count(),
        }
        return Response(data)


class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class CrearUsuarioView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            contrasena_generada = usuario._contrasena_plana

            # Enviar correo con credenciales
            enviar_correo_credenciales(usuario.email, contrasena_generada)

            return Response(
                {"mensaje": "Usuario creado y credenciales enviadas al correo"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditarUsuarioViewSet(RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    queryset = Usuario.objects.all()
    lookup_field = 'id'
    serializer_class = UsuarioSerializer


class DetalleUsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Usuario.objects.all()
    lookup_field = 'id'
    serializer_class = UsuarioSerializer
