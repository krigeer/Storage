# gemini_tools.py (Implementación Final y Robusta)

import json
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Q, Sum
from django.core.exceptions import ObjectDoesNotExist


from .models import (
    Ubicacion, Tecnologia, MaterialDidactico, Prestamo, Reporte, Usuario, 
    EstadoInventario, TipoReporte, PrioridadReporte
)

# ////////////////////////////////////////// FUNCIONES DE PYTHON //////////////////////////////////////////

def consultar_activos_por_ubicacion_y_tipo(nombre_ubicacion: str = None, tipo_activo: str = None, estado: str = None) -> str:
    """
    Función de lectura: Cuenta la cantidad total de activos (tecnología o material) filtrando por ubicación, tipo y estado.
    """
    q_filters = Q()
    if nombre_ubicacion:
        q_filters &= Q(ubicacion__nombre__iexact=nombre_ubicacion)
    
    if estado:
        valid_states = [choice[0] for choice in EstadoInventario.choices]
        if estado.upper() in valid_states:
             q_filters &= Q(estado=estado.upper())
        else:
             return f"Error: El estado '{estado}' no es válido. Use {', '.join(valid_states)}."

    resultados = []
    
    # Búsqueda en Tecnología (equipos únicos)
    if not tipo_activo or tipo_activo.lower() in ['tecnologia', 'equipo', 'cpu', 'monitor', 'laptop']:
        tecnologia_q = Tecnologia.objects.filter(q_filters).values('ubicacion__nombre', 'tipo__nombre', 'estado').annotate(conteo=Count('id'))
        for item in tecnologia_q:
            resultados.append(f"Tecnología: {item['tipo__nombre']} en {item['ubicacion__nombre']} ({item['estado']}): {item['conteo']} unidades")
    
    # Búsqueda en Material Didáctico (stock con cantidad)
    if not tipo_activo or tipo_activo.lower() in ['material', 'didactico', 'kit', 'herramienta']:
        material_q = MaterialDidactico.objects.filter(q_filters).values('ubicacion__nombre', 'descripcion', 'estado')
        for item in material_q.distinct():
            stock_total = MaterialDidactico.objects.filter(
                ubicacion__nombre=item['ubicacion__nombre'], 
                descripcion=item['descripcion'],
                estado=item['estado']
            ).aggregate(total_stock=Sum('cantidad')) 
            
            resultados.append(f"Material Didáctico: {item['descripcion']} en {item['ubicacion__nombre']} ({item['estado']}): Stock total {stock_total.get('total_stock', 0)} unidades")

    if not resultados:
        return "No se encontraron activos con los filtros especificados."
    
    return "Resultados de la consulta:\n" + "\n".join(resultados)

def obtener_prestamos_activos_recientes(dias: int) -> str:
    """
    Función de lectura: Busca los préstamos que aún no han sido devueltos y que fueron realizados en los últimos 'dias'.
    """
    fecha_limite = timezone.now() - timedelta(days=dias)
    prestamos_activos = Prestamo.objects.filter(
        fecha_devolucion__isnull=True,
        fecha_prestamo__gte=fecha_limite
    ).select_related('solicitante', 'tecnologia', 'material_didactico').order_by('-fecha_prestamo')
    
    if not prestamos_activos:
        return f"No se encontraron préstamos activos iniciados en los últimos {dias} días."
        
    resultados = []
    for p in prestamos_activos[:10]:
        item_nombre = str(p.tecnologia) if p.tecnologia else str(p.material_didactico)
        resultados.append(
            f"ID:{p.id}, Solicitante:{p.solicitante.get_full_name()}, Activo:{item_nombre}, "
            f"Fecha Préstamo:{p.fecha_prestamo.strftime('%Y-%m-%d')}"
        )
    
    conteo = prestamos_activos.count()
    mensaje_final = f"Se encontraron {conteo} préstamos activos recientes.\n" + ("\n".join(resultados))
    return mensaje_final

def obtener_conteo_reportes_por_estado_y_prioridad() -> str:
    """
    Función de lectura: Genera un conteo de todos los reportes agrupados por su estado actual y su nivel de prioridad.
    """
    conteo = Reporte.objects.values('estado', 'prioridad').annotate(total=Count('id'))

    if not conteo:
        return "No hay reportes registrados en el sistema."

    resumen = ["Resumen de Reportes por Estado y Prioridad:"]
    for item in conteo:
        estado_display = dict(Reporte.EstadoReporte.choices).get(item['estado'], item['estado'])
        prioridad_display = dict(Reporte.PrioridadReporte.choices).get(item['prioridad'], item['prioridad'])
        resumen.append(f"- Estado: {estado_display}, Prioridad: {prioridad_display}, Cantidad: {item['total']}")

    return "\n".join(resumen)

def registrar_prestamo_activo(documento_solicitante: int, serie_activo: str) -> str:
    """
    Función de escritura: Registra un nuevo préstamo de un activo. Útil cuando el usuario quiere PRESTAR o sacar un activo.
    """
    try:
        solicitante = Usuario.objects.get(documento=documento_solicitante)
    except ObjectDoesNotExist:
        return f"Error: Usuario con documento {documento_solicitante} no encontrado."

    activo_tecnologia = Tecnologia.objects.filter(serie_sena=serie_activo).first()
    activo_material = MaterialDidactico.objects.filter(serie_sena=serie_activo).first()
    
    if not (activo_tecnologia or activo_material):
        return f"Error: Activo con serie {serie_activo} no encontrado o la serie es incorrecta."
        
    if activo_tecnologia and Prestamo.objects.filter(tecnologia=activo_tecnologia, fecha_devolucion__isnull=True).exists():
        return f"Error: El activo tecnológico {str(activo_tecnologia)} ya se encuentra prestado."
    
    if activo_tecnologia:
        Prestamo.objects.create(solicitante=solicitante, tecnologia=activo_tecnologia)
        tipo = 'Tecnología'
    else:
        Prestamo.objects.create(solicitante=solicitante, material_didactico=activo_material)
        tipo = 'Material Didáctico'
        
    return f"Préstamo de {tipo} con serie {serie_activo} registrado con éxito para {solicitante.get_full_name()}."


def registrar_devolucion_prestamo(id_prestamo: int) -> str:
    """
    Función de escritura: Marca un préstamo existente como devuelto usando su ID. Útil cuando el usuario quiere DEVOLVER algo.
    """
    try:
        prestamo = Prestamo.objects.get(pk=id_prestamo)
        if prestamo.fecha_devolucion:
            return f"Advertencia: El Préstamo {id_prestamo} ya estaba devuelto el {prestamo.fecha_devolucion.strftime('%Y-%m-%d')}."
            
        prestamo.fecha_devolucion = timezone.now()
        prestamo.save(update_fields=['fecha_devolucion'])
        return f"Devolución del Préstamo {id_prestamo} registrada con éxito. ¡Gracias!"
    except ObjectDoesNotExist:
        return f"Error: Préstamo con ID {id_prestamo} no encontrado."


def crear_nuevo_reporte(titulo: str, observacion: str, documento_usuario: int, tipo_reporte: str, prioridad: str) -> str:
    """
    Función de escritura: Registra un nuevo reporte de daño, falla o faltante.
    Códigos de tipo: TEC (Técnica), FIS (Físico), FAL (Faltante).
    Códigos de prioridad: B (Baja), M (Media), A (Alta), C (Crítica).
    """
    try:
        usuario = Usuario.objects.get(documento=documento_usuario)
    except ObjectDoesNotExist:
        return f"Error: Usuario con documento {documento_usuario} no encontrado para el reporte."
    
    tipos_validos = [c[0] for c in TipoReporte.choices]
    prioridades_validas = [c[0] for c in PrioridadReporte.choices]
    
    if tipo_reporte not in tipos_validos:
        return f"Error: Tipo de reporte '{tipo_reporte}' inválido. Use uno de: {', '.join(tipos_validos)}."
    if prioridad not in prioridades_validas:
        return f"Error: Prioridad '{prioridad}' inválida. Use uno de: {', '.join(prioridades_validas)}."

    reporte = Reporte.objects.create(
        titulo=titulo,
        observacion=observacion,
        usuario=usuario,
        tipo=tipo_reporte,
        prioridad=prioridad
    )
    return f"Reporte #{reporte.id} ('{reporte.titulo}') creado exitosamente y en estado NUEVO."

# ////////////////////////////////////////// DEFINICIÓN DE HERRAMIENTAS (ESQUEMA JSON MANUAL) //////////////////////////////////////////

ESTADOS_INVENTARIO = [c[0] for c in EstadoInventario.choices]
TIPOS_REPORTE = [c[0] for c in TipoReporte.choices]
PRIORIDADES_REPORTE = [c[0] for c in PrioridadReporte.choices]

GEMINI_FUNCTIONS = [
    consultar_activos_por_ubicacion_y_tipo,
    obtener_prestamos_activos_recientes,
    obtener_conteo_reportes_por_estado_y_prioridad,
    registrar_prestamo_activo,
    registrar_devolucion_prestamo,
    crear_nuevo_reporte,
]