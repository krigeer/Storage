import React, { useState, useCallback } from "react";
// Importamos los componentes de acción que creamos
import ViewButton from "./ViewButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

/**
 * Componente de Tabla genérico con paginación e iconos de acción.
 * * @param {string} title - Título de la tabla.
 * @param {object} headers - Objeto de títulos de columna (ej: {id: 'ID'}).
 * @param {Array} data - Array de datos de la API.
 * @param {object} campos - Objeto que mapea los campos de 'data' a las columnas (ej: {id: 'id'}).
 * @param {string} apiEndpoint - La ruta final de la API (ej: "reportes").
 * @param {function} onDataChange - Función que se llama para refrescar los datos después de una acción (DELETE/EDIT).
 */
export default function Tabla({ title, headers, data, campos, apiEndpoint, onDataChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Lógica de Paginación ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(data)
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const totalPages = Array.isArray(data)
    ? Math.ceil(data.length / itemsPerPage)
    : 0;

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- Manejador de Acciones (DELETE/EDIT) ---
  // Esta función notifica al componente padre que debe recargar los datos
  const handleActionSuccess = useCallback(() => {
    // Vuelve a la primera página si es necesario y llama al refresco
    setCurrentPage(1);
    if (onDataChange) onDataChange();
  }, [onDataChange]);


  return (
    <div className="card shadow-lg border-0 rounded-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3">{title}</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                {/* Renderiza los encabezados de la tabla */}
                {Object.values(headers).map((headerText) => (
                  <th key={headerText}>{headerText}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.id || index}>
                    {/* Renderiza las celdas de datos según el mapeo de 'campos' */}
                    {Object.keys(campos).map((key) => {
                      const campo = campos[key];
                      // Permite que 'campo' sea una función para renderizado complejo
                      const rawValue = typeof campo === 'function' ? campo(item) : item[campo];

                      // Lógica de formato especial para el campo 'estado'
                      if (key === 'estado') {
                        return (
                          <td key={key}>
                            <span
                              className={`badge ${rawValue === "activo"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                                }`}
                            >
                              {rawValue}
                            </span>
                          </td>
                        );
                      }
                      return <td key={key}>{rawValue}</td>;
                    })}

                    {/* Celda de Acciones: Usa los componentes de botón */}
                    <td className="d-flex gap-2">
                      <ViewButton
                        endpoint={apiEndpoint}
                        itemId={item.id}
                      />
                      <EditButton
                        endpoint={apiEndpoint}
                        itemId={item.id}
                        onActionSuccess={handleActionSuccess}
                      />
                      <DeleteButton
                        endpoint={apiEndpoint}
                        itemId={item.id}
                        onActionSuccess={handleActionSuccess}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(headers).length + 1} className="text-center">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* --- Paginación --- */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}