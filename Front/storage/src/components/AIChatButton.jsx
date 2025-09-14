import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import '../styles/AIChatButton.css';

const AIChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulse, setIsPulse] = useState(true);

  const handleClick = () => {
    // Aquí puedes agregar la lógica para abrir el chat
    console.log('Abrir chat de IA');
    setIsPulse(false);
  };

  return (
    <div 
      className={`ai-chat-button ${isHovered ? 'hovered' : ''} ${isPulse ? 'pulse' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <FaRobot className="ai-icon" />
      {isHovered && <span className="tooltip">Chat con IA</span>}
    </div>
  );
};

export default AIChatButton;
