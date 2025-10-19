import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/DataDeletionRequest.css';

interface FormData {
    email: string;
    reason: string;
    confirmation: boolean;
    additionalInfo: string;
}

const DataDeletionRequest: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        reason: '',
        confirmation: false,
        additionalInfo: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulación de una llamada API – reemplazar con implementación real
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Solicitud de eliminación enviada:', formData);
            
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert('Hubo un error al enviar la solicitud. Por favor, inténtelo nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            reason: '',
            confirmation: false,
            additionalInfo: ''
        });
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="data-deletion-container">
                <div className="success-message">
                    <div className="success-icon">✅</div>
                    <h2>Solicitud enviada correctamente</h2>
                    <p>
                        Gracias por su solicitud de eliminación de datos. Hemos recibido su petición y la procesaremos dentro de los 30 días requeridos por el RGPD.
                    </p>
                    <div className="next-steps">
                        <h3>¿Qué sucede a continuación?</h3>
                        <ul>
                            <li>Verificaremos su identidad y cuenta</li>
                            <li>Sus datos serán eliminados permanentemente en un plazo máximo de 30 días</li>
                            <li>Recibirá un correo electrónico de confirmación una vez finalizado el proceso</li>
                            <li>Si tiene preguntas, puede escribirnos a privacy@traiscore.com</li>
                        </ul>
                    </div>
                    <div className="action-buttons">
                        <button onClick={resetForm} className="btn btn-secondary">
                            Enviar otra solicitud
                        </button>
                        <Link to="/" className="btn btn-primary">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="data-deletion-container">
            <div className="data-deletion-header">
                <h1>Solicitud de Eliminación de Datos</h1>
                <p className="subtitle">
                    Solicite la eliminación permanente de sus datos personales de TraisCore
                </p>
            </div>

            <div className="data-deletion-content">
                <div className="info-section">
                    <h2>Sus derechos bajo el RGPD</h2>
                    <p>
                        Según el Reglamento General de Protección de Datos (RGPD), usted tiene derecho a solicitar la eliminación de sus datos personales. Este derecho también se conoce como el "derecho al olvido".
                    </p>
                    
                    <div className="rights-list">
                        <h3>¿Qué datos se eliminarán?</h3>
                        <ul>
                            <li>Su información de cuenta y perfil</li>
                            <li>Todos los registros de seguimiento y progreso fitness</li>
                            <li>Rutinas de entrenamiento y registros de ejercicios</li>
                            <li>Fotos y medidas corporales</li>
                            <li>Historial de comunicación y tickets de soporte</li>
                            <li>Información de pago y facturación (según lo requerido por ley)</li>
                        </ul>
                    </div>

                    <div className="important-notice">
                        <h3>⚠️ Aviso Importante</h3>
                        <ul>
                            <li>La eliminación de datos es <strong>permanente e irreversible</strong></li>
                            <li>Perderá el acceso a todos sus datos y progreso</li>
                            <li>Cualquier suscripción activa se cancelará de inmediato</li>
                            <li>Algunos datos podrán conservarse por razones legales o regulatorias</li>
                            <li>El proceso de eliminación puede tardar hasta 30 días en completarse</li>
                        </ul>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="deletion-form">
                    <h2>Enviar su solicitud</h2>
                    
                    <div className="form-group">
                        <label htmlFor="email">
                            Correo electrónico <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingrese el correo asociado a su cuenta"
                        />
                        <small>El correo debe coincidir con el asociado a su cuenta para su verificación</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">
                            Motivo de la eliminación <span className="required">*</span>
                        </label>
                        <select
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccione un motivo</option>
                            <option value="no-longer-needed">Ya no necesito el servicio</option>
                            <option value="privacy-concerns">Preocupaciones de privacidad</option>
                            <option value="data-breach">Preocupaciones por violación de datos</option>
                            <option value="unlawful-processing">Procesamiento ilegal de datos</option>
                            <option value="withdraw-consent">Retiro mi consentimiento</option>
                            <option value="other">Otro (especifique abajo)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="additionalInfo">
                            Información adicional
                        </label>
                        <textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Incluya cualquier detalle adicional sobre su solicitud..."
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="confirmation"
                                checked={formData.confirmation}
                                onChange={handleInputChange}
                                required
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-text">
                                Entiendo que esta acción es <strong>permanente e irreversible</strong> y que perderé el acceso a todos mis datos y progreso. Confirmo que deseo proceder con la eliminación de mis datos personales de TraisCore.
                                <span className="required">*</span>
                            </span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.confirmation}
                            className="btn btn-primary btn-submit"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Procesando solicitud...
                                </>
                            ) : (
                                'Enviar solicitud de eliminación'
                            )}
                        </button>
                    </div>
                </form>

                <div className="contact-info">
                    <h3>¿Necesita ayuda?</h3>
                    <p>
                        Si tiene preguntas sobre la eliminación de datos o necesita asistencia, contáctenos:
                    </p>
                    <div className="contact-details">
                        <p><strong>Correo:</strong> privacy@traiscore.com</p>
                        <p><strong>Soporte:</strong> support@traiscore.com</p>
                        <p><strong>Tiempo de respuesta:</strong> Dentro de 72 horas</p>
                    </div>
                </div>

                <div className="related-links">
                    <h3>Información relacionada</h3>
                    <div className="links">
                        <Link to="/privacy-policy">Política de Privacidad</Link>
                        <Link to="/terms-of-service">Términos del Servicio</Link>
                        <a href="#data-portability">Solicitud de Portabilidad de Datos</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDeletionRequest;
