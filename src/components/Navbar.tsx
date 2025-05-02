import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/navLogoWhiteS.png";
import {useState, useEffect} from "react";
import {Button} from "./Button.tsx";
import '../styles/Navbar.css';
import {useAuth} from "../contexts/AuthContext.tsx";
import {getAuth, signOut } from "firebase/auth";

function Navbar() {

    const [ click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () =>setClick(false);

    const showButton = () =>{
        if(window.innerWidth <= 960){
            setButton(false);
        }else {
            setButton(true);
        }
    };
    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleDashboardRedirect = () => {
        if (!currentUser) return;
        const role = currentUser.userRole;
        if (role === "trainer") {
            navigate("/trainerdashboard");
        } else if (role === "client") {
            navigate("/clientdashboard");
        }
    };

    useEffect(() => {
        showButton();
        window.addEventListener('resize', showButton);
        return () => window.removeEventListener('resize', showButton);
    }, []);

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
                            <Link to='/contactwebform' className='nav-links' onClick={closeMobileMenu}>
                                Contáctanos
                            </Link>
                        </li>
                        {button && currentUser && (
                            <>
                            <li className='nav-item'>
                                <Link to='/clientregistrationform' className='nav-links' onClick={closeMobileMenu}>
                                    Alta cliente
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to='/createRoutine' className='nav-links' onClick={closeMobileMenu}>
                                    Nueva rutina
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Button buttonStyle="btn--primary" onClick={handleDashboardRedirect}>
                                    Mi Panel
                                </Button>
                            </li>

                            <li className="nav-item">
                                <Button buttonStyle="btn--outline" onClick={handleLogout}>
                                    Cerrar Sesión
                                </Button>
                            </li>
                            </>
                            )}


                        {button && !currentUser &&(

                            <li className="nav-item">
                            <Link to="/login" className="btn-link">
                                <Button buttonStyle="btn--outline">Inicia Sesión</Button>
                            </Link>
                            </li>
                    )}
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar;