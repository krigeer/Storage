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
  "tipos_tecnologia":{
    title: "Registrar Tipo de Tecnología",
    fields: [
      { id: "nombre", placeholder: "Nombre del Tipo", type: "text" },
    ],
  },
  "marcas":{
    title: "Registrar Marca",
    fields: [
      { id: "nombre", placeholder: "Nombre de la Marca", type: "text" },
    ],
  },
  "crear_usuarios":{
    title: "Registrar Usuario",
    fields: [
      { id: "username", placeholder: "Nombre de Usuario", type: "text", readOnly: true },
      { id: "first_name", placeholder: "Nombres", type: "text" },
      { id: "last_name", placeholder: "Apellidos", type: "text" },
      { id: "email", placeholder: "Correo Electronico", type: "email" },
      { id: "documento", placeholder: "Documento", type: "number" },
      { id: "tipo_documento", placeholder: "Tipo de Documento", type: "select", options: { endpoint: "tipos_documentos", valueKey: "id", textKey: "nombre" } },
      { id: "centro", placeholder: "Centro", type: "select", options: { endpoint: "centros", valueKey: "id", textKey: "nombre" } },
      { id: "rol", placeholder: "Rol", type: "select", options: { endpoint: "roles", valueKey: "id", textKey: "nombre" } },
      {id: "contacto_principal", placeholder: "Contacto Principal", type: "number"},
      {id: "contacto_secundario", placeholder: "Contacto Secundario", type: "number"},
      {id: "estado", placeholder: "estado", type: "hidden", defaultValue: "activo"},
    ],
  },
  "materiales_didacticos":{
    title: "Registrar Material Didáctico",
    fields: [
      { id: "nombre", placeholder: "Nombre del Material", type: "text" },
      { id: "descripcion", placeholder: "Descripción del Material", type: "text" },
      { id: "serie_fabricante", placeholder: "Serial fabricante", type: "text" },
      { id: "serie_sena", placeholder: "Serial SENA", type: "text" },
      { id: "cantidad", placeholder: "Cantidad", type: "number" },
      { id: "ubicacion", placeholder: "Ubicación", type: "select", options: { endpoint: "ubicaciones", valueKey: "id", textKey: "nombre" } },
      { id: "estado", placeholder: "Estado", type: "select", options: { endpoint: "estados_inventario", valueKey: "id", textKey: "nombre" } },
    ],
  },
  "tecnologias":{
    title: "Registrar Tecnologia",
    fields: [
      { id: "nombre", placeholder: "Identificador de la Tecnologia", type: "text" },
      { id: "descripcion", placeholder: "Descripción de la Tecnologia", type: "text" },
      { id: "serie_fabricante", placeholder: "Serial fabricante", type: "text" },
      { id: "serie_sena", placeholder: "Serial SENA", type: "text" },
      { id: "caracteristicas", placeholder: "Caracteristicas", type: "text" },
      { id: "ubicacion", placeholder: "Ubicación", type: "select", options: { endpoint: "ubicaciones", valueKey: "id", textKey: "nombre" } },
      { id: "estado", placeholder: "Estado", type: "select", options: { endpoint: "estados_inventario", valueKey: "id", textKey: "nombre" } },
      { id: "tipo", placeholder: "Tipo", type: "select", options: { endpoint: "tipos_tecnologia", valueKey: "id", textKey: "nombre" } },
      { id: "marca", placeholder: "Marca", type: "select", options: { endpoint: "marcas", valueKey: "id", textKey: "nombre" } },
    ],
  },
  "seleccion":{
    title: "Registrar Préstamo",
    fields: [
      { id: "usuario", placeholder: "Documento del Usuario", type: "select", options: { endpoint: "usuarios", valueKey: "id", textKey: "username"}},
      { id: "material_didactico", placeholder: "Serial Material Didáctico", type: "select", options: { endpoint: "materiales_didacticos", valueKey: "id", textKey: "nombre" }},
      { id: "tecnologia", placeholder: "Serial Tecnología", type: "select", options: { endpoint: "tecnologias", valueKey: "id", textKey: "nombre" }},
      { id: "fecha_prestamo", placeholder: "Fecha de Préstamo", type: "date" },
      { id: "estado", placeholder: "Estado del Préstamo", type: "select", options: { endpoint: "estados_prestamos", valueKey: "id", textKey: "nombre" } },
    ],
  },
  };