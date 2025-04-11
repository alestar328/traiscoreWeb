import {Link} from "react-router-dom";
import logo from "../assets/navLogoWhiteS.png";
import {useState, useEffect} from "react";
import {Button} from "./Button.tsx";
import '../styles/Navbar.css';

function Navbar() {

    const [ click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () =>setClick(false);

    const showButton = () =>{
        if(window.innerWidth <= 960){
            setButton(false);
        }else {
            setButton(true);
        }
    }

    useEffect(() => {
        showButton()
    }, []);
    window.addEventListener('resize', showButton);

    return(
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        TraiScore
                        <img src={logo} alt="Logo" className="navbar-img"/>
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                Inicio
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/createRoutine' className='nav-links' onClick={closeMobileMenu}>
                                Crear Rutina
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/register' className='nav-links' onClick={closeMobileMenu}>
                                Date de alta
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/contact' className='nav-links' onClick={closeMobileMenu}>
                                Contáctanos
                            </Link>
                        </li>


                    </ul>
                    {button && (
                        <Link to="/login" className="btn-link">
                            <Button buttonStyle='btn--outline'>SIGN UP</Button>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar;