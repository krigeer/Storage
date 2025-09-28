# gemini_tools.py (VERSIÓN FINAL CORREGIDA)
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Count, F
from .models import (
    Centro, Rol, TipoDocumento, EstadoUsuario, Ubicacion, EstadoInventario, 
    TipoTecnologia, Marca, Activo, Tecnologia, MaterialDidactico, Prestamo, 
    TipoReporte, EstadoReporte, PrioridadReporte, Reporte, Usuario # Agregué Usuario
)

# ////////////////////////////////////////// FUNCIONES DE INVENTARIO (Necesarias para el views.py) //////////////////////////////////////////

# (Debes incluir las 3 funciones que tu views.py está importando)

def contar_activos_por_ubicacion(nombre_ubicacion: str) -> str:
    """
    Cuenta la cantidad total de activos (Tecnología y Material Didáctico)
    en una ubicación específica.
    """
    try:
        ubicacion = Ubicacion.objects.get(nombre__iexact=nombre_ubicacion)
    except Ubicacion.DoesNotExist:
        return f"Error: No se encontró la ubicación con el nombre '{nombre_ubicacion}'."
    
    conteo_tecnologia = Tecnologia.objects.filter(ubicacion=ubicacion).count()
    conteo_material = MaterialDidactico.objects.filter(ubicacion=ubicacion).count()
    
    return f"En '{nombre_ubicacion}': Tecnología: {conteo_tecnologia}, Material Didáctico: {conteo_material}. Total: {conteo_tecnologia + conteo_material}."

# ////////////////////////////////////////// FUNCIONES DE PRÉSTAMOS (CORREGIDA) //////////////////////////////////////////

def obtener_prestamos_activos_recientes(dias: int) -> str:
    """
    Busca los préstamos que aún no han sido devueltos (fecha_devolucion es nula)
    y que fueron realizados en los últimos 'dias'.
    :param dias: El número de días a revisar para el inicio del préstamo.
    :return: Una cadena de texto con una lista de los préstamos activos.
    """
    fecha_limite = timezone.now() - timedelta(days=dias)
    
    # Busca préstamos activos (sin fecha de devolución) y recientes
    prestamos_activos = Prestamo.objects.filter(
        fecha_devolucion__isnull=True,
        fecha_prestamo__gte=fecha_limite
    ).select_related('solicitante', 'tecnologia', 'material_didactico').order_by('-fecha_prestamo')
    
    if not prestamos_activos:
        return f"No se encontraron préstamos activos iniciados en los últimos {dias} días."
        
    resultados = []
    for p in prestamos_activos[:10]: # Limitar a 10
        # Lógica para obtener el nombre del activo sin usar GenericForeignKey en values()
        item_prestado = p.tecnologia if p.tecnologia else p.material_didactico
        item_nombre = item_prestado.nombre if item_prestado else "Activo Desconocido"
        
        resultados.append(
            f"ID:{p.id}, Solicitante:{p.solicitante.username}, Activo:{item_nombre}, "
            f"Fecha Préstamo:{p.fecha_prestamo.strftime('%Y-%m-%d')}"
        )
    
    conteo = len(prestamos_activos)
    mensaje_final = f"Se encontraron {conteo} préstamos activos recientes.\n" + ("\n".join(resultados))
    
    return mensaje_final

# ////////////////////////////////////////// FUNCIONES DE REPORTES (Necesarias para el views.py) //////////////////////////////////////////

def obtener_conteo_reportes_por_estado_y_prioridad() -> str:
    """
    Genera un conteo de todos los reportes agrupados por su estado actual
    y su nivel de prioridad.
    """
    conteo = Reporte.objects.values(
        estado_nombre=F('estado__nombre'),
        prioridad_nombre=F('prioridad__nombre')
    ).annotate(
        total=Count('id')
    )

    if not conteo:
        return "No hay reportes registrados en el sistema."

    resumen = ["Resumen de Reportes por Estado y Prioridad:"]
    for item in conteo:
        resumen.append(f"- Estado: {item['estado_nombre']}, Prioridad: {item['prioridad_nombre']}, Cantidad: {item['total']}")

    return "\n".join(resumen)


# ////////////////////////////////////////// LISTA DE HERRAMIENTAS //////////////////////////////////////////

# Esta lista DEBE contener exactamente las funciones que se importan en views.py
GEMINI_FUNCTIONS = [
    contar_activos_por_ubicacion,
    obtener_prestamos_activos_recientes,
    obtener_conteo_reportes_por_estado_y_prioridad,
]