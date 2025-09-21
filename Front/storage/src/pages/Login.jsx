import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { login } from '../services/authService';
import Logo from '../assets/img/cgti.png';

export default function SenaSplitScreenLogin() {
    const [formData, setFormData] = useState({
        documento: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.documento.trim()) {
            newErrors.documento = 'El usuario es requerido';
        }else if(formData.documento.length > 20){
            newErrors.documento = 'Documento no valido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            await login({
                documento: formData.documento,
                password: formData.password
            });

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/dashboard');

        } catch (error) {

            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.',
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecordarContrasena = (e) => {
        e.preventDefault();
        navigate('/recordar-contrasena', { replace: true });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 to-green-600 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 gap-4 h-full p-8">
                        {[...Array(64)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-white rounded-full opacity-30"></div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex items-center justify-center w-full p-12">
                    <div className="text-center text-white">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <img
                                src={Logo}
                                alt="SENA Logo"
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-bold mb-3">SENA</h1>
                        <p className="text-xl text-green-100">Servicio Nacional de Aprendizaje</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                   

                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <img
                                src={Logo}
                                alt="SENA Logo"
                                className="w-8 h-8 object-contain brightness-0 invert"
                            />
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingresar</h2>
                            <p className="text-gray-600">Accede a tu plataforma de Inventario</p>
                        </div>

                        {/* Error general */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                <p className="text-red-700 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* documento field */}
                            <div className='mb-8'>
                                <label htmlFor="documento" className="ms-3 block text-sm font-medium text-gray-700 mb-2" dir="ltr">
                                    Usuario
                                </label>
                                <div className="relative w-90 m-auto ">
                                    <div 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        style={{ zIndex: 10 }}
                                    >
                                        <FaUser style={{ width: '16px', height: '16px' }} />
                                    </div>
                                    <input
                                        id="documento"
                                        name="documento"
                                        type="number"
                                        value={formData.documento}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                                        className={`w-full border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.documento
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 focus:border-green-500'
                                            }`}
                                        
                                    />
                                </div>
                                {errors.documento && (
                                    <p className="mt-2 text-sm text-red-600">
                                        ⚠️ {errors.documento}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div className='mb-8'>
                                <label htmlFor="password"  className="ms-3 block text-sm font-medium text-gray-700" dir="ltr">
                                    Contraseña
                                </label>
                                <div className="relative  w-90 m-auto">
                                    <div 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        style={{ zIndex: 10 }}
                                    >
                                        <FaLock style={{ width: '16px', height: '16px' }} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '2.5rem', paddingRight: '3rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                                        className={`w-full border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.password
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 focus:border-green-500'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        style={{ zIndex: 10 }}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash style={{ width: '16px', height: '16px' }} />
                                        ) : (
                                            <FaEye style={{ width: '16px', height: '16px' }} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        ⚠️ {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between text-sm mb-20">
                                <label className="ms-3 flex items-center" dir="ltr">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" 
                                    />
                                    <span className="text-gray-600">Recordar</span>
                                </label>
                               
                            </div>

                            {/* Submit button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-90 m-auto  bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center "
                            >
                                {isLoading ? (
                                    <div className="flex items-center mb-10">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <FaSignInAlt className="mr-3" style={{ width: '16px', height: '16px' }} />
                                        Iniciar Sesión
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Support link */}
                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-600">
                                ¿Necesitas ayuda?{' '}
                                <button
                                    type="button"
                                    onClick={handleRecordarContrasena}
                                    className="font-medium text-green-600 hover:text-green-700 bg-transparent border-none cursor-pointer p-0 focus:outline-none"
                                >
                                    Recordar contraseña
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}