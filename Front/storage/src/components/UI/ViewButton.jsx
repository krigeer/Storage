import React from 'react';
import { FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../config/data';

// ======================================================================
// FORMATO DE TÍTULOS Y VALORES
// ======================================================================

/**
 * título legible
 * @param {string} key 
 * @returns {string} 
 */
const formatKeyAsTitle = (key) => {
    return key
        .replace(/_/g, ' ') 
        .replace(/\b\w/g, c => c.toUpperCase()); 
};

/**
 * Obtiene el valor formateado para mostrar
 * @param {*} value 
 * @returns {string} 
 */
const getDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return '<span class="modern-empty-value">No Disponible</span>';
    }

    if (typeof value === 'boolean') {
        return value 
            ? '<span class="modern-badge modern-badge-success">✓ Sí</span>' 
            : '<span class="modern-badge modern-badge-danger">✗ No</span>';
    }

    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        const jsonString = JSON.stringify(value, null, 2);
        return `<pre class="modern-json-block">${jsonString}</pre>`;
    }

    return `<span class="modern-value-text">${value.toString()}</span>`;
};

/**
 * Formatea los datos del objeto para mostrar en el modal
 * @param {object} data 
 * @returns {string} 
 */
const formatDataForSwal = (data) => {
    const relatedKeys = new Set();
    const keysToIgnore = new Set();
    
    for (const key of Object.keys(data)) {
        if (key.endsWith('_id')) {
            const relatedName = key.slice(0, -3);
            if (data.hasOwnProperty(relatedName)) {
                keysToIgnore.add(key); 
                relatedKeys.add(relatedName);
            }
        }
    }

    // Ordenar claves: primero las relacionadas, luego el resto
    const sortedKeys = Object.keys(data)
        .filter(key => !keysToIgnore.has(key))
        .sort((a, b) => {
            const isArelated = relatedKeys.has(a);
            const isBrelated = relatedKeys.has(b);
            if (isArelated && !isBrelated) return -1;
            if (!isArelated && isBrelated) return 1;
            return a.localeCompare(b);
        });

    // CSS 
    const styles = `
        <style>
            .modern-view-container {
                max-height: 65vh;
                overflow-y: auto;
                overflow-x: hidden;
                text-align: left;
                padding: 1rem;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 12px;
            }

            


            .modern-data-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
            }

            .modern-data-row {
                background: white;
                border-radius: 8px;
                margin-bottom: 0.75rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                animation: slideIn 0.4s ease-out;
                animation-fill-mode: both;
            }

            .modern-data-row:hover {
                box-shadow: 0 4px 16px rgba(13, 110, 253, 0.15);
                transform: translateX(4px);
            }

            .modern-data-row:nth-child(1) { animation-delay: 0.05s; }
            .modern-data-row:nth-child(2) { animation-delay: 0.1s; }
            .modern-data-row:nth-child(3) { animation-delay: 0.15s; }
            .modern-data-row:nth-child(4) { animation-delay: 0.2s; }
            .modern-data-row:nth-child(5) { animation-delay: 0.25s; }
            .modern-data-row:nth-child(n+6) { animation-delay: 0.3s; }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .modern-key-cell {
                font-weight: 600;
                font-size: 0.9rem;
                color: #2c3e50;
                width: 35%;
                padding: 1rem;
                vertical-align: top;
                border-right: 3px solid #176802ff;
                border-radius: 8px 0 0 8px;
                background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
            }

            .modern-key-cell::before {
                content: '▸';
                color: #fd0d0dff;
                margin-right: 0.5rem;
                font-weight: bold;
            }

            .modern-value-cell {
                width: 65%;
                padding: 1rem;
                word-break: break-word;
                border-radius: 0 8px 8px 0;
                background: white;
            }

            .modern-empty-value {
                color: #000000ff;
                font-style: italic;
                font-size: 0.9rem;
            }

            .modern-badge {
                display: inline-block;
                padding: 0.35rem 0.75rem;
                border-radius: 6px;
                font-weight: 600;
                font-size: 0.85rem;
                letter-spacing: 0.3px;
            }

            .modern-badge-success {
                background:  #1a752fff;
                color: white;
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
            }

            .modern-badge-danger {
                background: linear-gradient(135deg, #dc3545, #fd7e14);
                color: white;
                box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
            }

            .modern-json-block {
                background: #2d3748;
                color: #48bb78;
                padding: 1rem;
                border-radius: 8px;
                font-size: 0.85rem;
                white-space: pre-wrap;
                word-break: break-all;
                margin: 0;
                border-left: 4px solid #0d6efd;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
                font-family: 'Courier New', monospace;
            }

            .modern-value-text {
                color: #495057;
                font-size: 0.95rem;
                line-height: 1.6;
            }

            @media (max-width: 768px) {
                .modern-view-container {
                    padding: 0.75rem;
                    max-height: 70vh;
                }

                .modern-data-row {
                    display: block;
                    margin-bottom: 1rem;
                }

                .modern-key-cell,
                .modern-value-cell {
                    display: block;
                    width: 100% !important;
                    border-radius: 0;
                    border-right: none;
                    padding: 0.75rem;
                }

                .modern-key-cell {
                    border-radius: 8px 8px 0 0;
                    border-bottom: 2px solid #022505ff;
                    background:  #155c07ff;
                    color: white;
                }

                .modern-key-cell::before {
                    color: white;
                }

                .modern-value-cell {
                    border-radius: 0 0 8px 8px;
                }

                .modern-json-block {
                    font-size: 0.75rem;
                    padding: 0.75rem;
                }
            }

            @media (max-width: 480px) {
                .modern-key-cell,
                .modern-value-cell {
                    padding: 0.6rem;
                    font-size: 0.85rem;
                }
            }
        </style>
    `;

    let htmlContent = styles + '<div class="modern-view-container"><table class="modern-data-table"><tbody>';
    
    sortedKeys.forEach((key, index) => {
        const title = formatKeyAsTitle(key);
        const value = data[key];
        const displayValue = getDisplayValue(value);

        htmlContent += `
            <tr class="modern-data-row" style="animation-delay: ${index * 0.05}s;">
                <td class="modern-key-cell">${title}</td>
                <td class="modern-value-cell">${displayValue}</td>
            </tr>
        `;
    });
    
    htmlContent += '</tbody></table></div>';
    return htmlContent;
};

// ======================================================================
//  SWEETALERT2
// ======================================================================
const injectCustomStyles = () => {
    const styleId = 'swal2-view-custom-styles';
    if (document.getElementById(styleId)) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
        .swal2-view-popup {
            border-radius: 16px !important;
            padding: 0 !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
            max-width: 800px !important;
            width: 90% !important;
        }

        .swal2-view-header {
            padding: 2rem 2rem 1rem !important;
            background:  #4bdf26ff 0% !important;
            border-radius: 16px 16px 0 0 !important;
            border-bottom: none !important;
        }

        .swal2-view-title {
            color: black !important;
            font-size: 1.75rem !important;
            font-weight: 700 !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 0 !important;
        }

        .swal2-view-content {
            padding: 0 !important;
            margin: 0 !important;
        }

        .swal2-view-actions {
            padding: 1.5rem 2rem !important;
            background-color: #f8f9fa;
            border-radius: 0 0 16px 16px !important;
        }

        .swal2-view-confirm {
            background:  #1d8d07ff 0%!important;
            border: none !important;
            border-radius: 8px !important;
            padding: 0.75rem 2rem !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3) !important;
            transition: all 0.3s ease !important;
        }

        .swal2-view-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4) !important;
        }

        .swal2-view-close {
            color: white !important;
            font-size: 1.5rem !important;
            transition: all 0.3s ease !important;
        }

        .swal2-view-close:hover {
            color: #fff !important;
            transform: rotate(90deg) scale(1.1) !important;
        }

        @media (max-width: 768px) {
            .swal2-view-popup {
                width: 95% !important;
                max-width: 100% !important;
            }

            .swal2-view-title {
                font-size: 1.4rem !important;
            }

            .swal2-view-header {
                padding: 1.5rem 1.5rem 1rem !important;
            }

            .swal2-view-actions {
                padding: 1rem 1.5rem !important;
            }

            .swal2-view-confirm {
                width: 100% !important;
                padding: 0.65rem 1.5rem !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
};

// ======================================================================
// COMPONENTE PRINCIPAL (ViewButton)
// ======================================================================
/**
 * @param {object} props
 * @param {string} props.endpoint - Endpoint de la API
 * @param {number|string} props.itemId - ID del elemento a visualizar
 */
export default function ViewButton({ endpoint, itemId }) {
    React.useEffect(() => {
        injectCustomStyles();
    }, []);

    const handleView = async () => {
        try {
            const url = `${API_BASE_URL}${endpoint}/${itemId}/`;
            
            
            Swal.fire({
                title: '<div style="color: #0d6efd;">Cargando Detalles...</div>',
                html: '<div style="color: #6c757d;">Obteniendo información, por favor espere</div>',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            
            // Obtener datos de la API
            const token = localStorage.getItem('accessToken');
            const response = await fetch(url, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = response.status !== 404 
                    ? await response.json().catch(() => ({})) 
                    : {};
                throw new Error(
                    `Error ${response.status}: ${errorData.detail || response.statusText || 'Error desconocido del servidor'}`
                );
            }

            const itemData = await response.json();
            
            
            Swal.fire({
                title: `Detalles del Elemento `,
                html: formatDataForSwal(itemData),
                showConfirmButton: true,
                confirmButtonText: '✓ Cerrar',
                showCloseButton: true,
                customClass: {
                    popup: 'swal2-view-popup',
                    header: 'swal2-view-header',
                    title: 'swal2-view-title',
                    htmlContainer: 'swal2-view-content',
                    actions: 'swal2-view-actions',
                    confirmButton: 'swal2-view-confirm',
                    closeButton: 'swal2-view-close'
                }
            });
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: ' Error de Carga',
                text: `No se pudo obtener el detalle: ${error.message}`,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    return (
        <button 
            className="btn btn-primary btn-sm" 
            onClick={handleView}
            title="Ver Detalle"
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
            <FaEye />
        </button>
    );
}