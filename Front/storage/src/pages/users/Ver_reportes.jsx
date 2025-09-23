import React, { useState, useEffect } from "react";
import Titulo from "../../components/UI/Titulo";
import {
  FaExclamationTriangle,
  FaDatabase,
  FaCheck,
  FaExclamation,
} from "react-icons/fa";
import Estadistica from "../../components/UI/Estadistica";
import Tabla from "../../components/UI/Tabla";
import { apiCall } from "../../services/apiCutoms";
import Button from "../../components/UI/Button";

const headers = {
  titulo: "Titulo",
  usuario: "Usuario",
  ubicacion: "Ubicación",
  prioridad: "Prioridad",
  estado: "Estado",
  fecha: "Fecha",
};
const campos = {
  titulo: "titulo",
  usuario: "usuario",
  ubicacion: "ubicacion",
  prioridad: "prioridad",
  estado: "estado",
  fecha: "fecha",
};

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [reporteStats, setReporteStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [statsResponse, reportesResponse] = await Promise.all([
          apiCall("reporte_list"),
          apiCall("reportes"),
        ]);

        if (statsResponse) {
          setReporteStats(statsResponse);
        } else {
          setReporteStats({});
        }
        if (reportesResponse && Array.isArray(reportesResponse.results)) {
          setReportes(reportesResponse.results);
        } else {
          setReportes([]);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setReporteStats({});
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }
  const estadisticas = [
    {
      title: "Total de Reportes",
      value: reporteStats.total_reportes || 0,
      icon: <FaDatabase size={32} className="text-info" />,
    },
    {
      title: "Reportes Pendientes",
      value: reporteStats.pendientes || 0,
      icon: <FaExclamationTriangle size={32} className="text-warning" />,
    },
    {
      title: "Reportes Resueltos",
      value: reporteStats.resueltos || 0,
      icon: <FaCheck size={32} className="text-success" />,
    },
    {
      title: "Reportes En Proceso",
      value: reporteStats.en_proceso || 0,
      icon: <FaExclamation size={32} className="text-warning" />,
    },
  ];

  const createReport = () => {
    console.log("Creando reporte");
  };

  return (
    <div className="container py-5">
      <Titulo
        titulo="Visualización de Reportes"
        descripcion="Aquí podrás consultar el estado y las estadísticas de los reportes generados."
      />
      <Estadistica estadisticas={estadisticas} />
      <div className="mb-3">
        <Button onClick={() => createReport()}>Crear Reporte</Button>
      </div>
      <Tabla data={reportes} headers={headers} campos={campos} title="Reportes" />
    </div>
  );
};

export default Reportes;