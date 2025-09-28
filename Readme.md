📦 Proyecto de Inventario

Este proyecto es una aplicación web para la gestión de inventario de equipos y recursos, construida con:

Backend (API): Django + Django REST Framework

Frontend: React + Vite

Base de datos: configurada en Django (ejemplo: PostgreSQL, MySQL o SQLite en desarrollo)

El sistema permite registrar, consultar, actualizar y eliminar elementos de inventario, con control de accesos y reglas de negocio personalizadas.

⚙️ Estructura del Proyecto
🖥️ Backend (Django API)

mi_proyecto/
├── api/
│   ├── models.py          # Modelos de base de datos (ORM)
│   ├── serializers.py     # Serialización y validación de datos
│   ├── views.py           # Controladores de solicitudes HTTP
│   ├── urls.py            # Rutas específicas de la API
│   ├── services.py        # Lógica de negocio
│   ├── permissions.py     # Reglas de acceso personalizadas
│   └── authentication.py  # Autenticación personalizada (opcional)
│
├── mi_proyecto/           # Configuración global del proyecto Django
│   ├── settings.py        # Configuración (DB, JWT, apps, etc.)
│   ├── urls.py            # Rutas principales del backend
│   └── wsgi.py            # Configuración para despliegue
│
├── manage.py
├── requirements.txt        # Dependencias del backend
└── .env                    # Variables de entorno (credenciales, secretos, etc.)


🔄 Flujo de una petición (ejemplo POST /api/tareas/):

urls.py: Detecta la ruta.

views.py: Decide la acción y usa serializer.

serializers.py: Valida los datos recibidos.

services.py: Aplica lógica de negocio (si aplica).

models.py: Guarda/lee de la base de datos.

permissions.py: Verifica permisos de usuario.

views.py: Devuelve la respuesta (ejemplo: 201 Created o 403 Forbidden).

my-react-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/         # Imágenes, estilos globales, fuentes
│   ├── components/     # Componentes reutilizables (Botones, Cards, etc.)
│   ├── pages/          # Vistas principales (Home, Dashboard, etc.)
│   ├── services/       # Lógica para consumir APIs (fetch/axios)
│   ├── hooks/          # Custom hooks (ej. useFetch, useAuth)
│   ├── context/        # Context API para manejo de estado global
│   ├── utils/          # Funciones auxiliares
│   ├── App.jsx
│   └── main.jsx
├── .env                # Variables de entorno (ej. URL de la API)
├── package.json        # Dependencias frontend
└── README.md


🌐 Frontend (React)
my-react-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/         # Imágenes, estilos globales, fuentes
│   ├── components/     # Componentes reutilizables (Botones, Cards, etc.)
│   ├── pages/          # Vistas principales (Home, Dashboard, etc.)
│   ├── services/       # Lógica para consumir APIs (fetch/axios)
│   ├── hooks/          # Custom hooks (ej. useFetch, useAuth)
│   ├── context/        # Context API para manejo de estado global
│   ├── utils/          # Funciones auxiliares
│   ├── App.jsx
│   └── main.jsx
├── .env                # Variables de entorno (ej. URL de la API)
├── package.json        # Dependencias frontend
└── README.md

📦 Dependencias recomendadas:
npm install bootstrap @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons aos


🧪 Pruebas de rendimiento y calidad

El proyecto debe someterse a pruebas manuales y automatizadas para garantizar su correcto funcionamiento.

✅ Actividades:

Diseñar y documentar 20 casos de prueba (Excel).

Realizar una presentación explicando el tipo de pruebas asignado:

Conceptualización

Aplicación en el desarrollo de software

Ejemplos prácticos (manuales y automatizados)

Elaborar un informe de pruebas (Word) con resultados y conclusiones.



🚀 Despliegue

Backend: Puede desplegarse en Heroku, Render, Railway o servidores con WSGI.

Frontend: Desplegable en Vercel o Netlify (recuerda configurar redirecciones para React Router).