
import '../../styles/RegisterPage.css';
import registerPic from "../../assets/register_mainpic.png";
import { FcGoogle } from 'react-icons/fc';
import {useNavigate} from "react-router-dom";
import {useRegistration} from "../../contexts/RegistrationContext.tsx";
import {useState} from "react";
import UserProfileFormWrapper from "./UserProfileFormWrapper.tsx";
import '../../styles/UserProfile.css';



function RegisterPage() {
    const { pendingUser, registerWithGoogle, clearPendingUser } = useRegistration();
    const navigate = useNavigate();
    // Nuevo estado local para controlar si el formulario de perfil debe mostrarse
    const [showProfileForm, setShowProfileForm] = useState(false);

    const handleGoogleSignIn = async () => {
        const ok = await registerWithGoogle();
        if (ok) setShowProfileForm(true);
    };

    // Función para volver a mostrar las opciones de registro iniciales
    const handleGoBack = () => {
        clearPendingUser();
        setShowProfileForm(false);
    };

    return (
        <div className="register-wrapper">
            <div className="left-panel">
                <div className="left-content">
                    <img src={registerPic} alt="Illustration" />
                </div>
            </div>

            <div className="right-panel">
                <div className="signup-card">
                    {showProfileForm && pendingUser ? (
                        <UserProfileFormWrapper onGoBack={handleGoBack} />
                    ) : (
                        <>
                            <h2>Regístrate ahora</h2>
                            <button className="btn-google" onClick={handleGoogleSignIn}>
                                <FcGoogle size={20} />
                                Regístrate con Google
                            </button>

                            <p className="terms-text">
                                By signing up, you agree to our <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
                            </p>

                            <button className="btn-secondary-login" onClick={() => navigate('/login')}>
                                ¿Ya tienes cuenta? Entra
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;