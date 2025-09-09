import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSignInAlt, FaGraduationCap, FaUsers, FaCertificate } from 'react-icons/fa';

export default function SenaSplitScreenLogin() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
        
        if (!formData.username.trim()) {
            newErrors.username = 'El usuario es requerido';
        }
        
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Datos de inicio de sesión:', formData);
        } catch (error) {
            setErrors({ general: 'Error al iniciar sesión. Intenta nuevamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 via-green-700 to-green-600 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="grid grid-cols-6 gap-4 transform rotate-12 scale-150">
                            {[...Array(42)].map((_, i) => (
                                <div key={i} className="w-8 h-8 bg-white rounded-full opacity-20"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
                    {/* SENA Logo */}
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
                            <img 
                                src="https://www.sena.edu.co/Style%20Library/alayout/images/logoIconal.png" 
                                alt="SENA Logo" 
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">SENA</h1>
                        <p className="text-xl text-green-100">Servicio Nacional de Aprendizaje</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-6 max-w-md">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <FaGraduationCap className="text-white text-xl" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-lg">Educación de Calidad</h3>
                                <p className="text-green-100 text-sm">Programas técnicos y tecnológicos certificados</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <FaUsers className="text-white text-xl" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-lg">Comunidad Activa</h3>
                                <p className="text-green-100 text-sm">Miles de estudiantes y instructores conectados</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <FaCertificate className="text-white text-xl" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-lg">Certificación Nacional</h3>
                                <p className="text-green-100 text-sm">Títulos reconocidos en todo el territorio colombiano</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold">117</div>
                            <div className="text-green-100 text-sm">Centros de Formación</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">+1M</div>
                            <div className="text-green-100 text-sm">Aprendices Activos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">50+</div>
                            <div className="text-green-100 text-sm">Años de Experiencia</div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full opacity-20 transform translate-x-16 translate-y-16"></div>
                <div className="absolute top-1/4 right-8 w-16 h-16 bg-white rounded-full opacity-10"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <img 
                                src="https://www.sena.edu.co/Style%20Library/alayout/images/logoIconal.png" 
                                alt="SENA Logo" 
                                className="w-10 h-10 object-contain filter brightness-0 invert"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido a SENA</h2>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
                            <p className="text-gray-600">Accede a tu plataforma educativa</p>
                        </div>

                        {/* Error general */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-700 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-6">
                            {/* Username field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                                            errors.username 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                                        }`}
                                        placeholder="Ingresa tu usuario"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                                            errors.password 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                                        }`}
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" />
                                    <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                                </label>
                                <a 
                                    href="#forgot-password" 
                                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                                >
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

                            {/* Submit button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-white font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    <>
                                        <FaSignInAlt className="h-5 w-5 mr-3" />
                                        Iniciar Sesión
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Register link */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600">
                                ¿Eres nuevo en SENA?{' '}
                                <a 
                                    href="#register" 
                                    className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                                >
                                    Crear cuenta
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            © 2024 SENA - Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}