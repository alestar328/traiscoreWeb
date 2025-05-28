import '../../styles/Login.css';
import '../../App.css';
import {Link, useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

function Login() {

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

                if (role === 'TRAINER') {
                    navigate('/trainerdashboard');
                } else if (role === 'CLIENT') {
                    navigate('/clientdashboard');
                }else {
                    navigate('/')
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



    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>




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