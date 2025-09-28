from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginWiew, RolViewSet , CentroViewSet, TipoDocumentosViewSet, UbicacionViewSet, StadisticsViewSet, CrearUsuarioView, EditarUsuarioViewSet, DetalleUsuarioViewSet
from  .views import EstadoInventarioViewSet, TipoTecnologiaViewSet, MarcaViewSet, TipoReporteViewSet, PrioridadReporteViewSet, EstadoReporteViewSet, TecnologiaViewSet, MaterialDidacticoViewSet, PrestamoViewSet, ReporteViewSet, ReporteListViewSet, UsuarioViewSet

router = DefaultRouter()

#rutas para la gestion de usuarios:
router.register(r'detalle_usuario', DetalleUsuarioViewSet, basename='detalle_usuario') #detalle del usuario 
router.register(r'usuarios', UsuarioViewSet, basename='usuarios') # todos los usuarios
router.register(r'tipos_documentos', TipoDocumentosViewSet, basename='tipos_documentos') # tipos de documentos

#ruta de ubicaciones
router.register(r'centros', CentroViewSet, basename='centros') #centros
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones') # ubicaciones
router.register(r'roles', RolViewSet, basename='roles') # roles


# inventario 
router.register(r'estados_inventario', EstadoInventarioViewSet, basename='estados_inventario') # estados de inventario  bueno, malo, regular, 
router.register(r'tipos_tecnologia', TipoTecnologiaViewSet, basename='tipos_tecnologia')


#tecnologia
router.register(r'marcas', MarcaViewSet, basename='marcas')  #marcas tecnologicas
router.register(r'tecnologias', TecnologiaViewSet, basename='tecnologias') # elementos tecnologicos

#materiales
router.register(r'materiales_didacticos', MaterialDidacticoViewSet, basename='materiales_didacticos') # materiales didacticos


#reportes
router.register(r'reportes', ReporteViewSet, basename='reporte') # reportes
router.register(r'prioridades_reporte', PrioridadReporteViewSet, basename='prioridades_reporte') # prioridades de reportes alta, media, baja
router.register(r'estados_reporte', EstadoReporteViewSet, basename='estados_reporte') # estados de reportes  finalizado, encuros, etc....
router.register(r'reporte_list', ReporteListViewSet, basename='reporte_list') # lista de reportes
router.register(r'tipos_reporte', TipoReporteViewSet, basename='tipos_reporte') # tipos de reportes   descargas, daño fisico, elemento faltante, etc



router.register(r'prestamos', PrestamoViewSet, basename='prestamos') # prestamos
router.register(r'estadisticas', StadisticsViewSet, basename='estadisticas') # estadisticas

#IA
from .views import GeminiChatView


urlpatterns = [
    path('gemini-chat/', GeminiChatView.as_view(), name='gemini_chat'), #ia
    path('editar_usuarios/<int:id>/', EditarUsuarioViewSet.as_view(), name='editar_usuarios'), # editar usuario
    path("crear_usuarios/", CrearUsuarioView.as_view(), name="crear-usuario"), # crear usuario
    path('login/', LoginWiew.as_view(), name='login'), # login
    path('', include(router.urls)), 
]
