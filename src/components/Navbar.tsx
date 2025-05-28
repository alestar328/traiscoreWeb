import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navLogoWhiteS.png";
import { useState, useEffect, useCallback } from "react";
import { Button } from "./Button.tsx";
import '../styles/Navbar.css';
import { useAuth } from "../contexts/AuthContext.tsx";

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const { currentUser, state, signOut, isAuthenticated, isReady } = useAuth();
    const navigate = useNavigate();

    // Funciones para manejar el menú móvil
    const handleClick = useCallback(() => setClick(prev => !prev), []);
    const closeMobileMenu = useCallback(() => setClick(false), []);

    // Función para mostrar/ocultar botón según el tamaño de pantalla
    const showButton = useCallback(() => {
        setButton(window.innerWidth > 960);
    }, []);

    // Función para cerrar sesión con manejo de errores
    const handleLogout = useCallback(async () => {
        try {
            closeMobileMenu();
            await signOut();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Opcional: mostrar toast de error
        }
    }, [signOut, navigate, closeMobileMenu]);

    // Función para redirigir al dashboard según el rol
    const handleDashboardRedirect = useCallback(() => {
        if (!currentUser) {
            console.warn('No hay usuario para redirigir al dashboard');
            return;
        }

        closeMobileMenu();

        const dashboardRoute = currentUser.userRole === 'TRAINER'
            ? '/trainerdashboard'
            : '/clientdashboard';

        navigate(dashboardRoute);
    }, [currentUser, navigate, closeMobileMenu]);

    // Función para ir al login
    const handleLoginRedirect = useCallback(() => {
        closeMobileMenu();
        navigate('/login');
    }, [navigate, closeMobileMenu]);

    // Effect para manejar resize de ventana
    useEffect(() => {
        showButton();
        window.addEventListener('resize', showButton);
        return () => window.removeEventListener('resize', showButton);
    }, [showButton]);

    // Renderizado condicional para loading state
    if (!isReady) {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        TraiScore
                        <img src={logo} alt="Logo" className="navbar-img"/>
                    </Link>
                    <div className="navbar-loading">
                        <span>Cargando...</span>
                    </div>
                </div>
            </nav>
        );
    }

    return (
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

                    {/* Contenido para usuarios autenticados */}
                    {isAuthenticated && currentUser ? (
                        <>
                            {/* Links específicos para TRAINER */}
                            {currentUser.userRole === "TRAINER" && (
                                <>
                                    <li className='nav-item'>
                                        <Link
                                            to='/clientregistrationform'
                                            className='nav-links'
                                            onClick={closeMobileMenu}
                                        >
                                            Alta cliente
                                        </Link>
                                    </li>

                                    <li className='nav-item'>
                                        <Link
                                            to='/createRoutine'
                                            className='nav-links'
                                            onClick={closeMobileMenu}
                                        >
                                            Nueva rutina
                                        </Link>
                                    </li>
                                </>
                            )}

                            {/* Botón Dashboard - solo en desktop */}
                            {button && (
                                <li className='nav-item'>
                                    <Button
                                        buttonStyle="btn--primary"
                                        onClick={handleDashboardRedirect}
                                    >
                                        Mi Panel
                                    </Button>
                                </li>
                            )}

                            {/* Botón Cerrar Sesión */}
                            <li className="nav-item">
                                <Button
                                    buttonStyle="btn--outline"
                                    className="btn--logout"
                                    onClick={handleLogout}
                                >
                                    {state.loading ? 'Cerrando...' : 'Cerrar Sesión'}
                                </Button>
                            </li>

                            {/* Dashboard link en móvil */}
                            {!button && (
                                <li className='nav-item'>
                                    <Link
                                        to={currentUser.userRole === 'TRAINER' ? '/trainerdashboard' : '/clientdashboard'}
                                        className='nav-links'
                                        onClick={closeMobileMenu}
                                    >
                                        Mi Panel
                                    </Link>
                                </li>
                            )}
                        </>
                    ) : (
                        /* Contenido para usuarios no autenticados */
                        <li className="nav-item">
                            <Button
                                buttonStyle="btn--outline"
                                onClick={handleLoginRedirect}
                            >
                                Inicia Sesión
                            </Button>
                        </li>
                    )}

                    {/* Mostrar error si existe */}
                    {state.error && (
                        <li className="nav-item nav-error">
                            <span className="nav-error-text">
                                Error de sesión
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;