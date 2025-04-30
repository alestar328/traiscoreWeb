
import '../../styles/RegisterPage.css';
import registerPic from "../../assets/register_mainpic.png";
import { FcGoogle } from 'react-icons/fc';
import {UserProfile} from "../../models/UserProfile.tsx";
import {useState} from "react";
import UserProfileForm from "./UserProfileForm.tsx";
import {signInWithGoogle} from "../../firebase/firebaseConfig.tsx";



function RegisterPage() {

    const [user, setUser] = useState<UserProfile | null>(null);
    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            setUser(user); // <-- esto carga tu formulario con datos reales
        } catch (error) {
            console.error("Error en login con Google:", error);
        }
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
                    {user ? (
                        <UserProfileForm user={user} />
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

                            <button className="btn-secondary-login">
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
