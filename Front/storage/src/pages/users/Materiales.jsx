import React, { useState, useEffect, useCallback } from "react";
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";

const options = [
  {
    title: "Añadir Material Didáctico",
    description: "Añade nuevos materiales didácticos al sistema con sus datos y permisos.",
    key: "materiales_didacticos",
  },
]

const headers = {
  nombre: "nombre",
  serie_fabricante: "serial fabricante",
  serie_sena: "serial sena",
  estado: "estado",
}
const campos = {
  nombre: "nombre",
  serie_fabricante: "serie_fabricante",
  serie_sena: "serie_sena",
  estado: "estado_nombre",
}

const MaterialDidacticoManager = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMateriales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall("materiales_didacticos");
      if (response && Array.isArray(response.results)) {
        setMateriales(response.results)
      } else {
        console.log("Error: La respuesta de la API no contiene resultados válidos.");
        setMateriales([]);
      }
    } catch (error) {
      console.error("Error al cargar los materiales:", error);
      setMateriales([]);
    } finally {
      setLoading(false);
    }
  }, []); // No tiene dependencias externas

  useEffect(() => {
    fetchMateriales();
  }, [fetchMateriales])

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo titulo="Gestión de Materiales Didácticos" descripcion="En esta sección podras registrar elementos no tecnologicos" />

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
          data={materiales}
          headers={headers}
          campos={campos}
          title="Materiales Didácticos"
          apiEndpoint="materiales_didacticos" 
          onDataChange={fetchMateriales} 
        />
      </div>
    </div>
  );
};

export default MaterialDidacticoManager;