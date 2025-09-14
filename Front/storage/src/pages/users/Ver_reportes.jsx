import React, { useState } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaChartLine,
  FaDatabase,
} from "react-icons/fa";

const Reportes = () => {
  // Estadísticas (pueden venir de API)
  const estadisticas = [
    {
      title: "Usuarios Activos",
      value: 128,
      icon: <FaUsers size={32} className="text-primary" />,
    },
    {
      title: "Reportes Pendientes",
      value: 14,
      icon: <FaExclamationTriangle size={32} className="text-warning" />,
    },
    {
      title: "Total de Reportes",
      value: 542,
      icon: <FaDatabase size={32} className="text-info" />,
    },
  ];

  // Datos de ejemplo (simulación de muchos reportes)
  const allReportes = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    titulo: `Reporte ${i + 1}`,
    estado:
      i % 3 === 0 ? "Pendiente" : i % 3 === 1 ? "Resuelto" : "En proceso",
    fecha: `2025-09-${(i % 30) + 1}`,
  }));

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const reportesPerPage = 5;

  // Calcular índices para la paginación
  const indexOfLastReporte = currentPage * reportesPerPage;
  const indexOfFirstReporte = indexOfLastReporte - reportesPerPage;
  const currentReportes = allReportes.slice(
    indexOfFirstReporte,
    indexOfLastReporte
  );

  const totalPages = Math.ceil(allReportes.length / reportesPerPage);

  return (
    <div className="container py-5">
      {/* Título */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Visualización de Reportes</h1>
        <p className="text-muted">
          Aquí podrás consultar el estado y las estadísticas de los reportes
          generados.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="row g-4 mb-5">
        {estadisticas.map((item, index) => (
          <div className="col-md-6 col-xl-3" key={index}>
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                {item.icon}
                <div>
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  <span className="text-muted">{item.value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de reportes */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Últimos Reportes</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {currentReportes.map((rep) => (
                  <tr key={rep.id}>
                    <td>{rep.id}</td>
                    <td>{rep.titulo}</td>
                    <td>
                      <span
                        className={`badge ${
                          rep.estado === "Pendiente"
                            ? "bg-warning text-dark"
                            : rep.estado === "Resuelto"
                            ? "bg-success"
                            : "bg-info text-dark"
                        }`}
                      >
                        {rep.estado}
                      </span>
                    </td>
                    <td>{rep.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
