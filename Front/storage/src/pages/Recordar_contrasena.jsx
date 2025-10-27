import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {recordad_contrasena} from '../services/apiService';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import Icon from '../assets/img/cgti.png';

function Recordar_contrasena() {
    const [documento, setDocumento] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!documento.trim()) {
      toast.warning('Por favor, ingresa tu número de documento.');
      return;
    }

    setIsLoading(true);

    const data = { documento };
    const response = await recordad_contrasena('recordar_contrasena', data);

  
    const message =
      response?.data?.detail || 
      response?.detail ||       
      response?.data?.message || 
      'Solicitud procesada.';


    if (message.includes('recibirá un correo')) {
      await Swal.fire({
        icon: 'success',
        title: '¡Enlace enviado!',
        text: message,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });

      setDocumento('');
    } else {
      toast.error(message);
    }
  } catch (error) {
    const mensajeError =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Error al enviar el enlace. Intenta nuevamente.';

    toast.error(mensajeError);
  } finally {
    setIsLoading(false);
  }
};

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 sm:pt-12 pb-12">
            
            <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                
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
                        Ingresa tu documento y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>

                <div className="mt-8 w-full bg-white py-8 px-4 shadow rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="mb-4"> 
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Documento
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="documento"
                                    name="documento"
                                    type="number"
                                    autoComplete="document"
                                    required
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
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