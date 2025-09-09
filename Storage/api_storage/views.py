from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone

from .models import (
    Centro, Rol, Usuario, Ubicacion, TipoTecnologia, Marca, Tecnologia,
    MaterialDidactico, Prestamo
)
from .serializers import (
    CentroSerializer, RolSerializers, LoginSerializer,
    UsuarioCreateSerializer,
    UbicacionSerializer, UbicacionCreateSerializer,
    TipoTecnologiaSerializer, MarcaSerializer, TecnologiaSerializer,
    TecnologiaCreateUpdateSerializer, MaterialDidacticoSerializer,
    MaterialDidacticoCreateUpdateSerializer, PrestamoSerializer,
    PrestamoCreateSerializer
)
from .permissions import TieneAccesoTotal, EsBodega


class LoginView(APIView):
    """
    Vista para autenticar un usuario y devolver un token de autenticación.
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Obtener o crear un token para el usuario
        token, created = Token.objects.get_or_create(user=user)
        
        # Datos del usuario a devolver
        user_data = {
            'id': user.id,
            'documento': user.documento,
            'rol': user.rol,
            'centro': user.centro,
            'tipo_documento': user.tipo_documento,
            'estado': user.estado,
        }
        
        return Response({
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_200_OK)


class CentroViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar centros.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    queryset = Centro.objects.all().order_by('nombre')
    serializer_class = CentroSerializer
    permission_classes = [IsAuthenticated, EsBodega]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'direccion']
    ordering_fields = ['nombre', 'creado_en']

    def perform_create(self, serializer):
        # Se puede agregar lógica adicional al crear un centro
        serializer.save()

    def perform_update(self, serializer):
        # Se puede agregar lógica adicional al actualizar un centro
        serializer.save()


class UbicacionViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar ubicaciones.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    permission_classes = [IsAuthenticated, EsBodega]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['centro']
    search_fields = ['nombre', 'descripcion', 'centro__nombre']
    ordering_fields = ['nombre', 'centro__nombre']

    def get_queryset(self):
        return Ubicacion.objects.select_related('centro').order_by('centro__nombre', 'nombre')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UbicacionCreateSerializer
        return UbicacionSerializer

    def perform_create(self, serializer):
        # Se puede agregar lógica adicional al crear una ubicación
        serializer.save()

    def perform_update(self, serializer):
        # Se puede agregar lógica adicional al actualizar una ubicación
        serializer.save()


class RolViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar roles.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    queryset = Rol.objects.all().order_by('nombre')
    serializer_class = RolSerializers
    permission_classes = [IsAuthenticated, EsBodega]


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar usuarios.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    queryset = Usuario.objects.all().order_by('username')
    permission_classes = [IsAuthenticated, TieneAccesoTotal]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'first_name', 'last_name', 'documento', 'email']
    ordering_fields = ['username', 'first_name', 'last_name', 'date_joined']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return 'UsuarioUpdateSerializer'
        return 'UsuarioSerializer'
    
    def perform_create(self, serializer):
        #  solo el personal de bodega pueda crear usuarios
        if self.request.user.rol.lower() != 'bodega':
            raise PermissionDenied("No tienes permiso para crear usuarios")
        
        # Guardar el usuario con la contraseña temporal
        usuario = serializer.save()
        
        # El correo se envía automáticamente desde el serializador
        
    def get_permissions(self):
        """
         personalizar los permisos por acción.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]  # Todos los autenticados pueden ver
        elif self.action == 'create':
            permission_classes = [IsAuthenticated, EsBodega]  # Solo bodega puede crear
        else:
            permission_classes = [IsAuthenticated, TieneAccesoTotal]  # Solo bodega puede modificar
            
        return [permission() for permission in permission_classes]


# Vistas para Tecnología
class TipoTecnologiaViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar tipos de tecnología.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    queryset = TipoTecnologia.objects.all().order_by('nombre')
    serializer_class = TipoTecnologiaSerializer
    permission_classes = [IsAuthenticated, TieneAccesoTotal]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']


class MarcaViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar marcas.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    queryset = Marca.objects.all().order_by('nombre')
    serializer_class = MarcaSerializer
    permission_classes = [IsAuthenticated, TieneAccesoTotal]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']


class TecnologiaViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar tecnología.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    permission_classes = [IsAuthenticated, TieneAccesoTotal]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'marca', 'ubicacion', 'estado']
    search_fields = ['nombre', 'serie_fabricante', 'serie_sena', 'descripcion']
    ordering_fields = ['nombre', 'tipo__nombre', 'marca__nombre', 'creado_en']

    def get_queryset(self):
        return Tecnologia.objects.select_related(
            'tipo', 'marca', 'ubicacion', 'estado'
        ).order_by('nombre')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TecnologiaCreateUpdateSerializer
        return TecnologiaSerializer


# Vistas para Material Didáctico
class MaterialDidacticoViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar material didáctico.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo lectura (GET)
    """
    permission_classes = [IsAuthenticated, TieneAccesoTotal]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ubicacion', 'estado']
    search_fields = ['nombre', 'serie_fabricante', 'serie_sena', 'descripcion']
    ordering_fields = ['nombre', 'cantidad', 'creado_en']

    def get_queryset(self):
        return MaterialDidactico.objects.select_related(
            'ubicacion', 'estado'
        ).order_by('nombre')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MaterialDidacticoCreateUpdateSerializer
        return MaterialDidacticoSerializer


# Vistas para Préstamos
class PrestamoViewSet(viewsets.ModelViewSet):
    """
    Vista para gestionar préstamos.
    - Bodega: Acceso total (GET, POST, PUT, PATCH, DELETE)
    - Instructor: Solo puede ver y crear préstamos propios
    """
    serializer_class = PrestamoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['content_type', 'solicitante', 'fecha_prestamo', 'fecha_devolucion']
    search_fields = ['observacion', 'objeto__nombre']
    ordering_fields = ['fecha_prestamo', 'fecha_devolucion']

    def get_queryset(self):
        queryset = Prestamo.objects.select_related(
            'content_type', 'solicitante'
        ).prefetch_related('objeto').order_by('-fecha_prestamo')
        
        # Si es instructor, solo puede ver sus propios préstamos
        if self.request.user.rol.lower() == 'instructor':
            return queryset.filter(solicitante=self.request.user)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return PrestamoCreateSerializer
        return PrestamoSerializer

    def perform_create(self, serializer):
        # Asignar el usuario autenticado como solicitante
        serializer.save(solicitante=self.request.user)


class PrestamoDevolverView(APIView):
    """
    Vista para registrar la devolución de un préstamo.
    - Bodega: Puede registrar devoluciones de cualquier préstamo
    - Instructor: Solo puede registrar devoluciones de sus propios préstamos
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):
        try:
            prestamo = Prestamo.objects.get(pk=pk)
            
            # Verificar permisos
            if request.user.rol.lower() == 'instructor' and prestamo.solicitante != request.user:
                return Response(
                    {'error': 'No tiene permiso para registrar esta devolución'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Verificar si ya está devuelto
            if prestamo.fecha_devolucion:
                return Response(
                    {'error': 'Este préstamo ya fue devuelto'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Registrar la devolución
            prestamo.fecha_devolucion = timezone.now()
            prestamo.save()
            
            serializer = PrestamoSerializer(prestamo)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Prestamo.DoesNotExist:
            return Response(
                {'error': 'Préstamo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )