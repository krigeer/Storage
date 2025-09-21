# permissions.py
from rest_framework import permissions

class IsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.rol == '1'