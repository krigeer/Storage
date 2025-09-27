import React from "react";
import {
  FaLaptop,
  FaUniversity,
  FaMapMarkerAlt,
  FaMicrochip,
  FaTag,
} from "react-icons/fa";
import "../../styles/form.css";
import  handleAction from "../../components/UI/Form";
import handleView from "../../components/UI/View";
import Button from "../../components/UI/Button";
import Titulo from "../../components/UI/Titulo";

const options = [
  {
    title: "Registrar Tipo de Documento",
    description: "Crea nuevos tipos de documentos dentro del sistema de forma sencilla.",
    icon: <FaLaptop size={42} className="text-primary mb-3" />,
    key: "tipos_documentos",
  },  
  {
    title: "Registrar Centros",
    description: "Crea y administra nuevos centros dentro del sistema de forma sencilla.",
    icon: <FaUniversity size={42} className="text-success mb-3" />,
    key: "centros",
  },
  {
    title: "Registrar Ubicaciones",
    description: "Crea y administra nuevas ubicaciones dentro del sistema de forma sencilla.",
    icon: <FaMapMarkerAlt size={42} className="text-danger mb-3" />,
    key: "ubicaciones",
    
  },
  {
    title: "Registrar Tipo de Tecnología",
    description: "Crea y administra nuevos tipos de tecnologías dentro del sistema.",
    icon: <FaMicrochip size={42} className="text-warning mb-3" />,
    key: "tipos_tecnologia",
  },
  {
    title: "Registrar Marcas",
    description: "Crea y administra nuevas marcas tecnológicas dentro del sistema.",
    icon: <FaTag size={42} className="text-info mb-3" />,
    key: "marcas",
  },
];

const GestionarBD = () => {
  return (
    <div className="container py-5">
      <Titulo titulo="Gestionar Base de Datos" descripcion="En este apartado podrás modificar la información principal de la base de datos." />
  
      <div className="row g-4">
    {options.map((opt, index) => (
      <div className="col-md-6 col-xl-3" key={index}>
        <div className="card shadow-lg border-0 rounded-4 h-100">
          <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
            <div>
              <div className="card-icon">{opt.icon}</div> 
              
              <h4 className="card-custom-title">{opt.title}</h4> 
              
              <p className="card-custom-text">{opt.description}</p>
            </div>
            <div className="d-grid gap-2 mt-3">
              <Button onClick={() => handleAction(opt)} className="btn primary">
                Seleccionar
              </Button>
              <Button onClick={() => handleView(opt)} className="btn">
                Ver 
              </Button>
            </div>
          </div>
        </div>
      </div>
    ))}
</div>
    </div>
  );
};

export default GestionarBD;
