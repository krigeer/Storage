import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaLaptop,
  FaBook,
  FaExclamationTriangle,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";

const handleRegistrarUsuario = () => {
  Swal.fire({
    title: "Registrar Usuario",
    text: "Aquí irá la lógica para registrar un nuevo usuario.",
    icon: "info",
    confirmButtonText: "Entendido",
  });
};
const handleRegistrarElemento = () => {
  Swal.fire({
    title: "Registrar Elemento Tecnológico",
    text: "Aquí irá la lógica para registrar un nuevo equipo o dispositivo.",
    icon: "success",
    confirmButtonText: "Continuar",
  });
};
const handleRegistrarMaterial = () => {
  Swal.fire({
    title: "Registrar Material Didáctico",
    text: "Aquí irá la lógica para registrar un nuevo material.",
    icon: "question",
    confirmButtonText: "Ok",
  });
};
const handleReportarIncidente = () => {
  Swal.fire({
    title: "Reportar Incidente",
    text: "Aquí irá la lógica para reportar un incidente.",
    icon: "warning",
    confirmButtonText: "Reportar",
  });
};
const Estadisticas = () => {
  const [stats, setStats] = useState({
    users: 0,
    techItems: 0,
    eduMaterials: 0,
    reports: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/inventario/estadisticas"
        );
        if (!response.ok) {
          throw new Error("Error al cargar las estadísticas");
        }
        const data = await response.json();
        setStats({
          users: data.total_usuarios || 0,
          techItems: data.total_tecnologias || 0,
          eduMaterials: data.total_material || 0,
          reports: data.total_reportes || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, color, description }) => (
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
            {stats.loading ? (
              <div className="d-flex align-items-center">
                <FaSpinner className="spinner-border-sm me-2 text-muted" />
                <div className="placeholder-glow">
                  <span className="placeholder col-4"></span>
                </div>
              </div>
            ) : (
              <h2 className="fw-bold text-dark">{value.toLocaleString()}</h2>
            )}
          </div>

          <h6 className="text-muted text-uppercase fw-bold small">{title}</h6>
          <p className="text-muted small mb-0">{description}</p>
        </div>
      </div>
    </div>
  );

  if (stats.error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FaExclamationTriangle className="me-2" />
          <div>
            <strong>Error:</strong> {stats.error}
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

  

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Bienvenido</h1>
        <p className="text-muted">Resumen general del sistema de inventario</p>
        <div className="d-inline-flex align-items-center px-3 py-2 bg-white border rounded-pill shadow-sm">
          <div
            className={`rounded-circle bg-${
              stats.loading ? "secondary" : "success"
            } me-2`}
            style={{ width: "10px", height: "10px" }}
          ></div>
          <span className="small">
            {stats.loading ? "Cargando datos..." : "Datos actualizados"}
          </span>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="row mb-5">
        <StatCard
          icon={<FaUsers size={24} />}
          title="Usuarios Registrados"
          description="Total de usuarios en el sistema"
          value={stats.users}
          color="primary"
        />
        <StatCard
          icon={<FaLaptop size={24} />}
          title="Elementos Tecnológicos"
          description="Equipos y dispositivos registrados"
          value={stats.techItems}
          color="success"
        />
        <StatCard
          icon={<FaBook size={24} />}
          title="Materiales Didácticos"
          description="Recursos educativos disponibles"
          value={stats.eduMaterials}
          color="purple"
        />
        <StatCard
          icon={<FaExclamationTriangle size={24} />}
          title="Reportes Activos"
          description="Incidencias y reportes pendientes"
          value={stats.reports}
          color="warning"
        />
      </div>
      {/* opciones rapidas */}
      <div className="container py-5">
      <Titulo titulo="Opciones Rápidas"  descripcion="Acceso directo a las principales funcionalidades"/>

      {/* Botones */}
      <div className="row g-4">
        <div className="col-md-6 col-xl-3">
          <button
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleRegistrarUsuario}
          >
            <FaUsers /> Registrar Usuario
          </button>
        </div>
        <div className="col-md-6 col-xl-3">
          <button
            className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleRegistrarElemento}
          >
            <FaLaptop /> Registrar Elemento Tecnológico
          </button>
        </div>
        <div className="col-md-6 col-xl-3">
          <button
            className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleRegistrarMaterial}
          >
            <FaBook /> Registrar Material Didáctico
          </button>
        </div>
        <div className="col-md-6 col-xl-3">
          <button
            className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleReportarIncidente}
          >
            <FaExclamationTriangle /> Reportar Incidente
          </button>
        </div>
      </div>
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
