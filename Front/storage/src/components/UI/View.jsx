import { apiCall } from "../../services/apiCutoms";
import Swal from "sweetalert2";

const handleView = async (opt) => {
    try {
      const response = await apiCall(opt.key);
      // console.log('Respuesta de la API:', response);
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      const data = Array.isArray(response) ? response : 
                  (response.results || response.data || []);
      
      // console.log('Datos procesados:', data);
      
      if (!Array.isArray(data)) {
        console.error('Los datos no son un array:', data);
        throw new Error('Formato de datos inválido');
      }
      
      if (data.length === 0) {
        return Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No se encontraron registros para mostrar.',
          confirmButtonText: 'Aceptar'
        });
      }
      
  
      if (typeof data[0] !== 'object' || data[0] === null) {
        console.error('Los elementos del array no son objetos:', data);
        throw new Error('Formato de datos inválido');
      }
      
      const headers = Object.keys(data[0]);
      if (headers.length === 0) {
        console.error('No se encontraron propiedades en el primer elemento:', data[0]);
        throw new Error('No se encontraron columnas para mostrar');
      }
      
      const tableHeaders = headers.map(header => 
        `<th class="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`
      ).join('');
      
      const tableRows = data.map((item, index) => {
        const cells = headers.map(header => {
          const value = item[header];
          return `<td class="px-4 py-2 border-b border-gray-200">${value !== undefined && value !== null ? value : '-'}</td>`;
        }).join('');
        return `<tr class="hover:bg-gray-50">${cells}</tr>`;
      }).join('');
      
      const tableHtml = `
        <div class="overflow-auto max-h-96">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>${tableHeaders}</tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;
      
      console.log('HTML generado:', tableHtml); 
      
      await Swal.fire({
        title: `${opt.title.toLowerCase()}`,
        html: tableHtml,
        width: '90%',
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        showCloseButton: true,
        customClass: {
          popup: 'text-left'
        }
      });
      
    } catch (error) {
      console.error('Error en handleView:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ocurrió un error al cargar los datos',
        confirmButtonText: 'Aceptar'
      });
    }
  };

export default handleView;
