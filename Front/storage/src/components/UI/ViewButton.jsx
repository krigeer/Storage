import React from 'react';
import { FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../config/data'; 

// Función auxiliar para formatear los datos para el cuerpo del SweetAlert como una tabla
const formatDataForSwal = (data) => {
    let htmlContent = `
        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
        <table class="table table-striped table-sm" style="width: 100%;">
            <tbody>
    `;
    
    // **PASO 1: Identificar las claves a IGNORAR (los *_id que tienen un campo relacionado).**
    const keysToIgnore = new Set();
    const relatedKeys = new Set();
    
    // Primero, encuentra todas las claves de relación (sin _id) y marca las claves *_id para ignorar
    for (const key of Object.keys(data)) {
        if (key.endsWith('_id')) {
            const relatedKey = key.slice(0, -3); // Ejemplo: 'solicitante'
            
            // Si el campo de relación existe en la data (ej. data.solicitante existe)
            if (data.hasOwnProperty(relatedKey)) {
                keysToIgnore.add(key); // Ignorar 'solicitante_id'
                relatedKeys.add(relatedKey); // Guardar 'solicitante' para asegurarnos de que se itere
            }
        }
    }
    
    // **PASO 2: Ordenar las claves para iterar (priorizar claves de relación).**
    const sortedKeys = Object.keys(data).sort((a, b) => {
        // Mueve los campos de relación (ej. 'solicitante', 'tecnologia') al inicio
        if (relatedKeys.has(a) && !relatedKeys.has(b)) return -1;
        if (!relatedKeys.has(a) && relatedKeys.has(b)) return 1;
        return a.localeCompare(b);
    });

    // **PASO 3: Iterar y construir la tabla, aplicando el filtro y el formato.**
    for (const key of sortedKeys) {
        
        // Si la clave está marcada para ignorar (es un *_id que tiene su nombre), la saltamos.
        if (keysToIgnore.has(key)) {
            continue;
        }

        const value = data[key];
        
        // Formateamos la clave: 'first_name' -> 'First Name'
        const formattedKey = key.replace(/_/g, ' ')
                                     .replace(/\b\w/g, c => c.toUpperCase());
                                     
        // Manejo de valores para mostrar
        let displayValue;
        
        if (typeof value === 'object' && value !== null) {
            // Maneja objetos/arrays anidados mostrando el JSON formateado
            displayValue = `<pre style="background: #f8f9fa; padding: 5px; border-radius: 4px; font-size: 0.85em;">${JSON.stringify(value, null, 2)}</pre>`;
        } else if (value === null || value === undefined || value === '') {
            // Maneja valores nulos o vacíos. Esto cubre los StringRelatedField que son null.
            displayValue = '<span class="text-muted">N/A</span>';
        } else {
            // Maneja valores simples (cadenas, números, booleanos)
            if (typeof value === 'boolean') {
                displayValue = value ? 'Sí' : 'No';
            } else {
                displayValue = value.toString();
            }
        }
        
        // Agregar la fila a la tabla
        htmlContent += `
            <tr>
                <td style="font-weight: bold; width: 35%; padding: 5px 10px; border-top: 1px solid #dee2e6;">${formattedKey}</td>
                <td style="width: 65%; padding: 5px 10px; border-top: 1px solid #dee2e6; word-break: break-all;">${displayValue}</td>
            </tr>
        `;
    }
    
    htmlContent += `
            </tbody>
        </table>
        </div>
    `;
    return htmlContent;
};

// ----------------------------------------------------------------------
// El componente ViewButton permanece SIN cambios
// ----------------------------------------------------------------------
export default function ViewButton({ endpoint, itemId }) {
    
    const handleView = async () => {
        try {
            // Aquí asumo que la URL base termina con un slash si el endpoint lo requiere
            const url = `${API_BASE_URL}${endpoint}/${itemId}/`; 
            
            // Mostrar spinner de carga
            Swal.fire({
                title: 'Cargando Detalles...',
                text: 'Obteniendo información de la API...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            
            // Se asume que la petición debe incluir autenticación si la API lo requiere
            const token = localStorage.getItem('accessToken'); 
            const response = await fetch(url, {
                headers: {
                    // Agregar el token de autenticación si está disponible
                    ...(token && { Authorization: `Bearer ${token}` }), 
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || response.statusText}`);
            }

            const itemData = await response.json();
            
            // Cerrar el SweetAlert de carga y mostrar los datos en una tabla
            Swal.close(); 
            
            Swal.fire({
                title: `<span style="color: #0d6efd;">Detalle del Elemento #${itemId}</span>`,
                html: formatDataForSwal(itemData), 
                icon: 'info',
                confirmButtonText: 'Cerrar',
                showCloseButton: true,
                // Personaliza el ancho del modal
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-responsive' 
                }
            });
            
        } catch (error) {
            // Mostrar error si la petición falla
            Swal.fire({
                icon: 'error',
                title: 'Error de Carga',
                text: `No se pudo obtener el detalle: ${error.message}`
            });
        }
    };

    return (
        <button 
            className="btn btn-primary btn-sm" 
            onClick={handleView}
            title="Ver Detalle"
        >
            <FaEye />
        </button>
    );
}