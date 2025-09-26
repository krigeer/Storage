import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import Icon from '../assets/img/cgti.png';

function Recordar_contrasena() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }

        setIsLoading(true);

        try {
            // Aquí iría la llamada a tu API para recuperar la contraseña
            // Simulación de llamada API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success('Se ha enviado un enlace de recuperación a tu correo');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            // Ejemplo de manejo de error (sustituir por lógica de API real)
            toast.error('Error al enviar el correo. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1. Contenedor principal: Centra el contenido vertical y horizontalmente
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 sm:pt-12 pb-12">
            
            {/* Contenido centrado que no es el Footer */}
            <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                
                {/* Logo y Encabezado */}
                <div className="w-full">
                    <div className="flex justify-center">
                        <img
                            className="h-16 w-auto"
                            src={Icon}
                            alt="Logo SENA"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Recuperar contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>

                {/* Contenedor del Formulario (Tarjeta) */}
                <div className="mt-8 w-full bg-white py-8 px-4 shadow rounded-lg sm:px-10"> {/* Añadido rounded-lg y sm:px-10 para mejor estética y responsividad */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="mb-4"> {/* Ajustado a mb-4 para un espaciado más estándar */}
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    // Clases de input optimizadas
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                                    isLoading 
                                        ? 'bg-green-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-2 h-5 w-5" />
                                        Enviar enlace de recuperación
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Botón de Volver */}
                    <div className="mt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full flex justify-center items-center text-sm text-gray-600 hover:text-green-600 transition duration-150 ease-in-out" // Color hover mejorado
                        >
                            <FaArrowLeft className="mr-2 h-4 w-4" />
                            Volver al inicio de sesión
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full">
                <Footer />
            </div>
        </div>
    );
}

export default Recordar_contrasena;