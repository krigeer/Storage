import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { callGeminiChatApi } from '../services/apiService';

// IMPORTACIONES PARA EL FORMATO MARKDOWN
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm'; // Para soporte de tablas, listas de tareas, etc.

const AIChatBox = ({ onClose }) => {
    // Historial de mensajes
    const [messages, setMessages] = useState([
        { sender: 'AI', text: '¡Hola! Soy tu asistente de inventario. Pregúntame sobre el estado de los reportes, la ubicación de activos o los préstamos recientes.' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null); // auto-scroll

    // Scroll al final de los mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Ejecutar scroll cada vez que los mensajes cambian
    useEffect(scrollToBottom, [messages]);
    
    const callAIApi = async (text) => {
        const dataToSend = { prompt: text };
        const responseData = await callGeminiChatApi(dataToSend);
        // Asegúrate de que la API de Django devuelva { "response": "texto_markdown" }
        return responseData.response; 
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const messageToSend = inputMessage.trim();
        if (messageToSend === '' || isLoading) return;

        const userMessage = { sender: 'User', text: messageToSend };
        
        // 1. Agregar el mensaje del usuario al chat y limpiar input
        setMessages(prev => [...prev, userMessage]);
        setInputMessage(''); 

        // 2. Llamar a la API de IA
        setIsLoading(true);
        
        try {
            const aiResponseText = await callAIApi(messageToSend);
            const aiResponse = { sender: 'AI', text: aiResponseText };
            
            // 3. Agregar la respuesta de la IA
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
                        {/* CONDICIÓN CLAVE: 
                          Si es mensaje de la AI, renderizamos con ReactMarkdown.
                          Si es del Usuario, lo dejamos como texto simple (o puedes usar Markdown también si quieres).
                        */}
                        {msg.sender === 'AI' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text}
                            </ReactMarkdown>
                        ) : (
                            <p>{msg.text}</p>
                        )}
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