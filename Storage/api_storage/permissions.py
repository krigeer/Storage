from rest_framework import permissions

class IsAdministrador(permissions.BasePermission):
    
    ROLES_PERMITIDOS = ['ADM', 'INS']
    ROL_ADMIN = 'ADM'

    # --- Permiso a Nivel de Vista (URL general: ---
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        user_rol = request.user.rol
        # rol del usuario está en la lista de permitidos, concede el acceso a la vista.
        return user_rol in self.ROLES_PERMITIDOS
    

    # --- Permiso a Nivel de Objeto) ---
    def has_object_permission(self, request, view, obj):
        
        user_rol = request.user.rol
        
        # 1. Un Administrador (ADM) tiene permiso total sobre cualquier objeto.
        if user_rol == self.ROL_ADMIN:
            return True

        # 2. para  (INS)
        if user_rol == 'INS':
            
            # El INS solo puede interactuar con su propia cuenta 

            # Permisos de Lectura (GET, HEAD, OPTIONS): 
            # El INS puede ver (GET) el detalle solo de sí mismo.
            if request.method in permissions.SAFE_METHODS:
                return obj == request.user

            # Permisos de Escritura (PUT, PATCH): 
            # El INS solo puede editar (PUT/PATCH) su propia cuenta.
            if request.method in ['PUT', 'PATCH']:
                return obj == request.user
        
        # Denegar cualquier otro caso.
        return False