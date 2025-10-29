import { Link } from "react-router-dom";
import logo from "../assets/navLogoWhiteS.png";
import { useState, useCallback } from "react";
import '../styles/Navbar.css';

function Navbar() {
    const [click, setClick] = useState(false);

    const handleClick = useCallback(() => setClick(prev => !prev), []);
    const closeMobileMenu = useCallback(() => setClick(false), []);

    return (
        <nav className="navbar">
            <div className="navbar-container flex justify-between items-center px-4 lg:px-8 relative">
                {/* Logo centrado en móviles */}
                <div className="flex-1 flex justify-center lg:justify-start">
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <img
                            src={logo}
                            alt="Logo"
                            className="navbar-img w-24 sm:w-28 md:w-32 object-contain"
                        />
                    </Link>
                </div>

                {/* Icono menú hamburguesa (posición absoluta para no mover el logo) */}
                <div
                    className="menu-icon absolute right-4 lg:static cursor-pointer"
                    onClick={handleClick}
                >
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>

                {/* Menú principal */}
                <ul className={`${click ? 'nav-menu active' : 'nav-menu'} lg:flex lg:gap-8 hidden lg:block`}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                            Inicio
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/contactwebform" className="nav-links" onClick={closeMobileMenu}>
                            Contáctanos
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;