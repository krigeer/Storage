import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserEdit } from "react-icons/fa";
import handleAction from "../../components/UI/Form";
import Button from "../../components/UI/Button";
import Titulo from "../../components/UI/Titulo";
import Tabla from "../../components/UI/Tabla";
import { apiCall } from '../../services/apiCutoms';

const userOptions = [
  {
    title: "Crear Usuario",
    description: "Agrega nuevos usuarios al sistema con sus datos y permisos.",
    icon: <FaUserPlus size={42} className="text-success mb-3" />,
    key: "crear_usuarios",
  },
  {
    title: "Buscar Usuario",
    description: "Busca y modifica la información y permisos de los usuarios existentes.",
    icon: <FaUserEdit size={42} className="text-warning mb-3" />,
    key: "buscar_usuarios",
  },
];

const headers = {
  titulo: "Nombre",
  documento: "Documento",
  email: "Email",
  estado: "Estado",
}
const campos = {
  titulo: "first_name",
  documento: "documento",
  email: "email",
  estado: "estado",
}



const Gestion_usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await apiCall("usuarios");
        if (response && Array.isArray(response.results)) {
          setUsuarios(response.results);
        } else {
          console.error("API response does not contain a valid 'results' array.");
          setUsuarios([]);
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo
        titulo="Administración de Usuarios"
        descripcion="Gestionar la creación y edición de usuarios en el sistema."
      />
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
      
      <div className="mt-5">
        <Tabla data={usuarios} headers={headers} campos={campos} title="Usuarios Registrados" />
      </div>
    </div>
  );
};

export default Gestion_usuario;