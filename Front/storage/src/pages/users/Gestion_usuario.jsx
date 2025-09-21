import React from 'react';
import Swal from "sweetalert2";
import { FaUserPlus, FaUserEdit } from "react-icons/fa";
import handleAction from "../../components/UI/Form";
import Button from "../../components/UI/Button";
import Titulo from "../../components/UI/Titulo";

const userOptions = [
  {
    title: "Crear Usuario",
    description: "Agrega nuevos usuarios al sistema con sus datos y permisos.",
    icon: <FaUserPlus size={42} className="text-success mb-3" />,
    key: "crear_usuarios",
  },
  {
    title: "Editar Usuario",
    description: "Modifica la información y permisos de los usuarios existentes.",
    icon: <FaUserEdit size={42} className="text-warning mb-3" />,
    key: "editar_usuarios/${idUsuario}",
  },
];

const Gestion_usuario = () => {
  return (
    <div>
      <Titulo titulo="Administración de Usuarios" descripcion="Gestionar la creación y edición de usuarios en el sistema." />
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
                <Button onClick={() => handleAction(opt)}>
                  Seleccionar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gestion_usuario;