import React from "react";
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

const Reportes = () => {
  const cantidades = apiCall("reporte_list");
  if (cantidades === null || cantidades === undefined) {
    console.log('error al obtener la cantidad de reportes')
    return <div>Error al cargar cantidades</div>;
  }
  
  const estadisticas = [
    {
      title: "Total de Reportes",
      value: cantidades.total_reportes || 0,
      icon: <FaDatabase size={32} className="text-info" />,
    },
    {
      title: "Reportes Pendientes",
      value: cantidades.pendientes || 0,
      icon: <FaExclamationTriangle size={32} className="text-warning" />,
    },
    {
      title: "Reportes Resueltos",
      value: cantidades.resueltos || 0,
      icon: <FaCheck size={32} className="text-success" />,
    },
    {
      title: "Reportes En Proceso",
      value: cantidades.en_proceso || 0,
      icon: <FaExclamation size={32} className="text-warning" />,
    },
  ];

  const TodosReportes = apiCall("reportes");
  console.log(TodosReportes);
  if (TodosReportes === null || TodosReportes === undefined) {
    console.log('error al obtener los reportes')
    return <div>Error al cargar reportes</div>;
  }

  const datos = Array.from(TodosReportes);

  const createReport = () => {
    console.log("Creando reporte");
  };

  return (
    <div className="container py-5">
      <Titulo titulo="Visualización de Reportes" descripcion="Aquí podrás consultar el estado y las estadísticas de los reportes
        generados." />
      <Estadistica estadisticas={estadisticas} />
      <div className="mb-3">
        <Button onClick={() => createReport()}>Crear Reporte</Button>
      </div>
      <Tabla datos={datos} titulo="Titulo" estado="Estado" fecha="Fecha" />
    </div>
  );
};

export default Reportes;
