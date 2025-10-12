#metodos
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .services import enviar_credenciales_por_correo
#decoradores
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from .permissions import IsAdministrador, UserBasic
from rest_framework.decorators import action 
from rest_framework.response import Response

#modelos
from .models import Rol, Centro, TipoDocumento, Ubicacion, EstadoInventario, TipoTecnologia, Marca, TipoReporte, PrioridadReporte, EstadoReporte, Tecnologia, MaterialDidactico, Prestamo, Reporte, Usuario, Configuracion
from .serializers import LoginSerializer, CentroSerializer, TipoDocumentoSerializer, UbicacionSerializer,  TipoTecnologiaSerializer, MarcaSerializer,  TecnologiaSerializer, MaterialDidacticoSerializer, PrestamoSerializer, ReporteSerializer, UsuarioSerializer



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


# class configuracion(viewsets.ModelViewSet):
#     permission_classes = [AllowAny]
#     queryset = Configuracion.objects.all()
#     serializer_class = configuracionSerializers
