import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, User } from "firebase/auth";

interface FirestoreUserData {
    firstName?: string;
    lastName?: string;
    userName?: string;  // Compatibilidad
    userLastName?: string;  // Compatibilidad
    email: string;
    userRole: 'CLIENT' | 'TRAINER';
    photoURL?: string;
    userPhotoURL?: string;  // Compatibilidad
    isActive?: boolean;
}

interface LoginState {
    loading: boolean;
    error: string;
    email: string;
    password: string;
}

export const useLoginDomain = () => {
    const [state, setState] = useState<LoginState>({
        loading: false,
        error: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    };

    const setError = (error: string) => {
        setState(prev => ({ ...prev, error }));
    };

    const setEmail = (email: string) => {
        setState(prev => ({ ...prev, email }));
    };

    const setPassword = (password: string) => {
        setState(prev => ({ ...prev, password }));
    };

    const validateUserData = (userData: unknown): userData is FirestoreUserData => {
        if (!userData || typeof userData !== 'object') {
            return false;
        }

        const data = userData as Record<string, unknown>;

        return (
            typeof data.email === 'string' &&
            (data.userRole === 'CLIENT' || data.userRole === 'TRAINER')
        );
    };

    const redirectUserByRole = (role: string) => {
        if (role === 'TRAINER') {
            navigate('/trainerdashboard', { replace: true });
        } else if (role === 'CLIENT') {
            navigate('/clientdashboard', { replace: true });
        } else {
            console.error('Unknown user role:', role);
            setError('❌ Rol de usuario no válido.');
            auth.signOut();
        }
    };

    const validateAndProcessUser = async (user: User) => {
        // Buscar el documento del usuario en Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            setError('❌ Usuario no encontrado en la base de datos.');
            await auth.signOut();
            return false;
        }

        const userData = userDoc.data();

        // Validar estructura de datos
        if (!validateUserData(userData)) {
            console.error('Invalid user data structure:', userData);
            setError('❌ Datos de usuario incompletos. Contacta al soporte.');
            await auth.signOut();
            return false;
        }

        // Verificar que la cuenta está activa
        if (userData.isActive === false) {
            setError('❌ Tu cuenta está desactivada. Contacta al soporte.');
            await auth.signOut();
            return false;
        }

        // Redirigir según el rol
        const role = userData.userRole;
        console.log('User role:', role, 'Redirecting...');
        redirectUserByRole(role);
        return true;
    };

    const handleGoogleSignIn = async () => {
        if (state.loading) return;

        setError('');
        setLoading(true);

        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        try {
            const result = await signInWithPopup(auth, provider);
            const user: User = result.user;

            if (!user.email) {
                throw new Error('NO_EMAIL_PROVIDED');
            }

            // Validación adicional para Google (email match)
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                setError('❌ Tu cuenta de Google no está registrada en nuestra base de datos.');
                await auth.signOut();
                return;
            }

            const userData = userDoc.data();
            if (!validateUserData(userData)) {
                console.error('Invalid user data structure:', userData);
                setError('❌ Datos de usuario incompletos. Contacta al soporte.');
                await auth.signOut();
                return;
            }

            if (userData.email !== user.email) {
                console.error('Email mismatch:', {
                    firebaseEmail: user.email,
                    firestoreEmail: userData.email
                });
                setError('❌ Email no coincide con el perfil registrado.');
                await auth.signOut();
                return;
            }

            if (userData.isActive === false) {
                setError('❌ Tu cuenta está desactivada. Contacta al soporte.');
                await auth.signOut();
                return;
            }

            redirectUserByRole(userData.userRole);

        } catch (error) {
            console.error("Error en login con Google:", error);

            try {
                await auth.signOut();
            } catch (signOutError) {
                console.error("Error cerrando sesión:", signOutError);
            }

            if (error instanceof Error) {
                switch (error.message) {
                    case 'NO_EMAIL_PROVIDED':
                        setError('❌ No se pudo obtener el email de Google.');
                        break;
                    default:
                        if (error.message.includes('popup-closed-by-user')) {
                            setError('Proceso de login cancelado.');
                        } else if (error.message.includes('popup-blocked')) {
                            setError('El popup fue bloqueado. Permite popups para este sitio.');
                        } else if (error.message.includes('network-request-failed')) {
                            setError('Error de conexión. Verifica tu internet.');
                        } else {
                            setError('❌ No se pudo iniciar sesión con Google.');
                        }
                }
            } else {
                setError('❌ Error inesperado al iniciar sesión.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (state.loading) return;

        // Validación básica
        if (!state.email.trim() || !state.password.trim()) {
            setError('❌ Por favor completa todos los campos.');
            return;
        }

        if (!state.email.includes('@')) {
            setError('❌ Ingresa un email válido.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await signInWithEmailAndPassword(auth, state.email, state.password);
            const user: User = result.user;

            await validateAndProcessUser(user);

        } catch (error) {
            console.error("Error en login con email:", error);

            if (error instanceof Error) {
                switch (error.message) {
                    case 'Firebase: Error (auth/user-not-found).':
                        setError('❌ No existe una cuenta con este email.');
                        break;
                    case 'Firebase: Error (auth/wrong-password).':
                        setError('❌ Contraseña incorrecta.');
                        break;
                    case 'Firebase: Error (auth/invalid-email).':
                        setError('❌ Email no válido.');
                        break;
                    case 'Firebase: Error (auth/user-disabled).':
                        setError('❌ Esta cuenta ha sido deshabilitada.');
                        break;
                    case 'Firebase: Error (auth/too-many-requests).':
                        setError('❌ Demasiados intentos. Intenta más tarde.');
                        break;
                    default:
                        if (error.message.includes('network-request-failed')) {
                            setError('❌ Error de conexión. Verifica tu internet.');
                        } else {
                            setError('❌ Error al iniciar sesión. Verifica tus datos.');
                        }
                }
            } else {
                setError('❌ Error inesperado al iniciar sesión.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        state,
        setEmail,
        setPassword,
        handleEmailLogin,
        handleGoogleSignIn
    };
};