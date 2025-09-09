from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CentroViewSet, RolViewSet, LoginView,
    UbicacionViewSet, UsuarioViewSet,
    TipoTecnologiaViewSet, MarcaViewSet, TecnologiaViewSet,
    MaterialDidacticoViewSet, PrestamoViewSet, PrestamoDevolverView
)

router = DefaultRouter()
# Rutas existentes
router.register(r'centros', CentroViewSet, basename='centro')
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicacion')
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

# Nuevas rutas para Tecnología
router.register(r'tipos-tecnologia', TipoTecnologiaViewSet, basename='tipo-tecnologia')
router.register(r'marcas', MarcaViewSet, basename='marca')
router.register(r'tecnologias', TecnologiaViewSet, basename='tecnologia')

# Ruta para Material Didáctico
router.register(r'materiales-didacticos', MaterialDidacticoViewSet, basename='material-didactico')

# Ruta para Préstamos
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('prestamos/<int:pk>/devolver/', PrestamoDevolverView.as_view(), name='prestamo-devolver'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]