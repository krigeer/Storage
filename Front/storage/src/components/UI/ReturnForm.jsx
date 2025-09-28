import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaUndo } from 'react-icons/fa';
import { apiCall } from '../../services/apiCutoms';
import { patchData } from '../../services/apiService'; 

const ReturnForm = ({ onSuccess }) => {
    const [activeLoans, setActiveLoans] = useState([]);
    
    // Función para buscar los préstamos del usuario por documento
    const handleSearch = async (documento) => {
        // Limpieza de documento antes de la búsqueda 
        const documentoLimpio = String(documento).trim().replace(/[^0-9]/g, '');

        if (!documentoLimpio) {
            Swal.fire('Atención', 'Por favor, ingrese el número de documento.', 'warning');
            return;
        }

        try {
            Swal.fire({
                title: 'Buscando Préstamos...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            // RUTA 
            const endpoint = `prestamos/activos/?documento=${documentoLimpio}`;
            
            const response = await apiCall(endpoint);
            
            Swal.close();
            
            if (response.length === 0) {
                Swal.fire('Información', `No se encontraron préstamos activos para el documento ${documentoLimpio}.`, 'info');
                setActiveLoans([]);
            } else {
                setActiveLoans(response);
                const solicitanteNombre = response[0].solicitante || 'Usuario';
                Swal.fire('Éxito', `${solicitanteNombre}: Se encontraron ${response.length} préstamos activos.`, 'success');
            }
        } catch (error) {
            console.error("Error al buscar préstamos:", error);
            // Mostrar mensaje de error del backend
            const errorText = error.response?.data?.detail || 'Hubo un error al buscar los préstamos. Verifique el documento y la conexión.';
            Swal.fire('Error', errorText, 'error');
            setActiveLoans([]);
        }
    };
    
    // Función para manejar la devolución de un ítem
    const handleReturn = async (loanId, assetName, assetType) => {
        const result = await Swal.fire({
            title: 'Confirmar Devolución',
            text: `¿Desea confirmar la devolución de ${assetType}: ${assetName}? Esta acción actualizará la ubicación del activo y finalizará el préstamo.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, devolver',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Procesando Devolución...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });

                // RUTA  /prestamos/{loanId}/devolver
                const endpoint = `prestamos/${loanId}/devolver`;
                
               
                await patchData(endpoint, {}); 

                Swal.fire('¡Devolución Exitosa! ', `${assetType}: ${assetName} ha regresado a Bodega.`, 'success');
                
                // Actualizar la lista después de la devolución 
                setActiveLoans(prev => prev.filter(loan => loan.id !== parseInt(loanId)));
                
                if (onSuccess) onSuccess();
                
            } catch (error) {
                console.error("Error al procesar la devolución:", error);
                // Extraer el mensaje de error del API service 
                let errorText = error.message || 'No se pudo procesar la devolución. Intente nuevamente.';
                Swal.fire('Error', errorText, 'error');
            }
        }
    };

    // Lógica para abrir el modal inicial de búsqueda
    const openSearchModal = async () => {
        if (activeLoans.length > 0) {
            Swal.close();
        }

        const { value: documento } = await Swal.fire({
            title: 'Buscar Préstamos Activos',
            input: 'text',
            inputLabel: 'Documento del Usuario Solicitante',
            inputPlaceholder: 'Ingrese el número de documento',
            showCancelButton: true,
            confirmButtonText: 'Buscar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                const documentoLimpio = String(value).trim().replace(/[^0-9]/g, '');
                if (!documentoLimpio) return '¡Necesita ingresar un documento!';
            }
        });

        if (documento) {
            await handleSearch(documento);
        }
    };

    // HTML para mostrar la lista de préstamos y el botón de devolución
    const loansHtml = activeLoans.map(loan => {
        const assetName = loan.tecnologia || loan.material_didactico || 'Elemento Desconocido';
        const assetType = loan.tecnologia ? 'Tecnología' : (loan.material_didactico ? 'Material Didáctico' : 'Activo');
        
        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                    <strong>${assetType}:</strong> ${assetName} <br/>
                    <small class="text-muted">Préstamo ID: ${loan.id}</small>
                </span>
                <button 
                    id="return-btn-${loan.id}" 
                    data-loan-id="${loan.id}"
                    data-asset-name="${assetName}"
                    data-asset-type="${assetType}"
                    class="btn btn-danger btn-sm return-button">
                    <i class="fa fa-undo"></i> Devolver
                </button>
            </li>
        `;
    }).join('');

    
    if (activeLoans.length > 0) {
        Swal.fire({
            title: 'Préstamos Activos Encontrados',
            html: `
                <p>Usuario: <strong>${activeLoans[0].solicitante || 'N/A'}</strong></p>
                <ul class="list-group" style="text-align: left; max-height: 300px; overflow-y: auto;">
                    ${loansHtml}
                </ul>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: { popup: 'swal2-responsive' },
            didOpen: () => {
                document.querySelectorAll('.return-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const loanId = e.currentTarget.dataset.loanId;
                        const assetName = e.currentTarget.dataset.assetName;
                        const assetType = e.currentTarget.dataset.assetType;
                        Swal.close();
                        handleReturn(loanId, assetName, assetType);
                    });
                });
            }
        });
    }

    // Botón principal para iniciar el proceso de devolución
    return (
        <button 
            className="btn btn-danger btn-sm" 
            onClick={openSearchModal}
            title="Procesar Devolución"
        >
            <FaUndo /> Devolución
        </button>
    );
};

export default ReturnForm;