import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-header">
                <h1>Política de Privacidad</h1>
                <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="privacy-policy-content">
                <section className="privacy-section">
                    <h2>1. Introducción</h2>
                    <p>
                        Bienvenido a TraisCore ("nosotros", "nuestro" o "nos"). Nos comprometemos a proteger su privacidad y garantizar la seguridad de su información personal. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando utiliza nuestra aplicación y sitio web de seguimiento fitness.
                    </p>
                    <p>
                        Al utilizar nuestros servicios, usted acepta la recopilación y el uso de información de acuerdo con esta política. Si no está de acuerdo con nuestras prácticas, por favor, no utilice nuestros servicios.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>2. Información que Recopilamos</h2>
                    
                    <h3>2.1 Información Personal</h3>
                    <p>Podemos recopilar los siguientes tipos de información personal:</p>
                    <ul>
                        <li><strong>Información de la cuenta:</strong> Nombre, dirección de correo electrónico, contraseña e información del perfil</li>
                        <li><strong>Datos de fitness:</strong> Rutinas de entrenamiento, registros de ejercicios, medidas corporales, fotos de progreso y objetivos fitness</li>
                        <li><strong>Información de salud:</strong> Peso, altura, porcentaje de grasa corporal y otros datos que decida proporcionar</li>
                        <li><strong>Información de contacto:</strong> Número de teléfono, dirección postal (si se proporciona)</li>
                        <li><strong>Información de pago:</strong> Datos de facturación para servicios de suscripción (procesados de forma segura por terceros)</li>
                    </ul>

                    <h3>2.2 Información Recopilada Automáticamente</h3>
                    <ul>
                        <li><strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, identificadores únicos y red móvil</li>
                        <li><strong>Datos de uso:</strong> Cómo interactúa con nuestra app, funciones utilizadas, tiempo de uso y métricas de rendimiento</li>
                        <li><strong>Datos de ubicación:</strong> Información general de ubicación (si otorga permiso) para funciones basadas en ubicación</li>
                        <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, versión de la app e informes de fallos</li>
                    </ul>

                    <h3>2.3 Información de Terceros</h3>
                    <p>Podemos recibir información de terceros como:</p>
                    <ul>
                        <li>Plataformas de redes sociales (si decide conectar su cuenta)</li>
                        <li>Dispositivos y aplicaciones de fitness (con su permiso)</li>
                        <li>Procesadores de pago para información de transacciones</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>3. Cómo Utilizamos su Información</h2>
                    <p>Utilizamos su información para los siguientes fines:</p>
                    <ul>
                        <li><strong>Prestación del servicio:</strong> Proveer, mantener y mejorar nuestros servicios de seguimiento</li>
                        <li><strong>Personalización:</strong> Adaptar su experiencia y ofrecerle contenido relevante</li>
                        <li><strong>Seguimiento del progreso:</strong> Ayudarle a registrar y alcanzar sus metas</li>
                        <li><strong>Comunicación:</strong> Enviarle actualizaciones, notificaciones y mensajes de soporte</li>
                        <li><strong>Análisis:</strong> Analizar patrones de uso y mejorar nuestros servicios</li>
                        <li><strong>Seguridad:</strong> Proteger contra fraudes, accesos no autorizados y otras amenazas</li>
                        <li><strong>Cumplimiento legal:</strong> Cumplir con leyes y regulaciones aplicables</li>
                        <li><strong>Marketing:</strong> Enviar materiales promocionales (con su consentimiento)</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>4. Compartición y Divulgación de Información</h2>
                    <p>Podemos compartir su información en las siguientes circunstancias:</p>
                    
                    <h3>4.1 Con su consentimiento</h3>
                    <p>Podemos compartir su información con terceros cuando usted lo autorice expresamente.</p>

                    <h3>4.2 Proveedores de servicios</h3>
                    <p>Podemos compartir información con proveedores externos de confianza que nos ayudan en:</p>
                    <ul>
                        <li>Almacenamiento y procesamiento de datos</li>
                        <li>Procesamiento de pagos</li>
                        <li>Análisis y monitoreo de rendimiento</li>
                        <li>Soporte al cliente</li>
                        <li>Servicios de marketing</li>
                    </ul>

                    <h3>4.3 Requisitos legales</h3>
                    <p>Podemos divulgar información si es requerida por ley o para:</p>
                    <ul>
                        <li>Cumplir obligaciones legales</li>
                        <li>Proteger nuestros derechos y propiedad</li>
                        <li>Prevenir fraude o abuso</li>
                        <li>Proteger la seguridad de nuestros usuarios</li>
                    </ul>

                    <h3>4.4 Transferencias comerciales</h3>
                    <p>En caso de fusión, adquisición o venta de activos, su información podrá ser transferida como parte de la transacción.</p>
                </section>

                <section className="privacy-section">
                    <h2>5. Seguridad de los Datos</h2>
                    <p>Implementamos medidas técnicas y organizativas adecuadas para proteger su información personal:</p>
                    <ul>
                        <li><strong>Cifrado:</strong> Los datos se cifran en tránsito y en reposo</li>
                        <li><strong>Controles de acceso:</strong> Estrictos mecanismos de autenticación</li>
                        <li><strong>Auditorías regulares:</strong> Revisiones de seguridad y evaluación de vulnerabilidades</li>
                        <li><strong>Formación del personal:</strong> Capacitación sobre protección de datos</li>
                        <li><strong>Respuesta ante incidentes:</strong> Procedimientos para manejar incidentes de seguridad</li>
                    </ul>
                    <p>
                        Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por proteger su información, no podemos garantizar una seguridad absoluta.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>6. Conservación de Datos</h2>
                    <p>Conservamos su información personal durante el tiempo necesario para:</p>
                    <ul>
                        <li>Brindarle nuestros servicios</li>
                        <li>Cumplir con obligaciones legales</li>
                        <li>Resolver disputas</li>
                        <li>Hacer cumplir nuestros acuerdos</li>
                    </ul>
                    <p>
                        Cuando elimine su cuenta, borraremos o anonimizaremos su información personal, salvo cuando la ley exija conservarla o por fines comerciales legítimos.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>7. Sus Derechos y Opciones</h2>
                    <p>Dependiendo de su ubicación, puede tener los siguientes derechos:</p>
                    
                    <h3>7.1 Acceso y Portabilidad</h3>
                    <ul>
                        <li>Solicitar acceso a su información personal</li>
                        <li>Recibir una copia en formato portátil</li>
                    </ul>

                    <h3>7.2 Corrección y Actualizaciones</h3>
                    <ul>
                        <li>Corregir información personal incorrecta</li>
                        <li>Actualizar la información de su cuenta</li>
                    </ul>

                    <h3>7.3 Eliminación</h3>
                    <ul>
                        <li>Solicitar la eliminación de su información personal</li>
                        <li>Eliminar su cuenta y datos asociados</li>
                    </ul>

                    <h3>7.4 Restricción y Oposición</h3>
                    <ul>
                        <li>Restringir el procesamiento de su información</li>
                        <li>Oponerse a ciertos tipos de procesamiento</li>
                    </ul>

                    <h3>7.5 Comunicaciones de Marketing</h3>
                    <ul>
                        <li>Darse de baja de correos de marketing</li>
                        <li>Gestionar sus preferencias de notificación</li>
                    </ul>

                    <p>Para ejercer estos derechos, contáctenos mediante la información en la sección “Contáctenos”, o utilice nuestro <Link to="/data-deletion-request">formulario de solicitud de eliminación de datos</Link>.</p>
                </section>

                <section className="privacy-section">
                    <h2>8. Transferencias Internacionales de Datos</h2>
                    <p>
                        Su información puede ser transferida y procesada en países distintos al de su residencia. Garantizamos medidas adecuadas para dichas transferencias, incluyendo:
                    </p>
                    <ul>
                        <li>Cláusulas contractuales estándar</li>
                        <li>Decisiones de adecuación de autoridades competentes</li>
                        <li>Esquemas de certificación</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>9. Privacidad de los Menores</h2>
                    <p>
                        Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos intencionalmente información personal de menores de esa edad. Si usted es padre, madre o tutor y cree que su hijo nos ha proporcionado información personal, contáctenos de inmediato.
                    </p>
                    <p>
                        Para usuarios entre 13 y 18 años, recomendamos la supervisión de un adulto.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>10. Servicios de Terceros</h2>
                    <p>Nuestra aplicación puede contener enlaces a sitios o servicios de terceros. Esta Política de Privacidad no se aplica a ellos. Le recomendamos revisar sus políticas de privacidad.</p>
                    
                    <h3>10.1 Analítica de terceros</h3>
                    <p>Podemos usar servicios de análisis de terceros para estudiar el uso de la app. Estos servicios pueden recopilar información sobre su uso.</p>

                    <h3>10.2 Integración con redes sociales</h3>
                    <p>Si decide conectar sus cuentas de redes sociales, esas plataformas pueden recopilar información sobre su interacción con nuestra app.</p>
                </section>

                <section className="privacy-section">
                    <h2>11. Cambios en esta Política de Privacidad</h2>
                    <p>
                        Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio mediante:
                    </p>
                    <ul>
                        <li>Publicación de la nueva política en esta página</li>
                        <li>Envío de un correo electrónico</li>
                        <li>Notificación dentro de nuestra aplicación</li>
                    </ul>
                    <p>
                        El uso continuado de nuestros servicios después de los cambios constituye su aceptación de la nueva Política de Privacidad.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>12. Contáctenos</h2>
                    <p>Si tiene preguntas sobre esta Política de Privacidad o nuestras prácticas, contáctenos:</p>
                    <div className="contact-info">
                        <p><strong>Correo electrónico:</strong> privacy@traiscore.com</p>
                        <p><strong>Dirección:</strong> [Dirección de la empresa]</p>
                        <p><strong>Teléfono:</strong> [Teléfono de contacto]</p>
                    </div>
                    <p>
                        Para consultas sobre protección de datos, puede contactar con nuestro Delegado de Protección de Datos en: dpo@traiscore.com
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>13. Cumplimiento Normativo</h2>
                    <p>Esta Política de Privacidad cumple con:</p>
                    <ul>
                        <li>Reglamento General de Protección de Datos (GDPR) para usuarios de la UE</li>
                        <li>Ley de Privacidad del Consumidor de California (CCPA)</li>
                        <li>Ley de Protección de la Privacidad Infantil en Línea (COPPA)</li>
                        <li>Requisitos de privacidad de Google Play y App Store</li>
                    </ul>
                </section>
            </div>

            <div className="privacy-policy-footer">
                <div className="navigation-links">
                    <Link to="/" className="nav-link">← Volver al inicio</Link>
                    <Link to="/terms-of-service" className="nav-link">Términos del Servicio →</Link>
                </div>
                <div className="policy-actions">
                    <button className="action-button print-button" onClick={() => window.print()}>
                        Imprimir Política
                    </button>
                    <button
                        className="action-button download-button"
                        onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob(
                                [document.querySelector('.privacy-policy-content')?.textContent || ''],
                                { type: 'text/plain' }
                            );
                            element.href = URL.createObjectURL(file);
                            element.download = 'traiscore-politica-de-privacidad.txt';
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                        }}
                    >
                        Descargar Política
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
