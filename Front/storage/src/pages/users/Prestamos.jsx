import React, { useState, useEffect, useCallback } from "react"; 
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";
import ReturnForm from "../../components/UI/ReturnForm";
import {useOutletContext} from "react-router-dom";


const options = [
  { title: "Prestar", description: "Prestar un elemento", key: "prestamos" },
  { title: "Devolucion", description: "Devolver un prestamo", key: "devolucion" },
]

const header = {
  solicitante: "Solicitante",
  observacion: "Observacion",
  elemento: "Elemento",
}

const campos = {
  solicitante: "solicitante",
  observacion: "observacion",
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
  const {documentoUser} = useOutletContext();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Función para obtener préstamos 
  const fetchPrestamos = useCallback(async () => {
    try {
      setLoading(true);
      // Pide todos los préstamos para la tabla principal
      const response = await apiCall("prestamos"); 
      
      if (rol == "ADM"){
        if (response && Array.isArray(response.results)) {
          // Filtra para mostrar solo los préstamos activos en la tabla de gestión
          const activos = response.results.filter(p => !p.fecha_devolucion);
          setPrestamos(activos);
        } else {
          console.warn("La respuesta de la API no contiene una lista válida en .results.");
          setPrestamos([]);
        }
        }  else {
          if (rol == "INST"){
            if (response && Array.isArray(response.results)){
              const activos = response.results.filter(p => p.documento = documentoUser )
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

  // Función para refrescar la tabla después de una acción (como la devolución)
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
                
                {/* 🎯 Lógica de Renderizado Condicional para Devolución */}
                <div className="d-grid mt-3">
                  {opt.key === 'devolucion' ? (
                    // Si es 'Devolucion', renderizamos el componente con la lógica de búsqueda/devolución
                    <ReturnForm onSuccess={handleSuccessAction} />
                  ) : (
                    // Si es 'Prestar', usamos el botón que ejecuta el formulario genérico
                    <Button onClick={() => handleAction(opt)} className="btn primary">
                      Seleccionar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div> {/* <--- Este es el cierre del div. Debe estar en la línea 105 o cercana */}

      {/* Tabla de préstamos activos */}
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
    if (rol == "INST"){
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