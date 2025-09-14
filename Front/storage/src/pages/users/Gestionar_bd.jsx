import React from "react";
import Swal from "sweetalert2";
import {
  FaLaptop,
  FaUniversity,
  FaMapMarkerAlt,
  FaMicrochip,
  FaTag,
} from "react-icons/fa";

// Función de ejemplo al hacer clic
const handleAction = (title) => {
  Swal.fire({
    title,
    text: `Aquí irá la lógica para ${title.toLowerCase()}.`,
    icon: "info",
    confirmButtonText: "Entendido",
  });
};

// Opciones configuradas en un array
const options = [
  {
    title: "Registrar Tipo de Documento",
    description: "Crea nuevos tipos de documentos dentro del sistema de forma sencilla.",
    icon: <FaLaptop size={42} className="text-primary mb-3" />,
  },
  {
    title: "Registrar Centros",
    description: "Crea y administra nuevos centros dentro del sistema de forma sencilla.",
    icon: <FaUniversity size={42} className="text-success mb-3" />,
  },
  {
    title: "Registrar Ubicaciones",
    description: "Crea y administra nuevas ubicaciones dentro del sistema de forma sencilla.",
    icon: <FaMapMarkerAlt size={42} className="text-danger mb-3" />,
  },
  {
    title: "Registrar Tipo de Tecnología",
    description: "Crea y administra nuevos tipos de tecnologías dentro del sistema.",
    icon: <FaMicrochip size={42} className="text-warning mb-3" />,
  },
  {
    title: "Registrar Marcas",
    description: "Crea y administra nuevas marcas tecnológicas dentro del sistema.",
    icon: <FaTag size={42} className="text-info mb-3" />,
  },
];

const GestionarBD = () => {
  return (
    <div className="container py-5">
      {/* Título */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Gestionar Base de Datos</h1>
        <p className="text-muted">
          En este apartado podrás modificar la información principal de la base de datos.
        </p>
      </div>

      {/* Opciones dinámicas */}
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
                <button
                  className="btn btn-modern w-100 mt-3"
                  onClick={() => handleAction(opt.title)}
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionarBD;
