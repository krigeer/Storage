import { formConfigs } from "../../config/formConfigs";
import { registerData } from "../../services/apiService";
import { apiCall } from "../../services/apiCutoms";

import Swal from "sweetalert2";
import { getUser } from "../../services/authContext.js"; // ajusta ruta si es necesario

/**
 * Muestra un formulario en un modal de SweetAlert2, maneja la validación,
 * la carga dinámica de opciones y la lógica de dependencia/exclusión mutua.
 * @param {object|string} opt Opciones de la acción (key, onSuccess, userId) o simplemente 'reportes'
 */
const handleAction = async (optRaw) => {
  // Aceptar string o { key, onSuccess, userId }
  const opt = typeof optRaw === "string" ? { key: optRaw } : (optRaw || {});
  const key = opt.key;
  if (!key) {
    console.error("handleAction: falta key en opt", optRaw);
    return;
  }

  const formConfig = formConfigs[key];
  if (!formConfig) {
    console.error(`handleAction: no existe formConfigs[${key}]`);
    Swal.fire({
      icon: "error",
      title: "Configuración no encontrada",
      text: `No se encontró la configuración para: ${key}`,
    });
    return;
  }

  // --- Resolvers dinámicos para defaultValueFn ---
  const dynamicValueResolvers = {
    // devuelve el id del usuario actual. Prioriza opt.userId si existe.
    currentUserId: async () => {
      if (opt.userId) return opt.userId;
      try {
        const maybeUser = await getUser(); // puede ser sync o async
        return maybeUser?.id ?? null;
      } catch (e) {
        console.warn("getUser() falló en defaultValueFn currentUserId", e);
        return null;
      }
    },
    // agrega aquí más resolvers si los necesitas
  };

  // --- 1. Generación asíncrona del HTML del Formulario (resolviendo defaultValueFn) ---
  const htmlParts = [];
  for (const field of formConfig.fields) {
    const inputId = `swal-input-${field.id}`;
    const isRequired = field.required !== false;
    const requiredAsterisk = isRequired && field.type !== "hidden" ? '<span class="required">*</span>' : '';
    const placeholderText = (field.placeholder || field.id).toLowerCase();

    // Resolver defaultValue y defaultValueFn (soportando string key o función)
    let resolvedDefault = field.defaultValue ?? "";
    if (field.defaultValueFn) {
      try {
        if (typeof field.defaultValueFn === "string") {
          const resolver = dynamicValueResolvers[field.defaultValueFn];
          if (resolver) {
            const rv = await resolver();
            resolvedDefault = rv !== undefined && rv !== null ? String(rv) : "";
          } else {
            console.warn(`No existe resolver para defaultValueFn=${field.defaultValueFn}`);
          }
        } else if (typeof field.defaultValueFn === "function") {
          const rv = await field.defaultValueFn(opt); // pasar opt por si la función lo necesita
          resolvedDefault = rv !== undefined && rv !== null ? String(rv) : "";
        }
      } catch (e) {
        console.warn("Error resolviendo defaultValueFn para", field.id, e);
        resolvedDefault = field.defaultValue ?? "";
      }
    }

    // Si opt.userId existe y campo es usuario, priorizarlo
    if ((field.id === "usuario" || field.id === "usuario_id") && opt.userId) {
      resolvedDefault = String(opt.userId);
    }

    // Renderizar hidden con valor resuelto
    if (field.type === "hidden") {
      htmlParts.push(`<input id="${inputId}" type="hidden" value="${resolvedDefault}" />`);
      continue;
    }

    // Selects: incluimos una opción inicial "selected" si resolvedDefault existe (para que preseleccione)
    if (field.type === "select") {
      const isLoanItem = field.id === 'tecnologia_id' || field.id === 'material_didactico_id';
      const disabledAttr = isLoanItem ? 'disabled' : '';
      // si resolvedDefault existe, la representamos como la primera opción oculta/seleccionada
      const initialOption = resolvedDefault ? `<option value="${resolvedDefault}" selected hidden>${resolvedDefault}</option>` : `<option value="" disabled selected>Seleccione ${placeholderText}</option>`;
      htmlParts.push(`
        <div class="form-group">
            <label for="${inputId}" class="form-label">
                ${field.placeholder || field.id}
                ${requiredAsterisk}
            </label>
            <div style="position: relative;">
                <select 
                    id="${inputId}"
                    class="form-input"
                    data-is-loan-item="${isLoanItem}"
                    data-is-required="${isRequired}"
                    ${disabledAttr} >
                    ${initialOption}
                </select>
                <div class="success-icon">✓</div>
            </div>
            <div id="error-${field.id}" class="error-message"></div>
        </div>
      `);
      continue;
    }

    // Inputs normales (text, number, email, etc.)
    // Soportar textarea (type === 'text' + field.rows) -- si quieres textarea largo, en formConfigs pon type:"textarea" o comprueba field.rows
    if (field.type === "textarea" || (field.type === "text" && field.rows)) {
      const rows = field.rows ?? 5;
      htmlParts.push(`
        <div class="form-group">
            <label for="${inputId}" class="form-label">
                ${field.placeholder || field.id}
                ${requiredAsterisk}
            </label>
            <div style="position: relative;">
                <textarea
                    id="${inputId}"
                    class="form-input swal2-textarea"
                    placeholder="Ingresa ${placeholderText}"
                    rows="${rows}"
                    ${field.readOnly ? "readonly" : ""}
                    data-is-required="${isRequired}"
                    autocomplete="off"
                >${resolvedDefault}</textarea>
                <div class="success-icon">✓</div>
            </div>
            <div id="error-${field.id}" class="error-message"></div>
        </div>
      `);
      continue;
    }

    // input simple
    htmlParts.push(`
      <div class="form-group">
          <label for="${inputId}" class="form-label">
              ${field.placeholder || field.id}
              ${requiredAsterisk}
          </label>
          <div style="position: relative;">
              <input 
                  id="${inputId}"
                  class="form-input swal2-input"
                  placeholder="Ingresa ${placeholderText}"
                  type="${field.type}"
                  ${field.readOnly ? "readonly" : ""}
                  value="${resolvedDefault}"
                  data-is-required="${isRequired}"
                  autocomplete="off"
              />
              <div class="success-icon">✓</div>
          </div>
          <div id="error-${field.id}" class="error-message"></div>
      </div>
    `);
  }

  const formHtml = htmlParts.join("");

  // --- 2. Mostrar SweetAlert y Ejecutar Lógica ---
  const { value: formValues } = await Swal.fire({
    title: formConfig.title,
    html: `<div class="improved-form-container">${formHtml}</div>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    width: 'auto',
    customClass: {
      popup: 'responsive-swal-popup',
      title: 'swal-title-custom',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
    },

    preConfirm: () => {
      const values = {};
      let isValid = true;

      formConfig.fields.forEach(field => {
        const input = document.getElementById(`swal-input-${field.id}`);
        const errorElement = document.getElementById(`error-${field.id}`);

        // Campo hidden: tomar su value si existe
        if (field.type === "hidden") {
          values[field.id] = input ? input.value : (field.defaultValue || "");
          return;
        }

        if (input) {
          // manejar textarea vs input: ambos tienen .value
          if (input.hasAttribute('disabled')) {
            values[field.id] = null;
            return;
          }
          values[field.id] = input.value;
        } else {
          values[field.id] = "";
        }

        if (input) {
          input.classList.remove('error', 'valid');
        }
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.classList.remove('show');
        }

        const isRequired = field.required !== false;
        const isLoanActiveField = field.id === 'tecnologia_id' || field.id === 'material_didactico_id';
        const shouldValidateRequired = isRequired && !isLoanActiveField;

        if (shouldValidateRequired && (!values[field.id] || values[field.id].trim() === '')) {
          if (errorElement) { errorElement.textContent = 'Este campo es requerido'; errorElement.classList.add('show'); }
          if (input) input.classList.add('error');
          isValid = false;
        } else if (values[field.id] && values[field.id].trim() !== '') {
          let fieldValid = true;
          if (field.type === 'number' && isNaN(values[field.id])) {
            if (errorElement) errorElement.textContent = 'Debe ser un número válido';
            fieldValid = false;
          } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(values[field.id])) {
            if (errorElement) errorElement.textContent = 'Ingrese un correo electrónico válido';
            fieldValid = false;
          } else if ((field.type === "text" || field.type === "textarea") && values[field.id].length < 3) {
            if (errorElement) errorElement.textContent = 'El campo debe tener al menos 3 caracteres';
            fieldValid = false;
          } else if ((field.type === "text" || field.type === "textarea") && !/^[a-zA-Z0-9\s.,ñÑ]+$/.test(values[field.id])) {
            if (errorElement) errorElement.textContent = 'El campo contiene caracteres especiales no permitidos';
            fieldValid = false;
          }

          if (!fieldValid) {
            if (errorElement) errorElement.classList.add('show');
            if (input) input.classList.add('error');
            isValid = false;
          } else {
            if (input) input.classList.add('valid');
          }
        }
      });

      // Validaciones específicas de prestamos
      if (opt.key === 'prestamos') {
        const tecnologiaId = values['tecnologia_id'];
        const materialId = values['material_didactico_id'];

        if (!tecnologiaId && !materialId) {
          isValid = false;
          const msg = 'Debe seleccionar una Tecnología o un Material Didáctico.';
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
      }

      // Username autogenerado
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

    didOpen: async () => {
      // 3.1 Cargar opciones dinámicas para selects
      for (const field of formConfig.fields) {
        const input = document.getElementById(`swal-input-${field.id}`);

        if (field.type === 'select' && field.options?.endpoint && input) {
          try {
            const endpoint = field.options.endpoint;
            let data;
            Swal.showLoading();

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
              // Limpiar opciones excepto la inicial (si existía resolvedDefault)
              input.querySelectorAll('option:not([hidden])').forEach(o => o.remove());

              data.forEach(item => {
                const optEl = document.createElement('option');
                optEl.value = item[field.options.valueKey];
                if (Array.isArray(field.options.textKey)) {
                  optEl.textContent = field.options.textKey.map(key => item[key]).join(' ');
                } else {
                  optEl.textContent = item[field.options.textKey];
                }
                input.appendChild(optEl);
              });
            }
          } catch (e) {
            console.error('Error cargando opciones del select', field.id, e);
            Swal.hideLoading();
          }
        }

        // --- 3.2 Establecer Listeners de Validación ---
        if (field.type === "hidden") continue;

        if (input) {
          const errorElement = document.getElementById(`error-${field.id}`);
          const handler = (e) => {
            e.target.classList.remove('error', 'valid');
            const value = e.target.value;

            if (!e.target.hasAttribute('disabled')) {
              const isRequired = e.target.getAttribute('data-is-required') === 'true';
              if (isRequired && value.trim() === '') {
                errorElement.textContent = 'Este campo es requerido';
                errorElement.classList.add('show');
                e.target.classList.add('error');
              } else {
                errorElement.textContent = '';
                errorElement.classList.remove('show');

                const isNumber = field.type === 'number' && isNaN(value);
                const isEmail = field.type === 'email' && !/\S+@\S+\.\S+/.test(value);
                const isShortText = (field.type === "text" || field.type === "textarea") && value.length < 3;
                const isSpecialChar = (field.type === "text" || field.type === "textarea") && !/^[a-zA-Z0-9\s.,ñÑ]+$/.test(value);

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
                } else if (value.trim() !== '') {
                  e.target.classList.add('valid');
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
              handler(e);
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
          const toggleActiveFields = (solicitanteId) => {
            const shouldBeEnabled = !!solicitanteId;

            if (shouldBeEnabled) {
              tecnologiaInput.removeAttribute('disabled');
              materialDidacticoInput.removeAttribute('disabled');

              if (tecnologiaInput.value) {
                materialDidacticoInput.setAttribute('disabled', 'disabled');
              } else if (materialDidacticoInput.value) {
                tecnologiaInput.setAttribute('disabled', 'disabled');
              }
            } else {
              tecnologiaInput.setAttribute('disabled', 'disabled');
              tecnologiaInput.value = '';
              materialDidacticoInput.setAttribute('disabled', 'disabled');
              materialDidacticoInput.value = '';
            }

            [tecnologiaInput, materialDidacticoInput].forEach(input => {
              if (input.hasAttribute('disabled')) {
                input.classList.remove('error', 'valid');
                document.getElementById(`error-${input.id}`).textContent = '';
                document.getElementById(`error-${input.id}`).classList.remove('show');
              }
            });
          };

          const handleAssetExclusion = (changedInput, otherInput) => {
            if (changedInput.value) {
              otherInput.value = '';
              otherInput.classList.remove('error', 'valid');
              otherInput.setAttribute('disabled', 'disabled');
              document.getElementById(`error-${otherInput.id}`).textContent = '';
              document.getElementById(`error-${otherInput.id}`).classList.remove('show');
            } else if (solicitanteInput.value) {
              otherInput.removeAttribute('disabled');
            }
          };

          const solicitanteChangeHandler = (e) => toggleActiveFields(e.target.value);
          solicitanteInput.addEventListener('change', solicitanteChangeHandler);

          const tecnologiaChangeHandler = (e) => handleAssetExclusion(e.target, materialDidacticoInput);
          const materialChangeHandler = (e) => handleAssetExclusion(e.target, tecnologiaInput);

          tecnologiaInput.addEventListener('change', tecnologiaChangeHandler);
          materialDidacticoInput.addEventListener('change', materialChangeHandler);

          toggleActiveFields(solicitanteInput.value);

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
        // Mantenemos 'null' pero eliminamos las cadenas vacías ("")
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

      if (opt.onSuccess) {
        try { opt.onSuccess(); } catch (e) { console.warn("onSuccess falló", e); }
      }

    } catch (error) {
      console.error("Error al registrar data:", error.response || error);

      let errorText = 'No se pudo crear el registro. Por favor, intente de nuevo.';
      if (error.response?.data) {
        const backendErrors = error.response.data;

        if (backendErrors.non_field_errors) {
          errorText = backendErrors.non_field_errors.join(' ');
        } else if (typeof backendErrors === 'object') {
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
