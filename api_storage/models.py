from django.db import models

# Create your models here.
class Rol(models.Model):
    id_rol = models.AutoField(primary_key= True, unique=True)
    nombre_rol = models.CharField(max_length = 100, unique=True)

class Tarea(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo