import React, { useState, useEffect, useCallback } from "react"; // 1. Importar useCallback
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";

const options = [
  { title: "Prestar", description: "Prestar un elemento", key: "seleccion" },
  { title: "Actualizar", description: "Actualizar un prestamo", key: "actualizar" },
]

const header = {
  solicitante: "Solicitante",
  observacion: "Observacion",
  elemento: "Elemento",
}

const campos = {
  solicitante: "solicitante",
  observacion: "observacion",
  elemento: (item) => item?.tecnologia
    ? `Tecnología (${item.tecnologia})`
    : item?.material_didactico
      ? `Material didáctico (${item.material_didactico})`
      : "—",
}

const PrestamoElementos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrestamos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall("prestamos"); 
      if (response && Array.isArray(response.results)) {
        setPrestamos(response.results);
      } else {
        console.log("El objeto no es un array legible");
        setPrestamos([]);
      }
    } catch (error) {
      console.error("Error obteniendo los datos:", error);
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchPrestamos();
  }, [fetchPrestamos]); 

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>
  }

  return (
    <div>
      <Titulo titulo="Gestionar Prestamos" descripcion="En este apartado podras buscar elementos prestados o prestar elementos" />
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
          data={prestamos}
          headers={header}
          campos={campos}
          title="Prestamos"
          apiEndpoint="prestamos" 
          onDataChange={fetchPrestamos} 
        />
      </div>
    </div>
  )
}

export default PrestamoElementos;