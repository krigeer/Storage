import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { getUser } from '../../services/authContext.js';
import { updateUser } from '../../services/apiService.js'; 

// Iconos SVG
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MailIcon = () => (
  <svg className="ms-4 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="ms-4 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="ms-4 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);



const PerfilUsuario = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      const userData = {
        id: currentUser?.id,
        name: currentUser?.first_name || '',
        lastName: currentUser?.last_name || '',
        email: currentUser?.email || '',
        phone: currentUser?.contacto ? String(currentUser.contacto) : '',
        location: currentUser?.documento ? String(currentUser.documento) : '',
        bio: currentUser?.rol || '',
        username: currentUser?.username || '',
        centro: currentUser?.centro || '',
      };
      setUserInfo(userData);
      setEditedInfo(userData);
    }
  }, []);

  if (!userInfo) {
    return <div>Cargando...</div>; 
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
        first_name: editedInfo.name,
        last_name: editedInfo.lastName,
        email: editedInfo.email,
        contacto: editedInfo.phone,
        documento: editedInfo.location,
      };
      // console.log('Datos a enviar:', dataToSend);
      // console.log('ID del usuario:', userInfo.id);

      // Llamar a la API para actualizar
      const updatedUser = await updateUser(userInfo.id, dataToSend);
      
      // Actualizar el estado con la respuesta
      const mergedUser = {
        ...userInfo,
        name: updatedUser?.first_name ?? editedInfo.name,
        lastName: updatedUser?.last_name ?? editedInfo.lastName,
        email: updatedUser?.email ?? editedInfo.email,
        phone: updatedUser?.contacto != null ? String(updatedUser.contacto) : editedInfo.phone,
        location: updatedUser?.documento != null ? String(updatedUser.documento) : editedInfo.location,
      };
      setUserInfo(mergedUser);
      setEditedInfo(mergedUser);
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || 'Error al actualizar el perfil');
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

  const handleInputChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full mx-auto shadow-lg overflow-hidden h-full">
      {error && (
        <Alert variant="danger" className="mx-6 mt-4" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mx-6 mt-4" dismissible onClose={() => setSuccess(false)}>
          Perfil actualizado correctamente
        </Alert>
      )}

      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-40">        
        <div className="absolute top-4 right-4">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-v bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
            >
              <EditIcon />
              Editar perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <SaveIcon />
                )}
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <XIcon />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-20 px-6 pb-6">
        <div className="mb-6">
          {!isEditing ? (
            <>
              <h1 className="ms-4 text-3xl font-bold text-gray-900 mb-4">
                {userInfo.name} {userInfo.lastName}
              </h1>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={editedInfo.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="ms-4 text-3xl font-bold text-gray-900 w-full border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent"
                placeholder="Nombre"
              />
              <input
                type="text"
                value={editedInfo.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="ms-4 text-2xl font-semibold text-gray-700 w-full border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent"
                placeholder="Apellido"
              />
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <MailIcon />
            {!isEditing ? (
              <span className="ms-4 text-gray-700">{userInfo.email}</span>
            ) : (
              <input
                type="email"
                value={editedInfo.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                placeholder="email@ejemplo.com"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <PhoneIcon />
            {!isEditing ? (
              <span className="ms-4 text-gray-700">{userInfo.phone}</span>
            ) : (
              <input
                type="tel"
                value={editedInfo.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                placeholder="+57 300 123 4567"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <MapPinIcon />
            {!isEditing ? (
              <span className="ms-4 text-gray-700">{userInfo.location}</span>
            ) : (
              <input
                type="text"
                value={editedInfo.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                placeholder="Documento"
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;