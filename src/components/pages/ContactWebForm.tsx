import "../../styles/ContactWebForm.css";
import contactPic from "../../assets/register_mainpic.png";

const ContactWebForm = () => {
    return (
        <section className="flex justify-center items-center bg-gradient-to-r from-indigo-900 to-black py-16">
            <div className="max-w-7xl w-full px-4 lg:px-8 flex flex-col lg:flex-row items-center">
                {/* Formulario */}
                <div className="lg:w-1/2 w-full space-y-6">
                    <h2 className="text-white text-4xl font-semibold text-center lg:text-left">
                        Get in touch
                    </h2>
                    <p className="text-white text-lg text-center lg:text-left mb-8">
                        Reach out, and let's create a universe of possibilities together!
                    </p>
                    <form className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="user_name" className="text-gray-700 font-medium">Last Name</label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                placeholder="Introduce tu nombre"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tucorreo@ejemplo.com"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-gray-700 font-medium">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="Escribe tu mensaje aquí..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                        >
                            Send it to the moon 🚀
                        </button>
                    </form>
                </div>

                {/* Imagen */}
                <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
                <img src={contactPic} alt="Illustration"   className="w-1/2 md:w-1/2 lg:w-full h-auto object-cover rounded-lg shadow-xl"/>
                </div>
            </div>
        </section>
    );
};

export default ContactWebForm;