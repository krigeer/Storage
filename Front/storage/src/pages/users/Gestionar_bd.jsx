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
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Gestionar Base de Datos</h1>
        <p className="text-muted">
          En este apartado podrás modificar la información principal de la base de datos.
        </p>
      </div>
      <div className="row g-4">
        {options.map((opt, index) => (
          <div className="col-md-6 col-xl-3" key={index}>
            <div className="card shadow-lg border-0 rounded-4 h-100">
              <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                <div>
                  {opt.icon}
                  <h5 className="card-title fw-bold">{opt.title}</h5>
                  <p className="card-text text-muted">{opt.description}</p>
                </div>
                <Button onClick={() => handleAction(opt)}>
                  Seleccionar
                </Button>
                <Button onClick={() => handleView(opt)}>
                  Ver 
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionarBD;
