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
from rest_framework.decorators import action 
from rest_framework.response import Response

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
            'total_prestamos': Prestamo.objects.filter(fecha_devolucion__isnull=True).count(),
            'total_reportes': Reporte.objects.filter(estado__nombre='pendiente').count(),
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
