import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import AIChatBox from './/AIChatBox';
import '../styles/AIChatButton.css';

const AIChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulse, setIsPulse] = useState(true);
  // Nuevo estado para controlar si el chat está abierto o cerrado
  const [isChatOpen, setIsChatOpen] = useState(false); // 👈 NUEVO ESTADO

  const handleClick = () => {
    // 1. Alternar la visibilidad del chat
    setIsChatOpen(!isChatOpen); // 👈 Lógica para abrir/cerrar
    
    // 2. Desactivar el pulso la primera vez que se abre
    setIsPulse(false);

    console.log(isChatOpen ? 'Cerrar chat de IA' : 'Abrir chat de IA');
  };

  return (
    <>
      {/* -------------------- BOTÓN FLOTANTE -------------------- */}
      <div 
        className={`ai-chat-button ${isHovered ? 'hovered' : ''} ${isPulse ? 'pulse' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <FaRobot className="ai-icon" />
        {isHovered && <span className="tooltip">Chat con IA</span>}
      </div>
      
      {/* -------------------- CHAT FLOTANTE -------------------- */}
      {/* Se renderiza solo si isChatOpen es true */}
      {isChatOpen && (
        <AIChatBox 
          // Pasamos una función para que el chat se pueda cerrar a sí mismo
          onClose={() => setIsChatOpen(false)} 
          // Aquí pasarías la API de la IA o el contexto necesario
          // apiEndpoint="tu-url-de-api-ia" 
        />
      )}
    </>
  );
};

export default AIChatButton;