from rest_framework import permissions


class EsBodega(permissions.BasePermission):
    """
    Permiso personalizado que solo permite el acceso a usuarios con rol 'bodega'.
    """
    def has_permission(self, request, view):
        # Verificar si el usuario está autenticado y tiene el rol 'bodega'
        return bool(request.user and request.user.is_authenticated and request.user.rol.lower() == 'bodega')


class EsInstructor(permissions.BasePermission):
    """
    Permiso personalizado que solo permite el acceso a usuarios con rol 'instructor'.
    """
    def has_permission(self, request, view):
        # Verificar si el usuario está autenticado y tiene el rol 'instructor'
        return bool(request.user and request.user.is_authenticated and request.user.rol.lower() == 'instructor')


class TieneAccesoTotal(permissions.BasePermission):
    """
    Permiso que otorga acceso total a los usuarios con rol 'bodega'.
    Los usuarios con rol 'instructor' solo tienen acceso de lectura.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Si el usuario es de bodega, tiene acceso total
        if request.user.rol.lower() == 'bodega':
            return True
            
        # Si el usuario es instructor, solo tiene permiso de lectura (GET, HEAD, OPTIONS)
        if request.user.rol.lower() == 'instructor':
            return request.method in permissions.SAFE_METHODS
            
        return False
