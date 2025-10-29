import { Link } from "react-router-dom";
import logo from "../assets/navLogoWhiteS.png";
import { useState, useCallback } from "react";
import '../styles/Navbar.css';

function Navbar() {
    const [click, setClick] = useState(false);

    // Funciones para manejar el menú móvil
    const handleClick = useCallback(() => setClick(prev => !prev), []);
    const closeMobileMenu = useCallback(() => setClick(false), []);

    return (
        <nav className="navbar">
            <div className="navbar-container justify-around">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    TraiScore
                    <img src={logo} alt="Logo" className="navbar-img"/>
                </Link>

                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                </div>

                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    {/* Links comunes */}
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            Inicio
                        </Link>
                    </li>

                    <li className='nav-item'>
                        <Link to='/contactwebform' className='nav-links' onClick={closeMobileMenu}>
                            Contáctanos
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;