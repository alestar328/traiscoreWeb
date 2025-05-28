import '../../styles/Login.css';
import '../../App.css';
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import {useLoginDomain} from "../../domain/LoginDomain.tsx";

function Login() {
    const navigate = useNavigate();
    const { currentUser, state: authState } = useAuth();
    const {
        state,
        setEmail,
        setPassword,
        handleEmailLogin,
        handleGoogleSignIn
    } = useLoginDomain();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (!authState.loading && currentUser) {
            const dashboardRoute = currentUser.userRole === 'TRAINER'
                ? '/trainerdashboard'
                : '/clientdashboard';
            navigate(dashboardRoute, { replace: true });
        }
    }, [currentUser, authState.loading, navigate]);

    // No mostrar el login si está autenticado
    if (!authState.loading && currentUser) {
        return null;
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>

                <form className="login-form" onSubmit={handleEmailLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={state.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            disabled={state.loading || authState.loading}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={state.password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            disabled={state.loading || authState.loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={state.loading || authState.loading || !state.email || !state.password}
                    >
                        {state.loading ? (
                            <>
                                <div className="spinner"></div>
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>

                    <div className="forgot-password">
                        <Link to="/forgot-password" className="forgot-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>

                <div className="divider">
                    <span>o</span>
                </div>

                <button
                    className={`btn-google ${state.loading ? 'loading' : ''}`}
                    onClick={handleGoogleSignIn}
                    disabled={state.loading || authState.loading}
                >
                    {state.loading ? (
                        <>
                            <div className="spinner"></div>
                            Iniciando sesión...
                        </>
                    ) : (
                        <>
                            <FcGoogle size={20} />
                            Iniciar con Google
                        </>
                    )}
                </button>

                {state.error && (
                    <p className="error-message" role="alert">
                        {state.error}
                    </p>
                )}

                <p className="signup-link">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;