#metodos
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

#decoradores
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from .permissions import IsAdministrador

#modelos
from .models import Rol, Centro, TipoDocumento, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, PrioridadReporte, EstadoReporte, Tecnologia, MaterialDidactico, Prestamo, Reporte, Usuario
from .serializers import LoginSerializer, RolSerializer, CentroSerializer, TipoDocumentoSerializer, UbicacionSerializer, EstadoInventarioSerializer, TipoTecnologiaSerializer, MarcaSerializer, TipoReporteSerializer, PrioridadReporteSerializer, EstadoReporteSerializer, TecnologiaSerializer, MaterialDidacticoSerializer, PrestamoSerializer, ReporteSerializer



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
                    "rol": user.rol,
                    "centro": user.centro,
                    "fecha_creacion": user.fecha_creacion,
                    "fecha_actualizacion": user.fecha_actualizacion,
                }
            }, status_status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
class CentroViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Centro.objects.all()
    serializer_class = CentroSerializer
    # permission_classes = [IsAdministrador] 1

class RolViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    # permission_classes = [IsAdministrador] 2


class TipoDocumentosViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer
    # permission_classes = [IsAdministrador]  3


class UbicacionViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    # permission_classes = [IsAdministrador]  4

class EstadoInventarioViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = EstadoInventario.objects.all()
    serializer_class = EstadoInventarioSerializer
    # permission_classes = [IsAdministrador] 

class TipoTecnologiaViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = TipoTecnologia.objects.all()
    serializer_class = TipoTecnologiaSerializer
    # permission_classes = [IsAdministrador] 6

class MarcaViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    # permission_classes = [IsAdministrador] 7

class TipoReporteViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = TipoReporte.objects.all()
    serializer_class = TipoReporteSerializer
    # permission_classes = [IsAdministrador]

class PrioridadReporteViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = PrioridadReporte.objects.all()
    serializer_class = PrioridadReporteSerializer
    # permission_classes = [IsAdministrador]

class EstadoReporteViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = EstadoReporte.objects.all()
    serializer_class = EstadoReporteSerializer
    # permission_classes = [IsAdministrador]

class TecnologiaViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer
    # permission_classes = [IsAdministrador]

class MaterialDidacticoViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = MaterialDidactico.objects.all()
    serializer_class = MaterialDidacticoSerializer
    # permission_classes = [IsAdministrador]

class PrestamoViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    # permission_classes = [IsAdministrador]

class ReporteViewSet(viewsets.ModelViewSet):
    permissions = [AllowAny]
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
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
