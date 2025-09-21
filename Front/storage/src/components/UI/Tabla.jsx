import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


export default function Tabla(props) {
    const { datos } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const reportesPerPage = 5;

    const indexOfLastReporte = currentPage * reportesPerPage;
    const indexOfFirstReporte = indexOfLastReporte - reportesPerPage;
    const currentReportes = datos.slice(
        indexOfFirstReporte,
        indexOfLastReporte
    );

    const totalPages = Math.ceil(datos.length / reportesPerPage);
    return (
        <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body">
                <h5 className="fw-bold mb-3">Últimos Reportes</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>{props.titulo}</th>
                                <th>{props.estado}</th>
                                <th>{props.fecha}</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReportes.map((rep) => (
                                <tr key={rep.id}>
                                    <td>{rep.titulo}</td>
                                    <td>
                                        <span
                                            className={`badge ${rep.estado === "Pendiente"
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
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary"><FaEye /></button>
                                        <button className="btn btn-warning"><FaEdit /></button>
                                        <button className="btn btn-danger"><FaTrash /></button>
                                    </td>
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
                                className={`page-item ${currentPage === i + 1 ? "active" : ""
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
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
    )
}