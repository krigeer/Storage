import React from 'react';
import { FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../config/data';
import { formConfigs } from '../../config/formConfigs';

//  cargar opciones de Select ---
const fetchSelectOptions = async (endpoint, valueKey, textKey) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('accessToken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch(url, { headers: authHeader });

        if (!response.ok) {
            console.error(`Error al cargar opciones para ${endpoint}`, response);
            return [];
        }

        const data = await response.json();
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

//  HTML del formulario ---
const generateFormHTML = (fields, itemData, selectOptions) => {
    // Inyectar estilos CSS modernos
    const styles = `
        <style>
            .modern-form-container {
                max-height: 65vh;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 1.5rem;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffffff 100%);
                border-radius: 12px;
            }



            .modern-form-group {
                margin-bottom: 1.5rem;
                animation: fadeInUp 0.4s ease-out;
                animation-fill-mode: both;
            }

            .modern-form-group:nth-child(1) { animation-delay: 0.05s; }
            .modern-form-group:nth-child(2) { animation-delay: 0.1s; }
            .modern-form-group:nth-child(3) { animation-delay: 0.15s; }
            .modern-form-group:nth-child(4) { animation-delay: 0.2s; }
            .modern-form-group:nth-child(5) { animation-delay: 0.25s; }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .modern-label {
                display: block;
                font-weight: 600;
                font-size: 0.9rem;
                color: #2c3e50;
                margin-bottom: 0.5rem;
                text-transform: capitalize;
                letter-spacing: 0.3px;
            }

            .modern-label::before {
                content: '●';
                color: #28a745;
                margin-right: 0.5rem;
                font-size: 0.7rem;
            }

            .modern-input, .modern-select {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                background-color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            }

            .modern-input:focus, .modern-select:focus {
                outline: none;
                border-color: #28a745;
                box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.1),
                            0 4px 12px rgba(40, 167, 69, 0.15);
                transform: translateY(-2px);
            }

            .modern-input:hover, .modern-select:hover {
                border-color: #b0b0b0;
            }

            .modern-input[readonly] {
                background-color: #f8f9fa;
                cursor: not-allowed;
                color: #6c757d;
            }

            .modern-select {
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2328a745' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem center;
                padding-right: 2.5rem;
            }

            @media (max-width: 768px) {
                .modern-form-container {
                    padding: 1rem;
                    max-height: 70vh;
                }

                .modern-input, .modern-select {
                    padding: 0.65rem 0.85rem;
                    font-size: 0.9rem;
                }

                .modern-label {
                    font-size: 0.85rem;
                }

                .modern-form-group {
                    margin-bottom: 1.2rem;
                }
            }

            @media (max-width: 480px) {
                .modern-form-container {
                    padding: 0.75rem;
                }

                .modern-input, .modern-select {
                    padding: 0.6rem 0.75rem;
                }
            }
        </style>
    `;

    let htmlContent = styles + '<div class="modern-form-container">';

    fields.forEach((field, index) => {
        const fieldId = field.id;
        const currentValue = itemData[fieldId] || field.defaultValue || '';
        const labelText = field.placeholder || fieldId.replace(/_/g, ' ');

        htmlContent += `<div class="modern-form-group" style="animation-delay: ${index * 0.05}s;">`;

        if (field.type === 'hidden') {
            htmlContent += `<input type="hidden" id="swal-input-${fieldId}" value="${currentValue}">`;
        } else if (field.type === 'select') {
            const options = selectOptions[fieldId] || [];
            htmlContent += `
                <label for="swal-input-${fieldId}" class="modern-label">${labelText}</label>
                <select id="swal-input-${fieldId}" class="modern-select">
            `;
            options.forEach(option => {
                const isSelected = option.value === currentValue;
                htmlContent += `<option value="${option.value}" ${isSelected ? 'selected' : ''}>${option.text}</option>`;
            });
            htmlContent += `</select>`;
        } else {
            htmlContent += `
                <label for="swal-input-${fieldId}" class="modern-label">${labelText}</label>
                <input 
                    id="swal-input-${fieldId}" 
                    class="modern-input" 
                    type="${field.type}" 
                    value="${currentValue}" 
                    placeholder="Ingrese ${labelText.toLowerCase()}"
                    ${field.readOnly ? 'readonly' : ''}
                />
            `;
        }

        htmlContent += `</div>`;
    });

    htmlContent += '</div>';
    return htmlContent;
};

// CSS SweetAlert2 ---
const injectCustomStyles = () => {
    const styleId = 'swal2-custom-styles';
    if (document.getElementById(styleId)) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
        .swal2-modern-popup {
            border-radius: 16px !important;
            padding: 0 !important;
            box-shadow: 0 20px 60px rgba(248, 0, 0, 0.15) !important;
            max-width: 650px !important;
            width: 90% !important;
        }

        .swal2-modern-header {
            padding: 2rem 2rem 1rem !important;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-radius: 16px 16px 0 0 !important;
            border-bottom: none !important;
        }

        .swal2-modern-title {
            color: black !important;
            font-size: 1.75rem !important;
            font-weight: 700 !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 0 !important;
        }

        .swal2-modern-content {
            padding: 0 !important;
            margin: 0 !important;
        }

        .swal2-modern-actions {
            padding: 1.5rem 2rem !important;
            background-color: #f8f9fa;
            border-radius: 0 0 16px 16px !important;
            gap: 1rem !important;
        }

        .swal2-modern-confirm {
            background: #28a745 !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 0.75rem 2rem !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3) !important;
            transition: all 0.3s ease !important;
        }

        .swal2-modern-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4) !important;
        }

        .swal2-modern-cancel {
            background-color: #f00000ff !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 0.75rem 2rem !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            color: white !important;
            transition: all 0.3s ease !important;
        }

        .swal2-modern-cancel:hover {
            background-color: #000000ff !important;
            color: #ff0000ff !important;
            transform: translateY(-2px) !important;
        }

        @media (max-width: 768px) {
            .swal2-modern-popup {
                width: 95% !important;
                max-width: 100% !important;
            }

            .swal2-modern-title {
                font-size: 1.4rem !important;
            }

            .swal2-modern-header {
                padding: 1.5rem 1.5rem 1rem !important;
            }

            .swal2-modern-actions {
                padding: 1rem 1.5rem !important;
                flex-direction: column !important;
            }

            .swal2-modern-confirm,
            .swal2-modern-cancel {
                width: 100% !important;
                padding: 0.65rem 1.5rem !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
};

//Componente principal ---
export default function EditButton({ endpoint, itemId, onActionSuccess }) {
    React.useEffect(() => {
        injectCustomStyles();
    }, []);

    const handleEdit = async () => {
        const itemUrl = `${API_BASE_URL}${endpoint}/${itemId}/`;
        const token = localStorage.getItem('accessToken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const configKey = endpoint === 'usuarios' ? 'crear_usuarios' : endpoint;
        const config = formConfigs[configKey];

        if (!config) {
            return Swal.fire({
                icon: 'error',
                title: 'Error de Configuración',
                text: `No se encontró la configuración para: ${configKey}`,
                confirmButtonColor: '#dc3545'
            });
        }

        const selectFields = config.fields.filter(field => field.type === 'select');
        const selectPromises = selectFields.map(field =>
            fetchSelectOptions(field.options.endpoint, field.options.valueKey, field.options.textKey)
        );

        try {
            
            Swal.fire({
                title: '<div style="color: #28a745;">Cargando datos...</div>',
                html: '<div style="color: #6c757d;">Por favor espere un momento</div>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });

            const itemPromise = fetch(itemUrl, { headers: authHeader }).then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: No se pudo obtener el registro.`);
                return res.json();
            });

            const [itemData, ...optionsResults] = await Promise.all([itemPromise, ...selectPromises]);

            const selectOptions = {};
            selectFields.forEach((field, index) => {
                selectOptions[field.id] = optionsResults[index];
            });

            Swal.close();

            
            const { value: formValues } = await Swal.fire({
                title: `Editar ${config.title} #${itemId}`,
                html: generateFormHTML(config.fields, itemData, selectOptions),
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar ',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: 'swal2-modern-popup',
                    header: 'swal2-modern-header',
                    title: 'swal2-modern-title',
                    htmlContainer: 'swal2-modern-content',
                    actions: 'swal2-modern-actions',
                    confirmButton: 'swal2-modern-confirm',
                    cancelButton: 'swal2-modern-cancel'
                },
                preConfirm: () => {
                    const data = {};
                    let isValid = true;

                    config.fields.forEach(field => {
                        const inputElement = document.getElementById(`swal-input-${field.id}`);

                        if (inputElement) {
                            let value = inputElement.value;

                            if (field.type !== 'hidden' && value.trim() === '' && !field.readOnly) {
                                Swal.showValidationMessage(`⚠️ El campo ${field.placeholder || field.id} es obligatorio.`);
                                isValid = false;
                            }

                            if (field.type === 'number' || field.type === 'select') {
                                value = value === '' ? null : Number(value);
                            }

                            data[field.id] = value;
                        }
                    });

                    if (!isValid) return false;
                    return data;
                }
            });

            if (formValues) {
                Swal.fire({
                    title: '<div style="color: #28a745;">Guardando...</div>',
                    html: '<div style="color: #6c757d;">Actualizando información</div>',
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false,
                    showConfirmButton: false
                });

                const saveResponse = await fetch(itemUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        ...authHeader,
                    },
                    body: JSON.stringify(formValues),
                });

                if (!saveResponse.ok) {
                    const errorData = await saveResponse.json().catch(() => ({}));
                    const errorMessage = errorData.detail || errorData.non_field_errors || JSON.stringify(errorData) || 'Error desconocido al guardar.';
                    throw new Error(errorMessage);
                }

                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: `El registro #${itemId} se ha actualizado correctamente.`,
                    confirmButtonColor: '#28a745',
                    timer: 2000,
                    showConfirmButton: true
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
                text: error.message,
                confirmButtonColor: '#dc3545'
            });
        }
    };

    return (
        <button
            className="btn btn-warning btn-sm"
            onClick={handleEdit}
            title="Editar"
            style={{
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
        >
            <FaEdit />
        </button>
    );
}