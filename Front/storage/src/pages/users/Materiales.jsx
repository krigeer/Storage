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
  {
    title: "Generar QR de un Material",
    description: "Genera un QR para un Material existente en el sistema.",
    key: "generar_qr_material", // Cambiado de 'generar_qr_tecnologia' a 'generar_qr_material' por consistencia
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
  estado: "estado",
}

const MaterialDidacticoManager = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Encapsular la lógica de carga en una función useCallback
  const fetchMateriales = useCallback(async () => {
    try {
      setLoading(true);
      // El endpoint para la API es "materiales_didacticos"
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
    // Llamada inicial a la función de carga
    fetchMateriales();
  }, [fetchMateriales]) // Dependencia: fetchMateriales

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo titulo="Gestión de Materiales Didácticos" descripcion="En esta sección podras registrar elementos no tecnologicos" />

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
        <Tabla
          data={materiales}
          headers={headers}
          campos={campos}
          title="Materiales Didácticos"
          // 2. Props para habilitar los botones de acción
          apiEndpoint="materiales_didacticos" // <-- Endpoint para la API
          onDataChange={fetchMateriales} // <-- Función para recargar la tabla
        />
      </div>
    </div>
  );
};

export default MaterialDidacticoManager;