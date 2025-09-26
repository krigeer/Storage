// src/components/ViewButton.jsx
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
    
    // Iteramos sobre las propiedades del objeto de datos
    for (const [key, value] of Object.entries(data)) {
        // Formateamos la clave: 'first_name' -> 'Nombre'
        const formattedKey = key.replace(/_/g, ' ')
                                .replace(/\b\w/g, c => c.toUpperCase());
                                
        // Convertimos objetos o arrays anidados a JSON string con formato (pre-tag)
        let displayValue;
        if (typeof value === 'object' && value !== null) {
            displayValue = `<pre style="background: #f8f9fa; padding: 5px; border-radius: 4px; font-size: 0.85em;">${JSON.stringify(value, null, 2)}</pre>`;
        } else if (value === null || value === undefined || value === '') {
            displayValue = '<span class="text-muted">N/A</span>';
        } else {
            displayValue = value.toString();
        }
        
        // Añadimos una fila a la tabla
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

export default function ViewButton({ endpoint, itemId }) {
    
  const handleView = async () => {
    try {
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
      
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
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
          // Añade una clase para personalizar el ancho del modal si usas Bootstrap o CSS personalizado
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