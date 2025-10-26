import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from "react-bootstrap";
// Nota: 'react-bootstrap' se mantiene para Spinner y Alert, pero el resto usa Tailwind con los colores del tema oscuro.

// --- Funciones mock para hacer el componente runnable en el canvas ---
// RECUERDA: Reemplaza estas con tus importaciones reales: getUser, updateUser.
const MOCK_CURRENT_USER = {
    id: 1,
    first_name: 'Ana',
    last_name: 'García Pérez',
    email: 'ana.g.perez@example.com',
    documento: 1017000123,
    rol: 'ADMIN',
    centro: { id: 1, nombre: 'Centro Regional 1' }, // Suponiendo que Centro es un objeto FK
    tipo_documento: { id: 1, nombre: 'CC' }, // Suponiendo que TipoDocumento es un objeto FK
    contacto_principal: 3101234567,
    contacto_secundario: 3009876543,
    estado: 'ACTIVO',
    contrasena_expira_en: '2025-12-31T23:59:59Z',
};
const getUser = () => MOCK_CURRENT_USER;
const updateUser = async (userId, data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular latencia de red
    console.log(`Usuario ${userId} actualizado con datos:`, data);
    return { 
        ...MOCK_CURRENT_USER, 
        first_name: data.first_name, 
        last_name: data.last_name,
        email: data.email,
        contacto_principal: data.contacto_principal,
        contacto_secundario: data.contacto_secundario,
        documento: data.documento,
    };
};
// --- Fin funciones mock ---


// Iconos SVG (Ajustados al color primario verde)
const IconWrapper = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#28a745] min-w-[20px]">{children}</svg>
);

const UserIcon = () => (<IconWrapper><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconWrapper>);
const MailIcon = () => (<IconWrapper><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></IconWrapper>);
const PhoneIcon = () => (<IconWrapper><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></IconWrapper>);
const IdCardIcon = () => (<IconWrapper><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></IconWrapper>);
const BriefcaseIcon = () => (<IconWrapper><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></IconWrapper>);
const MapPinIcon = () => (<IconWrapper><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></IconWrapper>);
const ActivityIcon = () => (<IconWrapper><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></IconWrapper>);
const ClockIcon = () => (<IconWrapper><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></IconWrapper>);
const EditIcon = () => (<IconWrapper><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></IconWrapper>);
const SaveIcon = () => (<IconWrapper><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></IconWrapper>);
const XIcon = () => (<IconWrapper><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconWrapper>);


// Helper component to render a field (Read-only or Editable)
const ProfileField = ({ icon, label, value, isEditing, fieldName, handleInputChange, type = 'text', readOnly = false }) => {
    const displayValue = (typeof value === 'object' && value !== null && value.nombre) ? value.nombre : value || 'N/A';
    
    // Color de texto claro por defecto
    const textColorClass = 'text-white';
    const mutedTextColorClass = 'text-[#8a97a7]';
    const borderColorClass = 'border-[#1f2937]';
    const focusRingClass = 'focus:ring-[#28a745] focus:border-[#28a745]';
    
    return (
        <div className={`flex flex-col md:flex-row md:items-center py-3 border-b ${borderColorClass}`}>
            <div className="flex items-center w-full md:w-1/3 mb-1 md:mb-0">
                {icon}
                <span className={`ml-3 font-medium ${mutedTextColorClass}`}>{label}:</span>
            </div>
            <div className="w-full md:w-2/3">
                {isEditing && !readOnly ? (
                    <input
                        type={type}
                        value={value || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className={`w-full border-2 ${borderColorClass} rounded-lg px-3 py-2 bg-[#1f2937] ${textColorClass} ${focusRingClass} outline-none transition duration-150`}
                        placeholder={label}
                    />
                ) : (
                    <span className={`font-semibold ml-3 md:ml-0 ${textColorClass} ${displayValue === 'N/A' ? 'italic text-gray-500' : ''}`}>
                        {displayValue}
                    </span>
                )}
            </div>
        </div>
    );
};


const PerfilUsuarioDark = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [editedInfo, setEditedInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Definición de colores principales
    const primaryGreen = '#28a745';
    const backgroundDark = '#11161d';
    const panelDark = '#1f2937';
    const textMuted = '#8a97a7';
    const textWhite = '#fff';

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        try {
            return new Date(isoString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'N/A';
        }
    };


    useEffect(() => {
        const currentUser = getUser();
        if (currentUser) {
            const userData = {
                id: currentUser?.id,
                firstName: currentUser?.first_name || '',
                lastName: currentUser?.last_name || '',
                email: currentUser?.email || '',
                documento: currentUser?.documento ? String(currentUser.documento) : '',
                rol: currentUser?.rol || 'N/A',
                centro: currentUser?.centro || 'N/A', 
                tipoDocumento: currentUser?.tipo_documento || 'N/A', 
                contactoPrincipal: currentUser?.contacto_principal ? String(currentUser.contacto_principal) : '',
                contactoSecundario: currentUser?.contacto_secundario ? String(currentUser.contacto_secundario) : '',
                estado: currentUser?.estado || 'N/A',
                contrasenaExpiraEn: currentUser?.contrasena_expira_en || null,
            };
            setUserInfo(userData);
            setEditedInfo(userData);
        }
    }, []);

    if (!userInfo) {
        return (
            <div className={`flex justify-center items-center h-full min-h-[400px] bg-[${backgroundDark}]`}>
                <Spinner animation="border" variant="success" className={`text-[${primaryGreen}]`} />
                <span className={`ml-2 text-[${textMuted}]`}>Cargando datos del usuario...</span>
            </div>
        );
    }

    const handleEdit = () => {
        setIsEditing(true);
        setEditedInfo({ ...userInfo });
        setError(null);
        setSuccess(false);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const dataToSend = {
                first_name: editedInfo.firstName,
                last_name: editedInfo.lastName,
                email: editedInfo.email,
                contacto_principal: editedInfo.contactoPrincipal,
                contacto_secundario: editedInfo.contactoSecundario || null,
                documento: editedInfo.documento,
            };

            const updatedUser = await updateUser(userInfo.id, dataToSend);
            
            const mergedUser = {
                ...userInfo,
                firstName: updatedUser?.first_name ?? editedInfo.firstName,
                lastName: updatedUser?.last_name ?? editedInfo.lastName,
                email: updatedUser?.email ?? editedInfo.email,
                contactoPrincipal: updatedUser?.contacto_principal != null ? String(updatedUser.contacto_principal) : editedInfo.contactoPrincipal,
                contactoSecundario: updatedUser?.contacto_secundario != null ? String(updatedUser.contacto_secundario) : editedInfo.contactoSecundario,
                documento: updatedUser?.documento != null ? String(updatedUser.documento) : editedInfo.documento,
            };

            setUserInfo(mergedUser);
            setEditedInfo(mergedUser);
            setSuccess(true);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            const apiError = err?.response?.data;
            if (apiError) {
                const errorMessages = Object.entries(apiError).map(([key, value]) => 
                    `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
                ).join('; ');
                setError(`Error de validación: ${errorMessages}`);
            } else {
                setError(err?.message || 'Error al actualizar el perfil. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedInfo({ ...userInfo });
        setIsEditing(false);
        setError(null);
        setSuccess(false);
    };

    const handleInputChange = (fieldName, value) => {
        setEditedInfo(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };
    
    const isPasswordExpired = userInfo.contrasenaExpiraEn && new Date() >= new Date(userInfo.contrasenaExpiraEn);

    return (
        // Contenedor principal con el fondo oscuro general
        <div className={`min-h-screen p-4 sm:p-8 flex justify-center items-start bg-[${backgroundDark}]`}>
            <div className={`w-full max-w-4xl bg-[${panelDark}] shadow-2xl rounded-xl overflow-hidden border border-[#1f2937]`}>
                
                {/* Header con acento de color de marca */}
                <div className="relative bg-[#145e19] p-8 text-white border-b border-[#1f2937]">
                    <h1 className="text-3xl font-extrabold text-[${textWhite}]">
                        {userInfo.firstName} {userInfo.lastName}
                    </h1>
                    <p className={`mt-1 text-[${textMuted}]`}>ID: {userInfo.documento}</p>
                    
                    {/* Botones de acción */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className={`bg-[${primaryGreen}] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-medium shadow-lg shadow-black/30`}
                            >
                                <EditIcon />
                                Editar
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`bg-[${primaryGreen}] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-black/30 disabled:opacity-50`}
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" className="me-1" />
                                    ) : (
                                        <SaveIcon />
                                    )}
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-black/30 disabled:opacity-50"
                                >
                                    <XIcon />
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Mensajes de Alerta */}
                    {error && (
                        <Alert variant="danger" className="mb-4 bg-red-800 text-white border-none" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success" className={`mb-4 bg-[${primaryGreen}] text-white border-none`} dismissible onClose={() => setSuccess(false)}>
                            Perfil actualizado correctamente.
                        </Alert>
                    )}
                    {isPasswordExpired && (
                        <Alert variant="warning" className="mb-4 bg-[#f59e0b] text-black border-none">
                            <span className="font-bold">¡Atención!</span> Tu contraseña ha expirado. Por favor, cámbiala pronto.
                        </Alert>
                    )}
                    
                    {/* Contenido en dos columnas para desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Columna 1: Información Personal y Contacto (Editable) */}
                        <div className={`p-6 rounded-xl border border-[#1f2937] bg-[${backgroundDark}]`}>
                            <h2 className={`text-xl font-bold mb-4 flex items-center text-[${textWhite}]`}>
                                <UserIcon /> 
                                <span className="ml-2">Información Personal y Contacto</span>
                            </h2>
                            
                            <div className="space-y-2">
                                {/* Nombre */}
                                <ProfileField 
                                    icon={<UserIcon />} label="Nombre" 
                                    value={editedInfo.firstName} isEditing={isEditing} 
                                    fieldName="firstName" handleInputChange={handleInputChange} 
                                />
                                {/* Apellido */}
                                <ProfileField 
                                    icon={<UserIcon />} label="Apellido" 
                                    value={editedInfo.lastName} isEditing={isEditing} 
                                    fieldName="lastName" handleInputChange={handleInputChange} 
                                />
                                {/* Email */}
                                <ProfileField 
                                    icon={<MailIcon />} label="Email" 
                                    value={editedInfo.email} isEditing={isEditing} 
                                    fieldName="email" handleInputChange={handleInputChange} 
                                    type="email"
                                />
                                {/* Contacto Principal */}
                                <ProfileField 
                                    icon={<PhoneIcon />} label="Contacto Principal" 
                                    value={editedInfo.contactoPrincipal} isEditing={isEditing} 
                                    fieldName="contactoPrincipal" handleInputChange={handleInputChange} 
                                    type="tel"
                                />
                                {/* Contacto Secundario */}
                                <ProfileField 
                                    icon={<PhoneIcon />} label="Contacto Secundario" 
                                    value={editedInfo.contactoSecundario} isEditing={isEditing} 
                                    fieldName="contactoSecundario" handleInputChange={handleInputChange} 
                                    type="tel"
                                />
                            </div>
                        </div>

                        {/* Columna 2: Detalles del Sistema (Solo Lectura) */}
                        <div className={`p-6 rounded-xl border border-[#1f2937] bg-[${backgroundDark}]`}>
                            <h2 className={`text-xl font-bold mb-4 flex items-center text-[${textWhite}]`}>
                                <BriefcaseIcon />
                                <span className="ml-2">Detalles del Sistema y Seguridad</span>
                            </h2>
                            <div className="space-y-2">
                                
                                {/* Documento (Identificación) */}
                                <ProfileField 
                                    icon={<IdCardIcon />} label="Documento" 
                                    value={editedInfo.documento} isEditing={isEditing} 
                                    fieldName="documento" handleInputChange={handleInputChange} 
                                    type="number" // Mantengo editable como en tu código original
                                />

                                {/* Tipo de Documento */}
                                <ProfileField 
                                    icon={<IdCardIcon />} label="Tipo Doc." 
                                    value={userInfo.tipoDocumento} isEditing={false} 
                                    readOnly={true}
                                />
                                
                                {/* Rol */}
                                <ProfileField 
                                    icon={<BriefcaseIcon />} label="Rol" 
                                    value={userInfo.rol} isEditing={false} 
                                    readOnly={true}
                                />
                                
                                {/* Centro */}
                                <ProfileField 
                                    icon={<MapPinIcon />} label="Centro Asignado" 
                                    value={userInfo.centro} isEditing={false} 
                                    readOnly={true}
                                />

                                {/* Estado */}
                                <ProfileField 
                                    icon={<ActivityIcon />} label="Estado" 
                                    value={userInfo.estado} isEditing={false} 
                                    readOnly={true}
                                />

                                {/* Fecha de Expiración de Contraseña */}
                                <ProfileField 
                                    icon={<ClockIcon />} label="Contraseña Expira" 
                                    value={formatDate(userInfo.contrasenaExpiraEn)} isEditing={false} 
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuarioDark;