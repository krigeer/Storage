

export const formConfigs = {
  "tipos_documentos": {
    title: "Registrar Tipo de Documento",
    fields: [
      { id: "nombre", placeholder: "Nombre del Tipo", type: "text" },
      { id: "simbolo", placeholder: "Simbolos", type: "text" },
    ],
  },
  "centros": {
    title: "Registrar Centros",
    fields: [
      { id: "nombre", placeholder: "Nombre del Centro", type: "text" },
      { id: "direccion", placeholder: "Código direccion del Centro", type: "text" },
      { id: "descripcion", placeholder: "Descripción del Centro", type: "text" },
    ],
  },
  "ubicaciones": {
    title: "Registrar Ubicación",
    fields: [
      { id: "nombre", placeholder: "Nombre de la Ubicación", type: "text" },
      { id: "descripcion", placeholder: "Descripción de la Ubicación", type: "text" },
      {
        id: "centro",
        placeholder: "Centro",
        type: "select",
        options: {
          endpoint: "centros",
          valueKey: "id",
          textKey: "nombre",
        }
      },
    ],
  },
  "tipos_tecnologia": {
    title: "Registrar Tipo de Tecnología",
    fields: [
      { id: "nombre", placeholder: "Nombre del Tipo", type: "text" },
    ],
  },
  "marcas": {
    title: "Registrar Marca",
    fields: [
      { id: "nombre", placeholder: "Nombre de la Marca", type: "text" },
    ],
  },
  "crear_usuarios": {
    title: "Registrar Usuario",
    fields: [
      { id: "first_name", placeholder: "Nombres", type: "text" },
      { id: "last_name", placeholder: "Apellidos", type: "text" },
      { id: "email", placeholder: "Correo Electronico", type: "email" },
      { id: "documento", placeholder: "Documento", type: "number" },
      { id: "tipo_documento", placeholder: "Tipo de Documento", type: "select", options: { endpoint: "tipos_documentos", valueKey: "id", textKey: "nombre" } },
      { id: "centro", placeholder: "Centro", type: "select", options: { endpoint: "centros", valueKey: "id", textKey: "nombre" } },
     { "id": "rol", "placeholder": "Rol", "type": "select", "options": { "endpoint": "roles", "valueKey": "id", "textKey": "nombre" } },
      { id: "contacto_principal", placeholder: "Contacto Principal", type: "number" },
      { id: "contacto_secundario", placeholder: "Contacto Secundario", type: "number" },
      { id: "estado", placeholder: "estado", type: "hidden", defaultValue: "ACT" },
    ],
  },
  "materiales_didacticos": {
    title: "Registrar Material Didáctico",
    fields: [
      { id: "descripcion", placeholder: "Descripción del Material", type: "text" },
      { id: "serie_fabricante", placeholder: "Serial fabricante", type: "text" },
      { id: "serie_sena", placeholder: "Serial SENA", type: "text" },
      { id: "cantidad", placeholder: "Cantidad", type: "number" },
      { id: "ubicacion_id", placeholder: "Ubicación", type: "hidden", defaultValue: "1" },
      { id: "estado", placeholder: "Estado", type: "hidden", defaultValue: "BUE" },
    ],
  },
  "tecnologias": {
    title: "Registrar Tecnologia",
    fields: [
      { id: "serie_fabricante", placeholder: "Serial fabricante", type: "text" },
      { id: "serie_sena", placeholder: "Serial SENA", type: "text" },
      { id: "ubicacion_id", placeholder: "Ubicación", type: "hidden", defaultValue: "1" },
      { id: "estado_id", placeholder: "Estado", type: "hidden", defaultValue: "BUE" },
      { id: "tipo_id", placeholder: "Tipo", type: "select", options: { endpoint: "tipos_tecnologia", valueKey: "id", textKey: "nombre" } },
      { id: "marca_id", placeholder: "Marca", type: "select", options: { endpoint: "marcas", valueKey: "id", textKey: "nombre" } },
      {id: "cpu", placeholder:"Generacion CPU", type:"number"},
      {id: "ram", placeholder:"Cantidad RAM GB", type:"number"},
      {id: "disco", placeholder:"Capacidad Disco GB", type:"number"}
    ],
  },
  "reportes": {
    title: "Registrar Tecnologia",
    fields: [
      { id: "titulo", placeholder: "Titulo", type: "text" },
      { id: "observacion", placeholder: "Observacion", type: "text",  rows: 80},
      { id: "estado", placeholder: "Ubicación", type: "hidden", defaultValue: "NUE" },
      { id: "prioridad", placeholder: "Estado", type: "hidden", defaultValue: "B" },
      { id: "tipo", placeholder: "Tipo", type: "hidden", defaultValue: "TEC"},
      { id: "usuario", type: "hidden", defaultValueFn: "currentUserId" }

    ],
  },
  "prestamos": {
    title: "Registrar Préstamo",
    fields: [
      { id: "solicitante_id", placeholder: "Usuario (Documento)", type: "select", options: { endpoint: "usuarios", valueKey: "id", textKey: "documento" } }, 
      { id: "material_didactico_id", placeholder: "Serial Material Didáctico", type: "select", options: { endpoint: "materiales_didacticos", valueKey: "id", textKey: "serie_fabricante" }, allowEmpty: true }, 
      { id: "tecnologia_id", placeholder: "Serial Tecnología", type: "select", options: { endpoint: "tecnologias", valueKey: "id", textKey: "serie_fabricante" }, allowEmpty: true }, 
      { id: "observacion", placeholder: "Observación", type: "text" }, 
    ],
  },
  "devolucion":{
    title: "Devolver Préstamo",
    fields: [
      { id: "solicitante_id", placeholder: "Usuario (Documento)", type: "select", options: { endpoint: "usuarios", valueKey: "id", textKey: "documento" } }, 
      { id: "material_didactico_id", placeholder: "Serial Material Didáctico", type: "select", options: { endpoint: "materiales_didacticos", valueKey: "id", textKey: "serie_fabricante" }, allowEmpty: true }, 
      { id: "tecnologia_id", placeholder: "Serial Tecnología", type: "select", options: { endpoint: "tecnologias", valueKey: "id", textKey: "serie_fabricante" }, allowEmpty: true }, 
      { id: "observacion", placeholder: "Observación", type: "text" }, 
    ],
  }
};