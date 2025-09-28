import { formConfigs } from "../../config/formConfigs";
import { registerData } from "../../services/apiService";
import { apiCall } from "../../services/apiCutoms";

import Swal from "sweetalert2";

const handleAction = async (opt) => {
    const formConfig = formConfigs[opt.key];

    // --- 1. Generación del HTML del Formulario ---
    const formHtml = formConfig.fields.map((field) => {
        const inputId = `swal-input-${field.id}`;
        // Asumimos que todos los campos son requeridos a menos que se defina explícitamente required: false
        const isRequired = field.required !== false;
        const requiredAsterisk = isRequired && field.type !== "hidden" ? '<span class="required">*</span>' : '';
        const placeholderText = field.placeholder.toLowerCase();
        
        // Determinar si es un campo de activo
        const isLoanItem = field.id === 'tecnologia_id' || field.id === 'material_didactico_id';

        if (field.type === "hidden") {
            return `<input id="${inputId}" type="hidden" value="${field.defaultValue || ""}" />`;
        }

        if (field.type === "select") {
            return `
                <div class="form-group">
                    <label for="${inputId}" class="form-label">
                        ${field.placeholder}
                        ${requiredAsterisk}
                    </label>
                    <div style="position: relative;">
                        <select 
                            id="${inputId}"
                            class="form-input swal2-input"
                            data-is-loan-item="${isLoanItem}"
                            data-is-required="${isRequired}"
                            ${isLoanItem ? 'disabled' : ''} >
                            <option value="" disabled selected>Seleccione ${placeholderText}</option>
                        </select>
                        <div class="success-icon">✓</div>
                    </div>
                    <div id="error-${field.id}" class="error-message"></div>
                </div>
            `;
        }

        return `
            <div class="form-group">
                <label for="${inputId}" class="form-label">
                    ${field.placeholder}
                    ${requiredAsterisk}
                </label>
                <div style="position: relative;">
                    <input 
                        id="${inputId}"
                        class="form-input swal2-input"
                        placeholder="Ingresa ${placeholderText}"
                        type="${field.type}"
                        ${field.readOnly ? "readonly" : ""}
                        value="${field.defaultValue || ""}"
                        data-is-required="${isRequired}"
                        autocomplete="off"
                    />
                    <div class="success-icon">✓</div>
                </div>
                <div id="error-${field.id}" class="error-message"></div>
            </div>
        `;
    }).join('');

    // --- 2. Mostrar SweetAlert y Ejecutar Lógica ---
    const { value: formValues } = await Swal.fire({
        title: formConfig.title,
        html: `<div class="improved-form-container">${formHtml}</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        width: '500px',
        
        // Lógica de Validación Final (PreConfirm)
        preConfirm: () => {
            const values = {};
            let isValid = true;
            
            formConfig.fields.forEach(field => {
                const input = document.getElementById(`swal-input-${field.id}`);
                const errorElement = document.getElementById(`error-${field.id}`);
                
                // Si es un campo oculto, simplemente asignar el valor por defecto o cadena vacía.
                if (field.type === "hidden") {
                    values[field.id] = field.defaultValue || "";
                    return;
                }

                if (input) {
                    // **INICIO: Lógica para enviar 'null' en campos deshabilitados**
                    if (input.hasAttribute('disabled')) {
                        // Si el campo está deshabilitado (el activo que no se seleccionó)
                        // lo enviamos como NULL para que el serializer lo acepte.
                        values[field.id] = null;
                        return; // Pasar al siguiente campo
                    }
                    // **FIN: Lógica para enviar 'null' en campos deshabilitados**

                    // Si no está deshabilitado, tomar el valor normal
                    values[field.id] = input.value;
                } else {
                    // Si el input no existe, se asume vacío (esto es más una medida de seguridad)
                    values[field.id] = "";
                }

                input.classList.remove('error', 'valid');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                
                // --- Validaciones de Campos Requeridos (General) ---
                const isRequired = field.required !== false;
                
                // Los campos de activo en préstamos no se validan como "requeridos" aquí,
                // ya que la lógica de préstamo requiere *uno* de los dos, no ambos.
                const isLoanActiveField = field.id === 'tecnologia_id' || field.id === 'material_didactico_id';
                const shouldValidateRequired = isRequired && !isLoanActiveField;

                if (shouldValidateRequired && (!values[field.id] || values[field.id].trim() === '')) {
                    errorElement.textContent = 'Este campo es requerido';
                    errorElement.classList.add('show');
                    input.classList.add('error');
                    isValid = false;
                } 
                
                // --- Validaciones Específicas de Formato (si hay valor) ---
                else if (values[field.id] && values[field.id].trim() !== '') {
                    let fieldValid = true;

                    if (field.type === 'number' && isNaN(values[field.id])) {
                        errorElement.textContent = 'Debe ser un número válido';
                        fieldValid = false;
                    } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(values[field.id])) {
                        errorElement.textContent = 'Ingrese un correo electrónico válido';
                        fieldValid = false;
                    } else if (field.type === "text" && values[field.id].length < 3) {
                        errorElement.textContent = 'El campo debe tener al menos 3 caracteres';
                        fieldValid = false;
                    } else if (field.type === "text" && !/^[a-zA-Z0-9\s.,ñÑ]+$/.test(values[field.id])) {
                        errorElement.textContent = 'El campo contiene caracteres especiales no permitidos';
                        fieldValid = false;
                    }

                    if (!fieldValid) {
                        errorElement.classList.add('show');
                        input.classList.add('error');
                        isValid = false;
                    } else {
                        input.classList.add('valid');
                    }
                }
            });
            
            // --- Validaciones específicas de Préstamos (Elemento Obligatorio y Único) ---
            if (opt.key === 'prestamos') {
                // Aquí debemos usar los valores finales, incluyendo el posible 'null'
                const tecnologiaId = values['tecnologia_id'];
                const materialId = values['material_didactico_id'];

                // VALIDACIÓN: Se requiere al menos UN elemento (Tecnología O Material)
                if (!tecnologiaId && !materialId) {
                    isValid = false;
                    const msg = 'Debe seleccionar una Tecnología o un Material Didáctico.';
                    
                    // Mostrar error en los campos de activo que NO estén deshabilitados (si aplica)
                    const tecInput = document.getElementById(`swal-input-tecnologia_id`);
                    const matInput = document.getElementById(`swal-input-material_didactico_id`);

                    if (tecInput && !tecInput.hasAttribute('disabled')) {
                       document.getElementById(`error-tecnologia_id`).textContent = msg;
                       document.getElementById(`error-tecnologia_id`).classList.add('show');
                       tecInput.classList.add('error');
                    }
                    if (matInput && !matInput.hasAttribute('disabled')) {
                       document.getElementById(`error-material_didactico_id`).textContent = msg;
                       document.getElementById(`error-material_didactico_id`).classList.add('show');
                       matInput.classList.add('error');
                    }
                }
                
                // NOTA: La validación de que NO se pueden tener AMBOS campos (tecnologiaId && materialId)
                // la estás manejando correctamente en la función `handleAssetExclusion` al deshabilitar
                // el otro campo, y también la tienes en el `PrestamoSerializer.validate()`.
            }

            // --- Lógica de Username Autogenerado (Solo si aplica) ---
            if (formConfig.fields.some(f => f.id === "username")) {
                const firstName = values.first_name ? values.first_name.split(" ")[0] : "";
                const lastName = values.last_name ? values.last_name.split(" ")[0] : "";
                const username = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
                values.username = username;
                
                const usernameInput = document.getElementById("swal-input-username");
                if (usernameInput) usernameInput.value = username;
            }
            
            if (!isValid) {
                const firstError = document.querySelector('.error-message.show');
                if (firstError) {
                    firstError.closest('.form-group').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
                return false;
            }
            
            return values;
        },

        // Lógica de carga de opciones, Dependencia y Exclusión Mutua (didOpen)
        didOpen: async () => {
            
            // 3.1 Cargar opciones dinámicas para selects
            for (const field of formConfig.fields) {
                const input = document.getElementById(`swal-input-${field.id}`);

                if (field.type === 'select' && field.options?.endpoint && input) {
                    try {
                        const endpoint = field.options.endpoint;
                        let data;
                        Swal.showLoading();

                        // Lógica de llamada API
                        if (/^https?:\/\//.test(endpoint)) {
                            const token = localStorage.getItem('accessToken');
                            const url = endpoint.endsWith('/') ? endpoint : endpoint + '/';
                            const res = await fetch(url, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                            const json = await res.json();
                            data = Array.isArray(json) ? json : (json.results || json.data || []);
                        } else {
                            const json = await apiCall(endpoint);
                            data = Array.isArray(json) ? json : (json.results || json.data || []);
                        }
                        
                        Swal.hideLoading();

                        if (Array.isArray(data)) {
                            data.forEach(item => {
                                const opt = document.createElement('option');
                                opt.value = item[field.options.valueKey];
                                
                                if (Array.isArray(field.options.textKey)) {
                                    opt.textContent = field.options.textKey.map(key => item[key]).join(' ');
                                } else {
                                    opt.textContent = item[field.options.textKey];
                                }
                                
                                input.appendChild(opt);
                            });
                        }
                    } catch (e) {
                        console.error('Error cargando opciones del select', field.id, e);
                        Swal.hideLoading();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudieron cargar los datos necesarios. Intente de nuevo.',
                        });
                    }
                }

                // --- 3.2 Establecer Listeners de Validación ---
                if (field.type === "hidden") continue;

                if (input) {
                    const errorElement = document.getElementById(`error-${field.id}`);
                    const handler = (e) => {
                        e.target.classList.remove('error', 'valid');
                        const value = e.target.value;

                        // Solo manejar la validación si no está deshabilitado
                        if (!e.target.hasAttribute('disabled')) {
                            // (Lógica de validación de campos vacíos y formato)
                            if (value.trim() === '') {
                                errorElement.textContent = 'Este campo es requerido';
                                errorElement.classList.add('show');
                                e.target.classList.add('error');
                            } else {
                                errorElement.textContent = '';
                                errorElement.classList.remove('show');
                                e.target.classList.add('valid');

                                // Validaciones de formato...
                                const isNumber = field.type === 'number' && isNaN(value);
                                const isEmail = field.type === 'email' && !/\S+@\S+\.\S+/.test(value);
                                const isShortText = field.type === "text" && value.length < 3;
                                const isSpecialChar = field.type === "text" && !/^[a-zA-Z0-9\s.,ñÑ]+$/.test(value);

                                if (isNumber) {
                                    errorElement.textContent = 'Debe ser un número válido';
                                    e.target.classList.remove('valid'); e.target.classList.add('error');
                                } else if (isEmail) {
                                    errorElement.textContent = 'Ingrese un correo electrónico válido';
                                    e.target.classList.remove('valid'); e.target.classList.add('error');
                                } else if (isShortText) {
                                    errorElement.textContent = 'El campo debe tener al menos 3 caracteres';
                                    e.target.classList.remove('valid'); e.target.classList.add('error');
                                } else if (isSpecialChar) {
                                    errorElement.textContent = 'El campo no debe contener caracteres especiales';
                                    e.target.classList.remove('valid'); e.target.classList.add('error');
                                }

                                if (isNumber || isEmail || isShortText || isSpecialChar) {
                                    errorElement.classList.add('show');
                                }
                            }
                        }
                    };

                    if (field.type === 'select') {
                        input.addEventListener('change', handler);
                    } else {
                        input.addEventListener('input', handler);
                        input.addEventListener('blur', (e) => {
                            if (e.target.value.trim() !== '' && !e.target.classList.contains('error')) {
                                e.target.classList.add('valid');
                            }
                        });
                    }
                }
            }

            // --- 3.3 Lógica de Dependencia y Exclusión Mutua para Préstamos (Key: 'prestamos') ---
            if (opt.key === 'prestamos') {
                const solicitanteInput = document.getElementById('swal-input-solicitante_id');
                const tecnologiaInput = document.getElementById('swal-input-tecnologia_id');
                const materialDidacticoInput = document.getElementById('swal-input-material_didactico_id');
                
                if (solicitanteInput && tecnologiaInput && materialDidacticoInput) {

                    // FUNCIÓN DE ACTIVACIÓN (Dependencia del Solicitante)
                    const toggleActiveFields = (solicitanteId) => {
                        const shouldBeEnabled = !!solicitanteId;
                        
                        if (shouldBeEnabled) {
                            tecnologiaInput.removeAttribute('disabled');
                            materialDidacticoInput.removeAttribute('disabled');
                            
                            // Aplicar exclusión al habilitar (si ya hay un valor seleccionado)
                            if (tecnologiaInput.value) {
                                materialDidacticoInput.setAttribute('disabled', 'disabled');
                            } else if (materialDidacticoInput.value) {
                                tecnologiaInput.setAttribute('disabled', 'disabled');
                            }
                        } else {
                            // Limpiar y deshabilitar si no hay solicitante
                            tecnologiaInput.setAttribute('disabled', 'disabled');
                            tecnologiaInput.value = '';
                            materialDidacticoInput.setAttribute('disabled', 'disabled');
                            materialDidacticoInput.value = '';
                        }
                    };
                    
                    // FUNCIÓN DE EXCLUSIÓN MUTUA (Al seleccionar un activo)
                    const handleAssetExclusion = (changedInput, otherInput) => {
                        if (changedInput.value) {
                            // Si el campo modificado TIENE valor, DESHABILITAR y limpiar el otro.
                            otherInput.value = '';
                            otherInput.setAttribute('disabled', 'disabled');
                            // Limpiar el error si existía en el campo deshabilitado
                            document.getElementById(`error-${otherInput.id}`).textContent = ''; 
                            otherInput.classList.remove('error');

                        } else if (solicitanteInput.value) {
                            // Si el campo modificado SE VACIÓ, y hay solicitante, RE-HABILITAR el otro.
                            otherInput.removeAttribute('disabled');
                        }
                    };

                    // Listeners de Dependencia (al seleccionar el usuario)
                    // Nota: Se debe usar una función que se pueda remover
                    const solicitanteChangeHandler = (e) => toggleActiveFields(e.target.value);
                    solicitanteInput.addEventListener('change', solicitanteChangeHandler);

                    // Listeners de Exclusión Mutua (al seleccionar un activo)
                    const tecnologiaChangeHandler = (e) => handleAssetExclusion(e.target, materialDidacticoInput);
                    const materialChangeHandler = (e) => handleAssetExclusion(e.target, tecnologiaInput);
                    
                    tecnologiaInput.addEventListener('change', tecnologiaChangeHandler);
                    materialDidacticoInput.addEventListener('change', materialChangeHandler);

                    // Inicializar el estado de los campos de activo al abrir el modal
                    toggleActiveFields(solicitanteInput.value);

                    // Limpiar listeners al cerrar el modal (prevención de fugas de memoria)
                    Swal.getPopup().addEventListener('close', () => {
                        solicitanteInput.removeEventListener('change', solicitanteChangeHandler);
                        tecnologiaInput.removeEventListener('change', tecnologiaChangeHandler);
                        materialDidacticoInput.removeEventListener('change', materialChangeHandler);
                    });
                }
            }
        }
    });
    console.log(formValues);
    // --- 4. Envío del Formulario (Si la validación fue exitosa) ---
    if (formValues) {
        // Limpiar valores vacíos antes de enviar
        const dataToSend = Object.fromEntries(
            Object.entries(formValues)
            // **IMPORTANTE:** Mantenemos 'null' pero eliminamos las cadenas vacías ("")
            .filter(([_, v]) => v !== "") 
        );
        
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await registerData(opt.key, dataToSend);
            Swal.fire({
                icon: 'success',
                title: '¡Éxito! ',
                text: 'El registro fue creado correctamente.',
                confirmButtonText: 'Aceptar'
            });
            
            // Si existe un callback para actualizar la tabla, ejecutarlo
            if (opt.onSuccess) {
                opt.onSuccess();
            }

        } catch (error) {
            console.error("Error al registrar data:", error.response || error);
            
            let errorText = 'No se pudo crear el registro. Por favor, intente de nuevo.';
            if (error.response?.data) {
                const backendErrors = error.response.data;
                
                if (backendErrors.non_field_errors) {
                    errorText = backendErrors.non_field_errors.join(' ');
                } else if (typeof backendErrors === 'object') {
                    // Mapear errores de campo del backend a un formato legible
                    errorText = Object.entries(backendErrors)
                        .map(([key, messages]) => `${key.replace(/_id/g, '').replace(/_/g, ' ')}: ${messages.join(' ')}`)
                        .join('; ');
                }
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorText,
                confirmButtonText: 'Aceptar'
            });
        }
    }
};

export default handleAction;