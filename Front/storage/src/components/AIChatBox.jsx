import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { callGeminiChatApi } from '../services/apiService';

const AIChatBox = ({ onClose }) => {
  // historial de mensajes
  const [messages, setMessages] = useState([
    { sender: 'AI', text: '¡Hola! Soy tu asistente de inventario. Pregúntame sobre el estado de los reportes, la ubicación de activos o los préstamos recientes.' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // auto-scroll

  // scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ejecutar scroll cada vez que los mensajes cambian
  useEffect(scrollToBottom, [messages]);
  
  const callAIApi = async (text) => {
    const dataToSend = { prompt: text };
    const responseData = await callGeminiChatApi(dataToSend);
    return responseData.response; 
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageToSend = inputMessage.trim();
    if (messageToSend === '' || isLoading) return;

    const userMessage = { sender: 'User', text: messageToSend };
    
    // Agregar el mensaje del usuario al chat y limpiar input
    setMessages(prev => [...prev, userMessage]);
    setInputMessage(''); 

    // Llamar a la API de IA
    setIsLoading(true);
    
    try {
      const aiResponseText = await callAIApi(messageToSend);
      const aiResponse = { sender: 'AI', text: aiResponseText };
      
      // Agregar la respuesta de la IA
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage = error.message || 'Lo siento, hubo un error al conectar con la IA.';
      console.error("Error al llamar a la API de IA:", error);
      setMessages(prev => [...prev, { sender: 'AI', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-box">
      <div className="chat-header">
        <h3>Tu Asistente Naira</h3>
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
        <div ref={messagesEndRef} /> 
      </div>
      
      <form className="chat-footer" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Ej: ¿Cuántos activos hay en el Centro A?"
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