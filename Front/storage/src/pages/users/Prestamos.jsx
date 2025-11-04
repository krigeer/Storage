import React, { useState, useEffect, useCallback } from "react"; 
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";
import ReturnForm from "../../components/UI/ReturnForm";
import {useOutletContext} from "react-router-dom";
import { getUser } from "../../services/authContext.js";

const firstname = getUser().first_name;
const lastName = getUser().last_name;

const options = [
  { title: "Prestar", description: "Prestar un elemento", key: "prestamos" },
  { title: "Devolucion", description: "Devolver un prestamo", key: "devolucion" },
]

const header = {
  solicitante: "Solicitante",
  elemento: "Elemento",

}

const campos = {
  solicitante: "solicitante",
  elemento: (item) => item?.elemento || (
    item?.tecnologia
      ? `Tecnología (${item.tecnologia})`
      : item?.material_didactico
        ? `Material didáctico (${item.material_didactico})`
        : "—"
  ),
}

const PrestamoElementos = () => {
  const {rol} = useOutletContext();
  
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const fetchPrestamos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall("prestamos"); 
      
      if (rol == "ADM"){
        if (response && Array.isArray(response.results)) {
          const activos = response.results.filter(p => !p.fecha_devolucion);
          setPrestamos(activos);
        } else {
          console.warn("La respuesta de la API no contiene una lista válida en .results.");
          setPrestamos([]);
        }
        }  else {
          if (rol == "INS"){
            if (response && Array.isArray(response.results)){
              const activos_user = response.results.filter(p => String(p.solicitante) == String(firstname + " " + lastName) && !p.fecha_devolucion);
              setPrestamos(activos_user);
            }
          } else{
            return ("rol no encontrado")
          }
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
  // Función para refrescar la tabla después de una acción
  const handleSuccessAction = () => {
    fetchPrestamos();
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>
  }

  if (rol == "ADM"){
    return (
      <div className="container py-5">
      <Titulo titulo="Gestionar Prestamos" descripcion="En este apartado podras buscar elementos prestados o prestar elementos" /> 
      {/* Zona de opciones (Prestar / Devolver) */}
      <div className="options-layout-centered">
        {options.map((opt, index) => (
          <div className="card-option-col" key={index}>
            <div className="card h-100"> 
              <div className="card-body-theme">
                <div>
                  <h4 className="card-custom-title">{opt.title}</h4> 
                  <p className="card-custom-text">{opt.description}</p>
                </div>
                
                {/* Condicional para Devolución */}
                <div className="d-grid mt-3">
                  {opt.key === 'devolucion' ? (
                    // Si es 'Devolucion', renderizamos el componente con la lógica de búsqueda/devolución
                    <ReturnForm onSuccess={handleSuccessAction} />
                  ) : (
                    <Button onClick={() => handleAction(opt)} className="btn primary">
                      Seleccionar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="mt-5">
        <Tabla
          data={prestamos}
          headers={header}
          campos={campos}
          title="Préstamos Activos"
          apiEndpoint="prestamos" 
          onDataChange={fetchPrestamos} 
        />
      </div>
    </div>
    )

  }else{
    if (rol == "INS"){
      return (
        <div className="container py-5">
          <Titulo titulo="Gestionar Prestamos" descripcion="En este apartado podras ver tus elementos prestados" />

          <div className="mt-5">
        <Tabla
          data={prestamos}
          headers={header}
          campos={campos}
          title="Préstamos Activos"
          apiEndpoint="prestamos" 
          onDataChange={fetchPrestamos} 
        />
      </div>
        </div>
      )
    }
  }
  
}

export default PrestamoElementos;