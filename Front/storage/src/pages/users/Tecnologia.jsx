import React, { useState, useEffect } from "react";
import Titulo  from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import  handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";

const options = [
  {
      title: "Añadir Tecnologia",
      description: "Añade nuevas tecnologías al sistema con sus datos y permisos.",
      key: "tecnologias",
    },
    {
      title: "Generar QR de un elemento Tecnologico",
      description: "Genera un QR para un elemento tecnologico existente en el sistema.",
      key: "generar_qr_tecnologia",
    },
]

const headers ={
  nombre: "nombre",
  Tipo: "Tipo",
  caracteristicas: "Caracteristicas",
  serie_fabricante: "serial fabricante",
  serie_sena: "serial sena",
  estado: "estado",
  marca: "marca",
}
const campos ={
  nombre: "nombre",
  tipo: "tipo",
  caracteristicas: "caracteristicas",
  serie_fabricante: "serie_fabricante",
  serie_sena: "serie_sena",
  estado: "estado",
  marca: "marca",
}
const TecnologiaManager = () => {
  const [tecnologias, setTecnologias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTecnologias = async () => {
    try {
      setLoading(true);
      const response = await apiCall("tecnologias");
      if (response && Array.isArray(response.results)){
        setTecnologias(response.results)
      }else{
        console.log("error cargando los datos");
        setTecnologias([]);
      }
    } catch (error){
      console.log("datos no cargados");
      setTecnologias([]);
    } finally{
      setLoading(false);
    }
    
  };
    fetchTecnologias();
  }, [])

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo titulo="Gestión de Tecnologías"  descripcion="En esta sección podras registrar elementos tecnologicos"/>

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
              <Tabla data={tecnologias} headers={headers} campos={campos} title="Tecnologías" />
            </div>
    </div>
  );
};

export default TecnologiaManager;
