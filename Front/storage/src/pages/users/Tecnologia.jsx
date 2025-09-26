import React, { useState, useEffect, useCallback } from "react"; // 1. Importar 'useCallback'
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
  {
    title: "Generar QR de un elemento Tecnologico",
    description: "Genera un QR para un elemento tecnologico existente en el sistema.",
    key: "generar_qr_tecnologia",
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
  tipo: "tipo", // Asumimos que el serializador devuelve el nombre del tipo
  serie_fabricante: "serie_fabricante",
  serie_sena: "serie_sena",
  estado: "estado",
  marca: "marca", // Asumimos que el serializador devuelve el nombre de la marca
}

const TecnologiaManager = () => {
  const [tecnologias, setTecnologias] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Encapsulamos la lógica de carga en una función useCallback
  const fetchTecnologias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall("tecnologias"); // <-- El endpoint es 'tecnologias'
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
  }, []); // No tiene dependencias externas

  useEffect(() => {
    // Llamada inicial a la función de carga
    fetchTecnologias();
  }, [fetchTecnologias]); // Dependencia: fetchTecnologias (asegura que se llama solo una vez al inicio)

  if (loading) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

  return (
    <div>
      <Titulo titulo="Gestión de Tecnologías" descripcion="En esta sección podras registrar elementos tecnologicos" />

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
          data={tecnologias}
          headers={headers}
          campos={campos}
          title="Tecnologías"
          // 2. Props para habilitar los botones de acción
          apiEndpoint="tecnologias" // <-- Endpoint para la API (GET, PUT, DELETE)
          onDataChange={fetchTecnologias} // <-- Función para recargar la tabla después de una acción
        />
      </div>
    </div>
  );
};

export default TecnologiaManager;