import React from 'react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <h2>Página No Encontrada 😥</h2>
      <p>Lo sentimos, la dirección que has introducido no existe.</p>
      <a href="/" style={{ textDecoration: 'none', color: 'blue' }}>
        Volver a la página de inicio
      </a>
    </div>
  );
};

export default NotFound;