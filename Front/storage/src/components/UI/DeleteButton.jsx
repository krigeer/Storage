// src/components/DeleteButton.jsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/data'; // Importamos la URL base

export default function DeleteButton({ endpoint, itemId, onActionSuccess }) {

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el item #${itemId} de ${endpoint}?`)) {
      return;
    }

    try {
      // Construye la URL final: http://127.0.0.1:8000/inventario/reportes/123/
      const url = `${API_BASE_URL}${endpoint}/${itemId}/`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        alert('✅ Elemento eliminado con éxito!');
        // Llama a la función de refresco de la tabla
        if (onActionSuccess) onActionSuccess(); 
      } else {
        const errorData = await response.json();
        throw new Error(`Error al eliminar: ${response.status} - ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('❌ Hubo un error al intentar eliminar el elemento. Revisa la consola.');
    }
  };

  return (
    <button 
      className="btn btn-danger btn-sm" 
      onClick={handleDelete}
      title="Eliminar"
    >
      <FaTrash />
    </button>
  );
}