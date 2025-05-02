import "../../styles/ContactWebForm.css";

const ContactWebForm = () => {
    return (
        <section className="contact-cont-section">
            <div className="cont-container">
                <h2 className="cont-title">Contáctanos</h2>
                <form className="contact-cont">
                    <div className="cont-group">
                        <label htmlFor="user_name">Nombre</label>
                        <input type="text" id="user_name" name="user_name" placeholder="Introduce tu nombre" />
                    </div>

                    <div className="cont-group">
                        <label htmlFor="user_email">Correo Electrónico</label>
                        <input type="email" id="user_email" name="user_email" placeholder="tucorreo@ejemplo.com" />
                    </div>

                    <div className="cont-group">
                        <label htmlFor="message">Mensaje</label>
                        <textarea id="message" name="message" rows={5} placeholder="Escribe tu mensaje aquí..." />
                    </div>

                    <button type="submit" className="submit-button">Enviar</button>
                </form>
            </div>
        </section>
    );
};

export default ContactWebForm;