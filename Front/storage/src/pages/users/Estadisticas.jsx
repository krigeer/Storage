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
  <div className="col-md-6 col-xl-3 mb-4">
    <div className="card shadow-sm h-100 border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`p-3 rounded bg-light text-${color}`}>
            {icon}
          </div>
          <FaChartLine className="text-success" />
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
            <h2 className="fw-bold text-dark">
              {value !== undefined ? value.toLocaleString() : 0}
            </h2>
          )}
        </div>

        <h6 className="text-muted text-uppercase fw-bold small">{title}</h6>
        <p className="text-muted small mb-0">{description}</p>
      </div>
    </div>
  </div>
);

const Estadisticas = () => {
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
            <FaSpinner className="fa-spin text-primary" size={30} />
            <p className="mt-2">Cargando datos...</p>
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
            <p className="mt-2">No se encontraron estadísticas para mostrar.</p>
        </div>
    );
  }
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Bienvenido</h1>
        <p className="text-muted">Resumen general del sistema de inventario</p>
        <div className="d-inline-flex align-items-center px-3 py-2 bg-white border rounded-pill shadow-sm">
          <div
            className={`rounded-circle bg-success me-2`}
            style={{ width: "10px", height: "10px" }}
          ></div>
          <span className="small">Datos actualizados</span>
        </div>
      </div>

      <div className="row mb-5">
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

      <div className="text-center mt-5">
        <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: "300px" }}>
          <div className="card-body">
            <small className="text-muted d-block mb-1">Última actualización</small>
            <span className="fw-semibold text-dark">
              {new Date().toLocaleString("es-ES")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;