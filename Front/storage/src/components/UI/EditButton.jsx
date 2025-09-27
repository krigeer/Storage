import React from 'react';
import { FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../config/data';
import { formConfigs } from '../../config/formConfigs';

// --- 1. Función para cargar opciones de Select ---
const fetchSelectOptions = async (endpoint, valueKey, textKey) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error al cargar opciones para ${endpoint}`, response);
      return [];
    }

    const data = await response.json();
    // la respuesta tiene un array en 'results'
    const results = Array.isArray(data) ? data : data.results || [];

    return results.map(item => ({
      value: item[valueKey],
      text: item[textKey]
    }));
  } catch (error) {
    console.error(`Error de red al obtener opciones para ${endpoint}:`, error);
    return [];
  }
};

// --- 2. Función auxiliar para generar el HTML del formulario ---
//cepta un objeto de 'selectOptions'
const generateFormHTML = (fields, itemData, selectOptions) => {
  let htmlContent = '<div style="text-align: left;">';

  fields.forEach(field => {
    const fieldId = field.id;
    // El valor actual del ítem puede ser el ID (para FKs) o el valor directo.
    // Si el valor es un objeto (porque el serializador incluye StringRelatedField), 
    const currentValue = itemData[fieldId] || field.defaultValue || '';

    // Formatear la etiqueta
    const labelText = field.placeholder || fieldId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    if (field.type === 'hidden') {
      htmlContent += `<input type="hidden" id="swal-input-${fieldId}" value="${currentValue}">`;
    } else if (field.type === 'select') {
      // Manejo de SELECT: construimos la etiqueta <select> con opciones
      const options = selectOptions[fieldId] || [];

      let selectTag = `
                <label for="swal-input-${fieldId}" class="form-label mt-2">${labelText}:</label>
                <select id="swal-input-${fieldId}" class="swal2-select form-select">
            `;

      options.forEach(option => {
        // Pre-selecciona la opción si su valor coincide con el currentValue del ítem
        const isSelected = option.value === currentValue;
        selectTag += `<option value="${option.value}" ${isSelected ? 'selected' : ''}>${option.text}</option>`;
      });

      selectTag += `</select>`;
      htmlContent += selectTag;

    } else {
      // Manejar tipos de texto estándar (text, number, email, date)
      htmlContent += `
                <label for="swal-input-${fieldId}" class="form-label mt-2">${labelText}:</label>
                <input 
                    id="swal-input-${fieldId}" 
                    class="swal2-input form-control" 
                    type="${field.type}" 
                    value="${currentValue}" 
                    placeholder="${field.placeholder}"
                    ${field.readOnly ? 'readonly' : ''}
                />
            `;
    }
  });

  htmlContent += '</div>';
  return htmlContent;
};

// --- Componente principal ---
export default function EditButton({ endpoint, itemId, onActionSuccess }) {

  const handleEdit = async () => {
    const itemUrl = `${API_BASE_URL}${endpoint}/${itemId}/`;

    const configKey = endpoint === 'usuarios' ? 'crear_usuarios' : endpoint;
    const config = formConfigs[configKey];

    if (!config) {
      return Swal.fire('Error de Configuración', `No se encontró la configuración para el endpoint: ${configKey}`, 'error');
    }

    // 3. Identificar y cargar todas las opciones SELECT necesarias
    const selectFields = config.fields.filter(field => field.type === 'select');
    const selectPromises = selectFields.map(field =>
      fetchSelectOptions(field.options.endpoint, field.options.valueKey, field.options.textKey)
    );

    // --- PASO 1: Cargar datos y opciones simultáneamente ---
    try {
      Swal.fire({
        title: 'Cargando datos...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      // Promesa para cargar el item actual
      const itemPromise = fetch(itemUrl).then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudo obtener el registro.`);
        return res.json();
      });

      // Esperar el item y todas las opciones de select
      const [itemData, ...optionsResults] = await Promise.all([itemPromise, ...selectPromises]);

      // Mapear los resultados de las opciones a un objeto por fieldId
      const selectOptions = {};
      selectFields.forEach((field, index) => {
        selectOptions[field.id] = optionsResults[index];
      });

      Swal.close();

      // --- PASO 2: Abrir el SweetAlert con el formulario dinámico ---
      const { value: formValues } = await Swal.fire({
        title: `Editar ${config.title}`,
        // el HTML pasando los datos del item y las opciones
        html: generateFormHTML(config.fields, itemData, selectOptions),
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'swal2-responsive'
        },
        preConfirm: () => {
          const data = {};
          let isValid = true;

          // Recolectar datos de todos los campos
          config.fields.forEach(field => {
            const inputElement = document.getElementById(`swal-input-${field.id}`);

            if (inputElement) {
              let value = inputElement.value;

              // Simple validación de campos obligatorios
              if (field.type !== 'hidden' && value.trim() === '' && !field.readOnly) {
                Swal.showValidationMessage(`El campo ${field.placeholder || field.id} es obligatorio.`);
                isValid = false;
              }

              // Conversión de tipo si es necesario
              if (field.type === 'number' || field.type === 'select') {
                // Los selects devuelven la ID como string, la convertimos a número (o null)
                value = value === '' ? null : Number(value);
              }

              data[field.id] = value;
            }
          });

          if (!isValid) return false;
          return data;
        }
      });

      // --- PASO 3 & 4: Guardar y Refrescar ---
      if (formValues) {
        Swal.fire({
          title: 'Guardando...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false
        });

        const saveResponse = await fetch(itemUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // tokens de autenticación 
          },
          body: JSON.stringify(formValues),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          const errorMessage = errorData.detail || JSON.stringify(errorData);
          throw new Error(errorMessage);
        }

        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: `El registro #${itemId} se ha actualizado correctamente.`,
        });

        if (onActionSuccess) {
          onActionSuccess();
        }
      }

    } catch (error) {
      console.error('Error en la edición:', error);
      Swal.fire({
        icon: 'error',
        title: 'Operación Fallida',
        text: `Hubo un error al procesar la edición: ${error.message}`,
      });
    }
  };

  return (
    <button
      className="btn btn-warning btn-sm"
      onClick={handleEdit}
      title="Editar"
    >
      <FaEdit />
    </button>
  );
}