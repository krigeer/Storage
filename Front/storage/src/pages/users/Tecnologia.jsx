import React, { useState, useEffect, useCallback } from "react";
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";

const options = [
  {
    title: "Añadir Tecnologia",
    description: "Añade nuevas tecnologías al sistema con sus datos y permisos.",
    key: "tecnologias",
  },
]

const headers = {
  nombre: "Nombre",
  Tipo: "Tipo",
  serie_fabricante: "Serial fabricante",
  serie_sena: "Serial sena",
  estado: "Estado",
  marca: "Marca",
}
const campos = {
  nombre: "nombre",
  tipo: "tipo_nombre", 
  serie_fabricante: "serie_fabricante",
  serie_sena: "serie_sena",
  estado: "estado_nombre",
  marca: "marca_nombre", 
}

const TecnologiaManager = () => {
  const [tecnologias, setTecnologias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTecnologias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall("tecnologias"); 
      if (response && Array.isArray(response.results)) {
        setTecnologias(response.results)
      } else {
        console.log("Error: La respuesta de la API no contiene resultados válidos.");
        setTecnologias([]);
      }
    } catch (error) {
      console.error("Error al cargar las tecnologías:", error);
      setTecnologias([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
   
    fetchTecnologias();
  }, [fetchTecnologias]); 

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo titulo="Gestión de Tecnologías" descripcion="En esta sección podras registrar elementos tecnologicos" />

      <div className="options-layout-centered">
    {options.map((opt, index) => (
      <div className="card-option-col" key={index}>
        <div className="card h-100"> 
          <div className="card-body-theme">
            <div>
              <h4 className="card-custom-title">{opt.title}</h4> 
              
              <p className="card-custom-text">{opt.description}</p>
            </div>
            <div className="d-grid mt-3">
              <Button onClick={() => handleAction(opt)} className="btn primary">
                Seleccionar
              </Button>
            </div>
          </div>
        </div>
      </div>
    ))}
</div>

      <div className="mt-5">
        <Tabla
          data={tecnologias}
          headers={headers}
          campos={campos}
          title="Tecnologías"
          apiEndpoint="tecnologias" 
          onDataChange={fetchTecnologias} 
        />
      </div>
    </div>
  );
};

export default TecnologiaManager;