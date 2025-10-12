from rest_framework import permissions

class IsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        rol_admin_db = 'ADM' 
        
        return request.user.rol == rol_admin_db