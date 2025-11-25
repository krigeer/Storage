import React, { useState, useEffect, useCallback } from "react";
import Titulo from "../../components/UI/Titulo";
import Button from "../../components/UI/Button";
import Tabla from "../../components/UI/Tabla";
import handleAction from "../../components/UI/Form";
import { apiCall } from "../../services/apiCutoms";
import ReturnForm from "../../components/UI/ReturnForm";
import { useOutletContext } from "react-router-dom";
import { getUser } from "../../services/authContext.js";



const options = [
  { title: "Prestar", description: "Prestar un elemento", key: "prestamos" },
  { title: "Devolucion", description: "Devolver un prestamo", key: "devolucion" },
];

const header = {
  solicitante: "Solicitante",
  elemento: "Elemento",
};

const campos = {
  solicitante: "solicitante",
  elemento: (item) =>
    item?.elemento ||
    (item?.tecnologia ? `Tecnología (${item.tecnologia})`
      : item?.material_didactico ? `Material didáctico (${item.material_didactico})`
      : "—"),
};

const PrestamoElementos = () => {
  // estados para el usuario
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);

  const { rol } = useOutletContext();

  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      const u = getUser?.(); 
      if (u) {
        setFirstName(u.first_name ?? "");
        setLastName(u.last_name ?? "");
      } else {
        
        setFirstName("");
        setLastName("");
      }
    } catch (err) {
      console.warn("No se pudo obtener el user:", err);
      setFirstName("");
      setLastName("");
    }
  }, []);

  const fetchPrestamos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall("prestamos");

      if (rol === "ADM") {
        if (response && Array.isArray(response.results)) {
          const activos = response.results.filter((p) => !p.fecha_devolucion);
          setPrestamos(activos);
        } else {
          console.warn("La respuesta de la API no contiene una lista válida en .results.");
          setPrestamos([]);
        }
      } else if (rol === "INS") {
      
        if (!first_name && !last_name) {
          
          setPrestamos([]);
        } else {
          if (response && Array.isArray(response.results)) {
            const nombreCompleto = `${first_name} ${last_name}`.trim();
            const activos_user = response.results.filter(
              (p) => String(p.solicitante) === String(nombreCompleto) && !p.fecha_devolucion
            );
            setPrestamos(activos_user);
          } else {
            console.warn("La respuesta de la API no contiene una lista válida en .results.");
            setPrestamos([]);
          }
        }
      } else {
        console.warn("rol no encontrado:", rol);
        setPrestamos([]);
      }
    } catch (error) {
      console.error("Error obteniendo los datos:", error);
      setPrestamos([]);
    } finally {
      setLoading(false);
    }

  }, [rol, first_name, last_name]);

  useEffect(() => {
    fetchPrestamos();
  }, [fetchPrestamos]);

  const handleSuccessAction = () => {
    fetchPrestamos();
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  if (rol === "ADM") {
    return (
      <div className="container py-5">
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
                    {opt.key === "devolucion" ? (
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
        <div className="mt-5">
          <Tabla data={prestamos} headers={header} campos={campos} title="Préstamos Activos" apiEndpoint="prestamos" onDataChange={fetchPrestamos} />
        </div>
      </div>
    );
  } else if (rol === "INS") {
    return (
      <div className="container py-5">
        <Titulo titulo="Gestionar Prestamos" descripcion="En este apartado podras ver tus elementos prestados" />
        <div className="mt-5">
          <Tabla data={prestamos} headers={header} campos={campos} title="Préstamos Activos" apiEndpoint="prestamos" onDataChange={fetchPrestamos} />
        </div>
      </div>
    );
  }

  return null;
};

export default PrestamoElementos;
