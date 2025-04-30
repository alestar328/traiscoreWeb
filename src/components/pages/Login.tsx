import '../../styles/Login.css';
import '../../App.css';
import {Link, useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const handleGoogleSignIn = async () => {
        setError('');
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.userRole;

                if (role === 'trainer') {
                    navigate('/trainerdashboard');
                } else {
                    navigate('/clientdashboard');
                }
            } else {
                setError('❌ Tu cuenta de Google no está registrada en nuestra base de datos.');
                await auth.signOut();
            }
        } catch (err) {
            console.error("Error en login con Google:", err);
            setError('❌ No se pudo iniciar sesión con Google.');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('Actualmente solo está habilitado el inicio de sesión con Google.');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>

                <form onSubmit={handleLogin} className="login-form">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Contraseña</label>
                    <input
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Iniciar Sesión</button>
                </form>

                <div className="divider">o</div>

                <button className="btn-google" onClick={handleGoogleSignIn}>
                    <FcGoogle size={20} />
                    Iniciar con Google
                </button>

                {error && <p className="error-message">{error}</p>}

                <p className="signup-link">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
export default Login;