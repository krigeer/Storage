from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginWiew, CentroViewSet, TipoDocumentosViewSet, UbicacionViewSet, StadisticsViewSet, CrearUsuarioView, EditarUsuarioViewSet, DetalleUsuarioViewSet
from  .views import  TipoTecnologiaViewSet, MarcaViewSet, TecnologiaViewSet, MaterialDidacticoViewSet, PrestamoViewSet, ReporteViewSet, ReporteListViewSet, UsuarioViewSet


router = DefaultRouter()

#ruta de ubicaciones
router.register(r'centros', CentroViewSet, basename='centros') #centros (L)
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones') # ubicaciones (L)
# inventario 
router.register(r'tipos_tecnologia', TipoTecnologiaViewSet, basename='tipos_tecnologia') # tipos de tecnologia ejm: cpu, portail, monitor (L)
#tecnologia
router.register(r'marcas', MarcaViewSet, basename='marcas')  #marcas tecnologicas    (L)
router.register(r'tecnologias', TecnologiaViewSet, basename='tecnologias') # elementos tecnologicos (L)
#materiales
router.register(r'materiales_didacticos', MaterialDidacticoViewSet, basename='materiales_didacticos') # materiales didacticos (L)
#reportes
router.register(r'reportes', ReporteViewSet, basename='reporte') # reportes
router.register(r'reporte_list', ReporteListViewSet, basename='reporte_list') # lista de reportes (L)

#prestamos
router.register(r'prestamos', PrestamoViewSet, basename='prestamos') # prestamos
router.register(r'estadisticas', StadisticsViewSet, basename='estadisticas') # estadisticas  (L)



#rutas para la gestion de usuarios:
router.register(r'detalle_usuario', DetalleUsuarioViewSet, basename='detalle_usuario') #detalle del usuario  (L)
router.register(r'usuarios', UsuarioViewSet, basename='usuarios') # todos los usuarios (L)
router.register(r'tipos_documentos', TipoDocumentosViewSet, basename='tipos_documentos') # tipos de documentos (L)


# router.register(r'configuracion', configuracion, basename="configuracion")
urlpatterns = [
    path('editar_usuarios/<int:id>/', EditarUsuarioViewSet.as_view(), name='editar_usuarios'), # editar usuario
    path("crear_usuarios/", CrearUsuarioView.as_view(), name="crear-usuario"), # crear usuario (L)
    path('login/', LoginWiew.as_view(), name='login'), # login
    path('', include(router.urls)), 
]
