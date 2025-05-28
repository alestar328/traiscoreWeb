import '../../styles/RegisterPage.css';
import registerPic from "../../assets/register_mainpic.png";
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../contexts/RegistrationContext.tsx";
import { useState } from "react";
import UserProfileFormWrapper from "./UserProfileFormWrapper.tsx";
import '../../styles/UserProfile.css';
import {useRegisterDomain} from "../../domain/RegisterDomain.tsx";

function RegisterPage() {
    const { pendingUser, registerWithGoogle, clearPendingUser } = useRegistration();
    const navigate = useNavigate();
    const [showProfileForm, setShowProfileForm] = useState(false);

    // Usar el dominio de registro
    const {
        formData,
        state,
        updateField,
        handleEmailRegister,
        getMaxDate,
        getMinDate,
        isFormValid
    } = useRegisterDomain();

    const handleGoogleSignIn = async () => {
        const ok = await registerWithGoogle();
        if (ok) setShowProfileForm(true);
    };

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

                            {/* FORMULARIO DE REGISTRO CON EMAIL */}
                            <form className="register-form" onSubmit={handleEmailRegister}>
                                <div className="form-row">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            value={formData.firstName}
                                            onChange={(e) => updateField('firstName', e.target.value)}
                                            className="register-input"
                                            disabled={state.loading}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Apellido"
                                            value={formData.lastName}
                                            onChange={(e) => updateField('lastName', e.target.value)}
                                            className="register-input"
                                            disabled={state.loading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="register-input"
                                        disabled={state.loading}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Contraseña (mín. 6 caracteres)"
                                        value={formData.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        className="register-input"
                                        disabled={state.loading}
                                        minLength={6}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Repetir contraseña"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                                        className="register-input"
                                        disabled={state.loading}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="date"
                                        placeholder="Fecha de nacimiento"
                                        value={formData.birthDate}
                                        onChange={(e) => updateField('birthDate', e.target.value)}
                                        className="register-input"
                                        disabled={state.loading}
                                        min={getMinDate()}
                                        max={getMaxDate()}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => updateField('gender', e.target.value)}
                                            className="register-select"
                                            disabled={state.loading}
                                            required
                                        >
                                            <option value="">Género</option>
                                            <option value="MALE">Masculino</option>
                                            <option value="FEMALE">Femenino</option>
                                            <option value="OTHER">Otro</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <select
                                            value={formData.userRole}
                                            onChange={(e) => updateField('userRole', e.target.value)}
                                            className="register-select"
                                            disabled={state.loading}
                                            required
                                        >
                                            <option value="">Tipo de cuenta</option>
                                            <option value="CLIENT">Cliente</option>
                                            <option value="TRAINER">Entrenador</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-register"
                                    disabled={state.loading || !isFormValid()}
                                >
                                    {state.loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Creando cuenta...
                                        </>
                                    ) : (
                                        'Crear cuenta'
                                    )}
                                </button>
                            </form>

                            {/* MOSTRAR MENSAJES */}
                            {state.error && (
                                <div className="error-message" role="alert">
                                    {state.error}
                                </div>
                            )}

                            {state.success && (
                                <div className="success-message" role="status">
                                    ✅ ¡Cuenta creada exitosamente! Bienvenido/a.
                                </div>
                            )}

                            <div className="divider">
                                <span>o</span>
                            </div>

                            <button
                                className="btn-google"
                                onClick={handleGoogleSignIn}
                                disabled={state.loading}
                            >
                                <FcGoogle size={20} />
                                Regístrate con Google
                            </button>

                            <p className="terms-text">
                                By signing up, you agree to our <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
                            </p>

                            <button
                                className="btn-secondary-login"
                                onClick={() => navigate('/login')}
                                disabled={state.loading}
                            >
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