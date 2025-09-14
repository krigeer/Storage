from django.apps import AppConfig


class ApiStorageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_storage'
    verbose_name = 'Gestión de Almacén'
    
    def ready(self):
    
        import api_storage.signals  

