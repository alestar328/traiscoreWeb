import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PrivacyPolicy.css'; // Reutilizando los mismos estilos

const TermsOfService: React.FC = () => {
    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-header">
                <h1>Términos del Servicio</h1>
                <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="privacy-policy-content">
                <section className="privacy-section">
                    <h2>1. Aceptación de los Términos</h2>
                    <p>
                        Bienvenido a TraisCore. Estos Términos del Servicio ("Términos") regulan el uso de nuestra aplicación y sitio web de seguimiento fitness (colectivamente, el "Servicio") operado por TraisCore ("nosotros", "nos" o "nuestro").
                    </p>
                    <p>
                        Al acceder o utilizar nuestro Servicio, usted acepta cumplir con estos Términos. Si no está de acuerdo con alguna parte de ellos, no debe acceder ni utilizar el Servicio.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>2. Descripción del Servicio</h2>
                    <p>
                        TraisCore es una plataforma integral de seguimiento fitness que ofrece:
                    </p>
                    <ul>
                        <li>Rutinas de entrenamiento personalizadas y seguimiento de ejercicios</li>
                        <li>Monitoreo del progreso y análisis</li>
                        <li>Seguimiento de nutrición y métricas de salud</li>
                        <li>Herramientas de gestión entre entrenador y cliente</li>
                        <li>Funciones sociales y soporte comunitario</li>
                        <li>Integración con dispositivos y aplicaciones de fitness</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>3. Cuentas de Usuario</h2>
                    
                    <h3>3.1 Creación de Cuenta</h3>
                    <p>Para utilizar nuestro Servicio, debe:</p>
                    <ul>
                        <li>Crear una cuenta con información precisa y completa</li>
                        <li>Tener al menos 13 años (con consentimiento paterno si es menor de 18)</li>
                        <li>Mantener la seguridad de sus credenciales</li>
                        <li>Notificarnos inmediatamente ante accesos no autorizados</li>
                    </ul>

                    <h3>3.2 Responsabilidades de la Cuenta</h3>
                    <p>Usted es responsable de:</p>
                    <ul>
                        <li>Todas las actividades realizadas bajo su cuenta</li>
                        <li>Mantener la confidencialidad de su contraseña</li>
                        <li>Actualizar su información cuando sea necesario</li>
                        <li>Cumplir con todas las leyes y regulaciones aplicables</li>
                    </ul>

                    <h3>3.3 Terminación de la Cuenta</h3>
                    <p>
                        Nos reservamos el derecho de suspender o eliminar su cuenta si infringe estos Términos o participa en actividades fraudulentas o ilegales.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>4. Política de Uso Aceptable</h2>
                    
                    <h3>4.1 Usos Permitidos</h3>
                    <p>Puede utilizar nuestro Servicio únicamente con fines legales, incluyendo:</p>
                    <ul>
                        <li>Registrar su progreso personal de fitness</li>
                        <li>Gestionar relaciones con clientes (para entrenadores)</li>
                        <li>Compartir logros con la comunidad</li>
                        <li>Acceder a contenido educativo y recursos</li>
                    </ul>

                    <h3>4.2 Actividades Prohibidas</h3>
                    <p>Usted se compromete a no:</p>
                    <ul>
                        <li>Usar el Servicio para fines ilegales o no autorizados</li>
                        <li>Intentar obtener acceso no autorizado a nuestros sistemas</li>
                        <li>Interferir o interrumpir el funcionamiento del Servicio o servidores</li>
                        <li>Subir código malicioso, virus o contenido dañino</li>
                        <li>Suplantar a otra persona o entidad</li>
                        <li>Acosar, abusar o dañar a otros usuarios</li>
                        <li>Violar cualquier ley o reglamento aplicable</li>
                        <li>Ingeniería inversa o intentar extraer el código fuente</li>
                        <li>Usar sistemas automatizados para acceder al Servicio</li>
                        <li>Compartir información de salud falsa o engañosa</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>5. Contenido y Propiedad Intelectual</h2>
                    
                    <h3>5.1 Contenido del Usuario</h3>
                    <p>
                        Usted conserva la propiedad del contenido que cree y cargue en nuestro Servicio. Al utilizarlo, nos otorga una licencia para usar, almacenar y mostrar dicho contenido cuando sea necesario para prestar el Servicio.
                    </p>

                    <h3>5.2 Nuestro Contenido</h3>
                    <p>
                        El Servicio y todo su contenido original, características y funcionalidades son propiedad de TraisCore y están protegidos por leyes internacionales de derechos de autor, marcas, patentes y secretos comerciales.
                    </p>

                    <h3>5.3 Contenido de Terceros</h3>
                    <p>
                        Nuestro Servicio puede incluir contenido de terceros. No somos responsables de dicho contenido ni lo respaldamos.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>6. Suscripción y Pago</h2>
                    
                    <h3>6.1 Planes de Suscripción</h3>
                    <p>
                        Ofrecemos distintos planes de suscripción con diferentes características y precios. Los precios actuales están disponibles en nuestro sitio web y pueden cambiar con previo aviso.
                    </p>

                    <h3>6.2 Condiciones de Pago</h3>
                    <ul>
                        <li>Las suscripciones se facturan por adelantado de manera recurrente</li>
                        <li>El pago se realiza al activar la suscripción</li>
                        <li>Las tarifas no son reembolsables salvo lo exigido por ley</li>
                        <li>Usted es responsable de los impuestos aplicables</li>
                    </ul>

                    <h3>6.3 Cancelación</h3>
                    <p>
                        Puede cancelar su suscripción en cualquier momento. La cancelación surtirá efecto al finalizar el periodo de facturación actual. Tendrá acceso a las funciones pagadas hasta entonces.
                    </p>

                    <h3>6.4 Reembolsos</h3>
                    <p>
                        Los reembolsos se concederán a discreción nuestra y conforme a la legislación aplicable. Contacte con nuestro equipo de soporte para solicitudes.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>7. Exención de Responsabilidad sobre Salud y Seguridad</h2>
                    <p>
                        <strong>IMPORTANTE:</strong> Nuestro Servicio tiene fines informativos y de seguimiento únicamente. No sustituye el consejo, diagnóstico o tratamiento médico profesional.
                    </p>
                    <ul>
                        <li>Consulte con un profesional de la salud antes de iniciar cualquier programa de ejercicio</li>
                        <li>Detenga la actividad inmediatamente si siente dolor o malestar</li>
                        <li>No somos responsables por lesiones derivadas del uso del Servicio</li>
                        <li>Los resultados individuales pueden variar</li>
                        <li>Busque atención médica ante cualquier problema de salud</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>8. Privacidad y Protección de Datos</h2>
                    <p>
                        Su privacidad es importante para nosotros. La recopilación y uso de su información personal se rigen por nuestra Política de Privacidad, que forma parte de estos Términos.
                    </p>
                    <p>Puntos clave:</p>
                    <ul>
                        <li>Recopilamos solo la información necesaria para prestar el Servicio</li>
                        <li>Protegemos sus datos con medidas de seguridad estándar del sector</li>
                        <li>Usted tiene derecho a acceder, modificar y eliminar sus datos</li>
                        <li>No vendemos su información personal a terceros</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>9. Disponibilidad del Servicio</h2>
                    <p>
                        Nos esforzamos por ofrecer disponibilidad continua, pero no garantizamos que el Servicio esté libre de interrupciones o errores. Podemos:
                    </p>
                    <ul>
                        <li>Realizar mantenimiento programado</li>
                        <li>Actualizar funciones y características</li>
                        <li>Modificar o descontinuar partes del Servicio</li>
                        <li>Enfrentar dificultades técnicas fuera de nuestro control</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>10. Limitación de Responsabilidad</h2>
                    <p>
                        EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, TRAISCORE NO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, INCLUYENDO PÉRDIDAS DE BENEFICIOS, DATOS, USO, REPUTACIÓN U OTRAS PÉRDIDAS INTANGIBLES.
                    </p>
                    <p>
                        Nuestra responsabilidad total hacia usted no excederá el monto que haya pagado durante los 12 meses anteriores al reclamo.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>11. Indemnización</h2>
                    <p>
                        Usted acepta defender, indemnizar y mantener indemne a TraisCore, sus directivos, empleados y agentes frente a cualquier reclamación, daño, pérdida, obligación o gasto (incluidos honorarios legales) derivados del uso del Servicio.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>12. Resolución de Conflictos</h2>
                    
                    <h3>12.1 Ley Aplicable</h3>
                    <p>
                        Estos Términos se regirán e interpretarán conforme a las leyes de [Su Jurisdicción], sin tener en cuenta los principios de conflicto de leyes.
                    </p>

                    <h3>12.2 Proceso de Resolución</h3>
                    <p>Antes de iniciar cualquier acción legal, usted acepta:</p>
                    <ul>
                        <li>Contactarnos directamente para intentar resolver el conflicto</li>
                        <li>Participar de buena fe en las negociaciones</li>
                        <li>Considerar la mediación si no se logra un acuerdo</li>
                    </ul>

                    <h3>12.3 Renuncia a Demandas Colectivas</h3>
                    <p>
                        Usted acepta que cualquier disputa se resolverá de forma individual y no como parte de una acción colectiva.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>13. Modificaciones de los Términos</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos los cambios mediante:
                    </p>
                    <ul>
                        <li>Publicación de los nuevos Términos en esta página</li>
                        <li>Envío de un correo electrónico</li>
                        <li>Notificación dentro de la aplicación</li>
                    </ul>
                    <p>
                        El uso continuado del Servicio tras dichos cambios constituye su aceptación de los nuevos Términos.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>14. Terminación</h2>
                    <p>
                        Cualquiera de las partes puede rescindir estos Términos en cualquier momento. Tras la terminación:
                    </p>
                    <ul>
                        <li>Su derecho a utilizar el Servicio cesará inmediatamente</li>
                        <li>Podremos eliminar su cuenta y datos</li>
                        <li>Las disposiciones que deban mantenerse seguirán vigentes</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>15. Divisibilidad</h2>
                    <p>
                        Si alguna disposición de estos Términos se considera inválida o inaplicable, dicha disposición se limitará o eliminará en la medida necesaria, sin afectar el resto de los Términos.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>16. Información de Contacto</h2>
                    <p>Si tiene preguntas sobre estos Términos del Servicio, contáctenos:</p>
                    <div className="contact-info">
                        <p><strong>Correo electrónico legal:</strong> legal@traiscore.com</p>
                        <p><strong>Soporte:</strong> support@traiscore.com</p>
                        <p><strong>Dirección:</strong> [Dirección de la empresa]</p>
                        <p><strong>Teléfono:</strong> [Teléfono de contacto]</p>
                    </div>
                </section>

                <section className="privacy-section">
                    <h2>17. Acuerdo Completo</h2>
                    <p>
                        Estos Términos, junto con nuestra Política de Privacidad y cualquier otro aviso legal publicado en el Servicio, constituyen el acuerdo completo entre usted y TraisCore respecto al uso del Servicio.
                    </p>
                </section>
            </div>

            <div className="privacy-policy-footer">
                <div className="navigation-links">
                    <Link to="/privacy-policy" className="nav-link">← Política de Privacidad</Link>
                    <Link to="/" className="nav-link">Volver al Inicio →</Link>
                </div>
                <div className="policy-actions">
                    <button className="action-button print-button" onClick={() => window.print()}>
                        Imprimir Términos
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
                            element.download = 'traiscore-terminos-del-servicio.txt';
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                        }}
                    >
                        Descargar Términos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
