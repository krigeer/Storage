import React, { useState, useEffect, useCallback } from 'react';
import { getUser } from '../../services/authContext.js';
import { updateUser } from '../../services/apiService.js'; 
import { apiCall } from '../../services/apiCutoms.js';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';


// --- Iconos SVG ---

const IconWrapper = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)', minWidth: '20px' }}>{children}</svg>
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


const id = getUser()?.id || 'N/A';

//  component para renderizar un campo
const ProfileField = ({ icon, label, value, isEditing, fieldName, handleInputChange, type = 'text', readOnly = false }) => {
    // valor
    const displayValue = (typeof value === 'object' && value !== null && value.nombre) ? value.nombre : value || 'N/A';
    
    // CSS 
    const textStyle = { color: 'var(--text)' };
    const mutedTextStyle = { color: 'var(--muted)' };
    const borderStyle = { borderColor: 'var(--border)' };
    const inputStyle = { 
        ...textStyle,
        ...borderStyle,
        backgroundColor: 'var(--bg)',
    };

    return (
        <Row className="align-items-center py-2 border-bottom" style={borderStyle}>
            <Col xs={12} md={4} className="d-flex align-items-center mb-1 mb-md-0">
                {icon}
                <span className="ms-2 fw-medium" style={mutedTextStyle}>{label}:</span>
            </Col>
            <Col xs={12} md={8}>
                {isEditing && !readOnly ? (
                    <Form.Control
                        type={type}
                        value={value || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        placeholder={label}
                        className="rounded-lg p-2"
                        style={inputStyle}
                    />
                ) : (
                    <span className={`fw-semibold ${displayValue === 'N/A' ? 'fst-italic' : ''}`} style={textStyle}>
                        {displayValue}
                    </span>
                )}
            </Col>
        </Row>
    );
};


const PerfilUsuarioBootstrap = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({}); 
    const [editedInfo, setEditedInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        try {
            return new Date(isoString).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
            });
        } catch {
            return 'N/A';
        }
    };

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const userResponse = await apiCall(`detalle_usuario/${id}`);
            
            if (userResponse && userResponse.id) { 
                setUserInfo(userResponse); 
            } else {
                setUserInfo({}); 
                console.error("Respuesta inesperada al obtener los datos del usuario:", userResponse);
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            setUserInfo({});
            setError("Error al cargar los datos del usuario.");
        } finally{
            setLoading(false);
        }
    }, [id]); 


    useEffect(() => {
        fetchUser();
    }, [fetchUser]); 
  



    if (loading && Object.keys(userInfo).length === 0) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px', backgroundColor: 'var(--bg)' }}>
                <Spinner animation="border" variant="success" />
                <span className="ms-2" style={{ color: 'var(--muted)' }}>Cargando datos del usuario...</span>
            </Container>
        );
    }

    const handleEdit = () => {
        setIsEditing(true);
        setEditedInfo({ 
            firstName: userInfo.first_name, 
            lastName: userInfo.last_name, 
            email: userInfo.email,
            documento: userInfo.documento,
            contactoPrincipal: userInfo.contacto_principal,
            contactoSecundario: userInfo.contacto_secundario,
        });
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
                ...updatedUser,
              
                first_name: updatedUser?.first_name ?? editedInfo.firstName, 
                last_name: updatedUser?.last_name ?? editedInfo.lastName,
                email: updatedUser?.email ?? editedInfo.email,
                contacto_principal: updatedUser?.contacto_principal != null ? updatedUser.contacto_principal : editedInfo.contactoPrincipal,
                contacto_secundario: updatedUser?.contacto_secundario != null ? updatedUser.contacto_secundario : editedInfo.contactoSecundario,
                documento: updatedUser?.documento != null ? updatedUser.documento : editedInfo.documento,
            };
            
            setUserInfo(mergedUser);
            setSuccess(true);
            setIsEditing(false);
        } catch (err) {
            setError(err?.message || 'Error al actualizar el perfil. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedInfo({}); 
        setIsEditing(false);
        setError(null);
        setSuccess(false);
    };

    const handleInputChange = (fieldName, value) => {
        setEditedInfo(prev => ({ ...prev, [fieldName]: value }));
    };
    
   
    const isPasswordExpired = userInfo.contrasena_expira_en && new Date() >= new Date(userInfo.contrasena_expira_en);

    return (
        <Card className="shadow-lg border-0" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
            <Card.Header 
                className="position-relative p-4 border-bottom" 
                style={{ 
                    backgroundColor: 'var(--sidebar-panel)', 
                    color: 'var(--sidebar-text)', 
                    borderColor: 'var(--border)' 
                }}
            >
                <h1 className="h3 fw-bolder">
                    {userInfo.first_name || ''} {userInfo.last_name || ''}
                </h1>
                <p className="mb-0 opacity-75">ID: {userInfo.documento || 'N/A'}</p> 
                
                {/* Botones de acción */}
                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                    {!isEditing ? (
                        <Button
                            onClick={handleEdit}
                            variant="success"
                            className="d-flex align-items-center gap-2 fw-medium shadow-sm"
                            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                        >
                            <EditIcon />
                            Editar
                        </Button>
                    ) : (
                        <div className="d-flex gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                variant="success"
                                className="d-flex align-items-center gap-2 fw-medium shadow-sm"
                                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                            >
                                {loading ? (<Spinner animation="border" size="sm" className="me-1" />) : (<SaveIcon />)}
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                                variant="danger" 
                                className="d-flex align-items-center gap-2 fw-medium shadow-sm"
                            >
                                <XIcon />
                                Cancelar
                            </Button>
                        </div>
                    )}
                </div>
            </Card.Header>

            <Card.Body className="p-4 p-sm-5">
                
                {error && (<Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>{error}</Alert>)}
                {success && (<Alert variant="success" className="mb-4" onClose={() => setSuccess(false)} dismissible>Perfil actualizado correctamente.</Alert>)}
                {isPasswordExpired && (
                    <Alert variant="warning" className="mb-4">
                        <span className="fw-bold">¡Atención!</span> Tu contraseña ha expirado. Por favor, cámbiala pronto.
                    </Alert>
                )}
                
                <Row className="g-4">
                    
                    {/* Columna 1: INFORMACIÓN PERSONAL */}
                    <Col lg={4}>
                        <Card className="h-100" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: 'var(--text)' }}>
                                    <UserIcon /> 
                                    <span className="ms-2">Datos Personales</span>
                                </h5>
                                <div className="d-flex flex-column gap-2">
                                    <ProfileField icon={<UserIcon />} label="Nombre(s)" 
                                        value={isEditing ? editedInfo.firstName : userInfo.first_name} 
                                        isEditing={isEditing} fieldName="firstName" handleInputChange={handleInputChange} 
                                    />
                                    <ProfileField icon={<UserIcon />} label="Apellido(s)" 
                                        value={isEditing ? editedInfo.lastName : userInfo.last_name} 
                                        isEditing={isEditing} fieldName="lastName" handleInputChange={handleInputChange} 
                                    />
                                    <ProfileField icon={<IdCardIcon />} label="N° Documento" 
                                        value={isEditing ? editedInfo.documento : userInfo.documento} 
                                        isEditing={isEditing} fieldName="documento" handleInputChange={handleInputChange} type="number" 
                                    />
                                    {/* Usar el nombre del API: tipo_documento */}
                                    <ProfileField icon={<IdCardIcon />} label="Tipo Doc." value={userInfo.tipo_documento} isEditing={false} readOnly={true} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Columna 2: CONTACTO Y ACCESO */}
                    <Col lg={4}>
                        <Card className="h-100" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: 'var(--text)' }}>
                                    <MailIcon />
                                    <span className="ms-2">Contacto y Acceso</span>
                                </h5>
                                <div className="d-flex flex-column gap-2">
                                    <ProfileField icon={<MailIcon />} label="Correo Electrónico" 
                                        value={isEditing ? editedInfo.email : userInfo.email} 
                                        isEditing={isEditing} fieldName="email" handleInputChange={handleInputChange} type="email" 
                                    />
                                    <ProfileField icon={<PhoneIcon />} label="Tel. Principal" 
                                        value={isEditing ? editedInfo.contactoPrincipal : userInfo.contacto_principal} 
                                        isEditing={isEditing} fieldName="contactoPrincipal" handleInputChange={handleInputChange} type="tel" 
                                    />
                                    <ProfileField icon={<PhoneIcon />} label="Tel. Secundario" 
                                        value={isEditing ? editedInfo.contactoSecundario : userInfo.contacto_secundario} 
                                        isEditing={isEditing} fieldName="contactoSecundario" handleInputChange={handleInputChange} type="tel" 
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Columna 3: DETALLES DEL SISTEMA (Solo Lectura) */}
                    <Col lg={4}>
                        <Card className="h-100" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: 'var(--text)' }}>
                                    <BriefcaseIcon />
                                    <span className="ms-2">Detalles del Sistema</span>
                                </h5>
                                <div className="d-flex flex-column gap-2">
                                    <ProfileField icon={<BriefcaseIcon />} label="Rol Asignado" value={userInfo.rol} isEditing={false} readOnly={true} />
                                    <ProfileField icon={<MapPinIcon />} label="Centro" value={userInfo.centro} isEditing={false} readOnly={true} />
                                    <ProfileField icon={<ActivityIcon />} label="Estado de Cuenta" value={userInfo.estado} isEditing={false} readOnly={true} />
                                    <ProfileField icon={<ClockIcon />} label="Contraseña Expira" value={formatDate(userInfo.contrasena_expira_en)} isEditing={false} readOnly={true} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PerfilUsuarioBootstrap;