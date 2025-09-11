import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Clear any existing content
const container = document.getElementById('root');
container.innerHTML = '';

// Create a root.
const root = createRoot(container);

// Initial render
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// Log any errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});
