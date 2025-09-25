import React, { useState, useEffect } from "react";
import Titulo  from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import  handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";

const options = [
  {
      title: "Añadir Material Didáctico",
      description: "Añade nuevos materiales didácticos al sistema con sus datos y permisos.",
      key: "materiales_didacticos",
    },
    {
      title: "Generar QR de un Material",
      description: "Genera un QR para un Material existente en el sistema.",
      key: "generar_qr_tecnologia",
    },
]

const headers ={
  nombre: "nombre",
  serie_fabricante: "serial fabricante",
  serie_sena: "serial sena",
  estado: "estado",
}
const campos ={
  nombre: "nombre",
  serie_fabricante: "serie_fabricante",
  serie_sena: "serie_sena",
  estado: "estado",
}
const MaterialDidacticoManager = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMateriales = async () => {
    try {
      setLoading(true);
      const response = await apiCall("materiales_didacticos");
      if (response && Array.isArray(response.results)){
        setMateriales(response.results)
      }else{
        console.log("error cargando los datos");
        setMateriales([]);
      }
    } catch (error){
      console.log("datos no cargados");
      setMateriales([]);
    } finally{
      setLoading(false);
    }
    
  };
    fetchMateriales();
  }, [])

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo titulo="Gestión de Materiales Didácticos"  descripcion="En esta sección podras registrar elementos no tecnologicos"/>

      <div className="row g-4 justify-content-center">
              {options.map((opt, index) => (
                <div className="col-md-6 col-xl-4" key={index}>
                  <div className="card shadow-lg border-0 rounded-4 h-100">
                    <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                      <div>
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
              <Tabla data={materiales} headers={headers} campos={campos} title="Materiales Didácticos" />
            </div>
    </div>
  );
};

export default MaterialDidacticoManager;
