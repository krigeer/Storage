import React, { useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
// Asumiendo que has creado un archivo CSS llamado AIChatBox.css

const AIChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'AI', text: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función simulada para llamar a tu API de IA
  const callAIApi = async (text) => {
    // 💡 Aquí es donde integrarías tu API real
    // Reemplaza esta simulación con una llamada a fetch o axios a tu endpoint.
    
    // Ejemplo de simulación de respuesta
    const simulatedResponse = `Entendido. Tu mensaje "${text}" ha sido procesado por la IA.`;
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(simulatedResponse);
      }, 1000); // Simula un retraso de 1 segundo de la API
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage = { sender: 'User', text: inputMessage };
    
    // 1. Agregar el mensaje del usuario al chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage(''); // Limpiar el input

    // 2. Llamar a la API de IA
    setIsLoading(true);
    
    try {
      const aiResponseText = await callAIApi(inputMessage.trim());
      const aiResponse = { sender: 'AI', text: aiResponseText };
      
      // 3. Agregar la respuesta de la IA
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error al llamar a la API de IA:", error);
      setMessages(prev => [...prev, { sender: 'AI', text: 'Lo siento, hubo un error al conectar con la IA.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-box">
      <div className="chat-header">
        <h3>Asistente de IA</h3>
        <button onClick={onClose} className="close-button">
          <FaTimes />
        </button>
      </div>
      
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <div className="loading-indicator">La IA está escribiendo...</div>}
      </div>
      
      <form className="chat-footer" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || inputMessage.trim() === ''}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default AIChatBox;