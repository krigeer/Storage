import React from 'react';
import Swal from "sweetalert2";
import { FaUserPlus, FaUserEdit } from "react-icons/fa";

const handleUserAction = (action) => {
    Swal.fire({
      title: action === "create" ? "Crear Usuario" : "Editar Usuario",
      text:
        action === "create"
          ? "Aquí irá la lógica para registrar un nuevo usuario."
          : "Aquí irá la lógica para editar un usuario existente.",
      icon: "info",
      confirmButtonText: "Entendido",
    });
  };

  const userOptions = [
    {
      title: "Crear Usuario",
      description: "Agrega nuevos usuarios al sistema con sus datos y permisos.",
      icon: <FaUserPlus size={42} className="text-success mb-3" />,
      action: "create",
    },
    {
      title: "Editar Usuario",
      description: "Modifica la información y permisos de los usuarios existentes.",
      icon: <FaUserEdit size={42} className="text-warning mb-3" />,
      action: "edit",
    },
  ];

const Gestion_usuario = () => {
    return (
        <div className="container py-5">

            <div className="text-center mb-5">
                <h1 className="fw-bold text-dark">Administración de Usuarios</h1>
                <p className="text-muted">
                Aquí podrás gestionar la creación y edición de usuarios en el sistema.
                </p>
            </div>

            <div className="row g-4 justify-content-center">
            {userOptions.map((opt, index) => (
                <div className="col-md-6 col-xl-4" key={index}>
                    <div className="card shadow-lg border-0 rounded-4 h-100">
                    <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                    <div>
                    {opt.icon}
                    <h5 className="card-title fw-bold">{opt.title}</h5>
                  <p className="card-text text-muted">{opt.description}</p>
                </div>
                <button
                  className="btn btn-modern w-100 mt-3"
                  onClick={() => handleUserAction(opt.action)}
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

export default Gestion_usuario;