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

  // --- Paginación ---
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

  // ---  Acciones (DELETE/EDIT) ---
  const handleActionSuccess = useCallback(() => {
    setCurrentPage(1);
    if (onDataChange) onDataChange();
  }, [onDataChange]);


  return (
    <div className="table-section">
      <div className="table-header">
        <h5 className="title-table">{title}</h5>
      </div>
      <div className="table-wrapper"> 
        <table className="app-table">
          <thead>
            <tr>
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
                    const rawValue = typeof campo === 'function' ? campo(item) : item[campo];

                    //  campo 'estado'
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

                  {/* Celda de Acciones */}
                  <td className="actions-cell">
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
                <td colSpan={Object.keys(headers).length + 1} className="text-center-theme">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* --- Paginación --- */}
      {totalPages > 1 && (
        <nav className="pagination-nav">
          <ul className="pagination-list">
            <li className={`page-item-theme ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link-theme"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item-theme ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link-theme"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item-theme ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link-theme"
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
  );
}