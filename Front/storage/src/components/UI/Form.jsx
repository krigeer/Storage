import { formConfigs } from "../../config/formConfigs";
import { registerData } from "../../services/apiService";
import { apiCall } from "../../services/apiCutoms";

import Swal from "sweetalert2";

const handleAction = async (opt) => {
  const formConfig = formConfigs[opt.key];

  const formHtml = formConfig.fields.map((field) => {
    const inputId = `swal-input-${field.id}`;

    // 👇 Campo oculto
    if (field.type === "hidden") {
      return `<input id="${inputId}" type="hidden" value="${field.defaultValue || ""}" />`;
    }

    if (field.type === "select") {
      return `
        <div class="form-group">
          <label for="${inputId}" class="form-label">
            ${field.placeholder}
            <span class="required">*</span>
          </label>
          <div style="position: relative;">
            <select 
              id="${inputId}"
              class="form-input swal2-input"
              required
            >
              <option value="" disabled selected>Seleccione ${field.placeholder.toLowerCase()}</option>
            </select>
            <div class="success-icon">✓</div>
          </div>
          <div id="error-${field.id}" class="error-message"></div>
        </div>
      `;
    }

    // 👇 Inputs normales
    return `
      <div class="form-group">
        <label for="${inputId}" class="form-label">
          ${field.placeholder}
          <span class="required">*</span>
        </label>
        <div style="position: relative;">
          <input 
            id="${inputId}"
            class="form-input swal2-input"
            placeholder="Ingresa ${field.placeholder.toLowerCase()}"
            type="${field.type}"
            ${field.readOnly ? "readonly" : ""}
            value="${field.defaultValue || ""}"
            required
            autocomplete="off"
          />
          <div class="success-icon">✓</div>
        </div>
        <div id="error-${field.id}" class="error-message"></div>
      </div>
    `;
  }).join('');

  const { value: formValues } = await Swal.fire({
    title: formConfig.title,
    html: `<div class="improved-form-container">${formHtml}</div>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    width: '500px',
    preConfirm: () => {
      const values = {};
      let isValid = true;
    
      formConfig.fields.forEach(field => {
        const input = document.getElementById(`swal-input-${field.id}`);
        const errorElement = document.getElementById(`error-${field.id}`);
        
        // No aplicar validaciones a hidden
        if (field.type === "hidden") {
          values[field.id] = field.defaultValue || "";
          return;
        }

        // Obtener el valor del input, si es un select, se asegura de obtener el valor correcto
        if (input) {
            values[field.id] = input.value;
        } else {
            values[field.id] = "";
        }

        input.classList.remove('error', 'valid');
        
        // Validaciones
        if (!values[field.id] || values[field.id].trim() === '') {
          errorElement.textContent = 'Este campo es requerido';
          errorElement.classList.add('show');
          if (input) input.classList.add('error');
          isValid = false;
        } else {
          errorElement.textContent = '';
          errorElement.classList.remove('show');
          if (input) input.classList.add('valid');
        }
      
        if (field.type === 'number' && isNaN(values[field.id])) {
          errorElement.textContent = 'Debe ser un número válido';
          errorElement.classList.add('show');
          if (input) input.classList.add('error');
          isValid = false;
        }
      
        if (field.type === 'email' && !/\S+@\S+\.\S+/.test(values[field.id])) {
          errorElement.textContent = 'Ingrese un correo electrónico válido';
          errorElement.classList.add('show');
          if (input) input.classList.add('error');
          isValid = false;
        }
      
        if (field.type === 'select' && !values[field.id]) {
          errorElement.textContent = 'Seleccione una opción';
          errorElement.classList.add('show');
          if (input) input.classList.add('error');
          isValid = false;
        }
      
        if (field.type === "text" && values[field.id].length < 3) {
          errorElement.textContent = 'El campo debe tener al menos 3 caracteres';
          errorElement.classList.add('show');
          if (input) input.classList.add('error');
          isValid = false;
        }
      
        if (field.type === "text" && !/^[a-zA-Z0-9\s]+$/.test(values[field.id])) {
          errorElement.textContent = 'El campo no debe contener caracteres especiales';
          errorElement.classList.add('show');
          if (input) input.classList.add('error');
          isValid = false;
        }
      });
    
      // Username autogenerado
      if (formConfig.fields.some(f => f.id === "username")) {
        const firstName = values.first_name ? values.first_name.split(" ")[0] : "";
        const lastName = values.last_name ? values.last_name.split(" ")[0] : "";
        const username = (firstName + lastName).toLowerCase();
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
      for (const field of formConfig.fields) {
        const input = document.getElementById(`swal-input-${field.id}`);
        const errorElement = document.getElementById(`error-${field.id}`);

        // 👇 Cargar opciones dinámicas en selects
        if (field.type === 'select' && field.options?.endpoint && input) {
          try {
            const endpoint = field.options.endpoint;
            let data;
            // Mostrar modal de carga para selects
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
            
            // Cerrar el modal de carga al obtener los datos
            Swal.hideLoading();

            if (Array.isArray(data)) {
              data.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item[field.options.valueKey];
                opt.textContent = item[field.options.textKey];
                input.appendChild(opt);
              });
            }
          } catch (e) {
            console.error('Error cargando opciones del select', field.id, e);
            // Asegurarse de cerrar el modal de carga en caso de error
            Swal.hideLoading();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar los datos. Intente de nuevo más tarde.',
            });
          }
        }

        // 👇 No aplicar validaciones a hidden
        if (field.type === "hidden") continue;

        if (input) {
          const handler = (e) => {
            e.target.classList.remove('error', 'valid');
            const value = e.target.value;

            if (value.trim() === '') {
              errorElement.textContent = 'Este campo es requerido';
              errorElement.classList.add('show');
              e.target.classList.add('error');
            } else {
              errorElement.textContent = '';
              errorElement.classList.remove('show');
              e.target.classList.add('valid');

              if (field.type === 'number' && isNaN(value)) {
                errorElement.textContent = 'Debe ser un número válido';
                errorElement.classList.add('show');
                e.target.classList.remove('valid');
                e.target.classList.add('error');
              }

              if (field.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                errorElement.textContent = 'Ingrese un correo electrónico válido';
                errorElement.classList.add('show');
                e.target.classList.remove('valid');
                e.target.classList.add('error');
              }

              if (field.type === "text" && value.length < 3) {
                errorElement.textContent = 'El campo debe tener al menos 3 caracteres';
                errorElement.classList.add('show');
                e.target.classList.remove('valid');
                e.target.classList.add('error');
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
    }
  });

  if (formValues) {
    // Mostrar modal de carga para el envío del formulario
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await registerData(opt.key, formValues);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Registro creado correctamente',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo crear el registro. Por favor, intente de nuevo.',
        confirmButtonText: 'Aceptar'
      });
    }
  }
};

export default handleAction;