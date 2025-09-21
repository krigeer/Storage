from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginWiew, RolViewSet , CentroViewSet, TipoDocumentosViewSet, UbicacionViewSet, StadisticsViewSet, CrearUsuarioView, EditarUsuarioViewSet
from  .views import EstadoInventarioViewSet, TipoTecnologiaViewSet, MarcaViewSet, TipoReporteViewSet, PrioridadReporteViewSet, EstadoReporteViewSet, TecnologiaViewSet, MaterialDidacticoViewSet, PrestamoViewSet, ReporteViewSet, ReporteListViewSet, UsuarioViewSet

router = DefaultRouter()
router.register(r'centros', CentroViewSet, basename='centros')
router.register(r'roles', RolViewSet, basename='roles')
router.register(r'tipos_documentos', TipoDocumentosViewSet, basename='tipos_documentos')
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones')
router.register(r'estados_inventario', EstadoInventarioViewSet, basename='estados_inventario')
router.register(r'tipos_tecnologia', TipoTecnologiaViewSet, basename='tipos_tecnologia')
router.register(r'marcas', MarcaViewSet, basename='marcas')
router.register(r'reportes', ReporteViewSet, basename='reporte')
router.register(r'prioridades_reporte', PrioridadReporteViewSet, basename='prioridades_reporte')
router.register(r'estados_reporte', EstadoReporteViewSet, basename='estados_reporte')
router.register(r'tecnologias', TecnologiaViewSet, basename='tecnologias')
router.register(r'materiales_didacticos', MaterialDidacticoViewSet, basename='materiales_didacticos')
router.register(r'prestamos', PrestamoViewSet, basename='prestamos')
router.register(r'reportes', ReporteViewSet, basename='reportes')
router.register(r'estadisticas', StadisticsViewSet, basename='estadisticas')
router.register(r'reporte_list', ReporteListViewSet, basename='reporte_list')
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'tipos_reporte', TipoReporteViewSet, basename='tipos_reporte')

urlpatterns = [
    path('editar_usuarios/<int:id>/', EditarUsuarioViewSet.as_view(), name='editar_usuarios'),
    path("crear_usuarios/", CrearUsuarioView.as_view(), name="crear-usuario"),
    path('login/', LoginWiew.as_view(), name='login'),
    path('', include(router.urls)),
]
