import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterComp = () => {
  return (
<footer className="mt-auto bg-[#0f1113] text-gray-300 px-6 py-10 border-t border-gray-800">
{/* --- Top Section --- */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 rounded-full bg-cyan-400"></div>
          <div className="w-1.5 h-6 rounded-full bg-blue-500"></div>
          <div className="w-1.5 h-6 rounded-full bg-indigo-500"></div>
          <span className="ml-2 text-white font-semibold text-xl">TraiScore</span>
        </div>

        {/* Navigation 
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="#" className="hover:text-cyan-400 transition-colors">Sobre nosotros</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Precios</a>
        </nav>*/}


        {/* Social icons */}
        <div className="flex gap-5 text-lg">
          <a href="#" className="hover:text-cyan-400 transition-colors"><FaFacebookF /></a>
          <a href="#" className="hover:text-cyan-400 transition-colors"><FaInstagram /></a>
        </div>
      </div>

      {/* --- Divider --- */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* --- Bottom Section --- */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-gray-400">
        <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">Política de Privacidad</Link>
        <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">Terminos de servicio</Link>
        <Link to="/data-deletion-request" className="hover:text-cyan-400 transition-colors">Borrar mi datos</Link>
        <a href="#contact" className="hover:text-cyan-400 transition-colors">Contacto y soporte</a>
      </div>
    </footer>
  );
};

export default FooterComp;
