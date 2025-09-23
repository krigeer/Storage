import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";


export default function Tabla({ title, headers, data, campos }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <div className="card shadow-lg border-0 rounded-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3">{title}</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
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
                    {Object.keys(campos).map((key) => (
                      <td key={key}>
                        {key === 'estado' ? (
                          <span
                            className={`badge ${
                              item[campos[key]] === "activo"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {item[campos[key]]}
                          </span>
                        ) : (
                          item[campos[key]]
                        )}
                      </td>
                    ))}
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary" ><FaEye /></button>
                      <button className="btn btn-warning"><FaEdit /></button>
                      <button className="btn btn-danger"><FaTrash /></button>
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

        {/* Lógica de paginación */}
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