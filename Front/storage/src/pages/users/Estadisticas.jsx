import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaLaptop,
  FaBook,
  FaExclamationTriangle,
  FaChartLine,
  FaSpinner,
  FaHandHoldingUsd
} from "react-icons/fa";
import { apiCall } from "../../services/apiCutoms";
import { useOutletContext } from 'react-router-dom';

const STATS_MAP = {
  "total_usuarios": {
    title: "Usuarios Registrados",
    description: "Total de usuarios en el sistema",
    icon: <FaUsers size={24} />,
    color: "primary",
  },
  "total_tecnologias": {
    title: "Elementos Tecnológicos",
    description: "Equipos y dispositivos registrados",
    icon: <FaLaptop size={24} />,
    color: "success",
  },
  "total_material": {
    title: "Materiales Didácticos",
    description: "Recursos educativos disponibles",
    icon: <FaBook size={24} />,
    color: "purple",
  },
  "total_reportes": {
    title: "Reportes Activos",
    description: "Incidencias y reportes pendientes",
    icon: <FaExclamationTriangle size={24} />,
    color: "warning",
  },
  "total_prestamos": {
    title: "Préstamos en Curso",
    description: "Elementos actualmente prestados",
    icon: <FaHandHoldingUsd size={24} />,
    color: "info",
  },
};

const StatCard = ({ icon, title, value, color, description, isLoading }) => (
  <div className="card-col">
    <div className="card h-100">
      <div className="card-body-theme">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`p-3 rounded bg-icon-light text-color-${color}`}>
            {icon}
          </div>
          <FaChartLine className="text-color-success" />
        </div>

        <div className="mb-2">
          {isLoading ? (
            <div className="d-flex align-items-center">
              <FaSpinner className="spinner-border-sm me-2 text-muted" />
              <div className="placeholder-glow">
                <span className="placeholder col-4"></span>
              </div>
            </div>
          ) : (
            <h2 className="fw-bold card-statistic-value">
              {value !== undefined ? value.toLocaleString() : 0}
            </h2>
          )}
        </div>

        <h6 className="card-statistic-title">{title}</h6>
        <p className="card-statistic-description">{description}</p>
      </div>
    </div>
  </div>
);
const Estadisticas = () => {
  const { rol } = useOutletContext();
  if (rol == "1") {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fecthEstadisticas = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await apiCall("estadisticas");

          if (response && typeof response === 'object' && !Array.isArray(response)) {
            setData(response);
          } else {
            console.error("La información recibida no es el objeto de estadísticas esperado:", response);
            setError("Formato de datos incorrecto recibido de la API.");
            setData({});
          }
        } catch (err) {
          console.error("Error al obtener datos:", err);
          setError("Error al obtener las estadísticas. Intenta de nuevo.");
          Swal.fire({
            icon: 'error',
            title: 'Error de Carga',
            text: 'Hubo un problema al obtener los datos de la API.',
          });
          setData({});
        } finally {
          setLoading(false);
        }
      };
      fecthEstadisticas();
    }, []);


    const tarjetasData = Object.keys(data).map(key => {
      const config = STATS_MAP[key];
      if (config) {
        return {
          key,
          value: data[key],
          ...config
        };
      }
      return null;
    }).filter(stat => stat !== null);


    if (loading) {
      return (
        <div className="text-center mt-5 p-5">
          <FaSpinner className="fa-spin text-color-primary" size={30} />
          <p className="subtitle">Cargando datos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container py-5">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FaExclamationTriangle className="me-2" />
            <div>
              <strong>Error:</strong> {error}
              <div className="mt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-sm btn-danger"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tarjetasData.length === 0) {
      return (
        <div className="text-center mt-5 p-5">
          <FaExclamationTriangle className="text-warning" size={30} />
          <p className="subtitle">No se encontraron estadísticas para mostrar.</p>
        </div>
      );
    }

    return (
      <div className="container py-5">
        {/* Título y subtítulo con clases temáticas */}
        <div className="text-center mb-5 title-section">
          <h1 className="main-title">Bienvenido</h1>
          <p className="subtitle">Resumen general del sistema de inventario</p>

          {/* Widget de estado de datos adaptado al tema */}
          <div className="d-inline-flex align-items-center px-3 py-2 rounded-pill bg-status-widget shadow-sm">
            <div
              className={`rounded-circle bg-color-success me-2`}
              style={{ width: "10px", height: "10px" }}
            ></div>
            <span className="small">Datos actualizados</span>
          </div>
        </div>

        {/* Tarjetas de Estadísticas con layout temático */}
        <div className="cards-layout-wrapper mb-5">
          {tarjetasData.map((stat) => (
            <StatCard
              key={stat.key}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              description={stat.description}
              isLoading={false}
            />
          ))}
        </div>

        {/* Widget de última actualización adaptado al tema */}
        <div className="text-center mt-5">
          <div className="card bg-status-widget mx-auto" style={{ maxWidth: "300px" }}>
            <div className="card-body-theme p-3">
              <small className="statistic-value d-block mb-1">Última actualización</small>
              <span className="fw-semibold card-statistic-title">
                {new Date().toLocaleString("es-ES")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    if (rol == "2") {
      return (
        <div className="container py-5">
          <div className="text-center mb-5 title-section">
            <h1 className="main-title">Bienvenido</h1>
            {/* <p className="subtitle">Resumen general del sistema de inventario</p> */}
          </div>
        </div>

      )

    }
  }
};

export default Estadisticas;