import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { UserEntity } from "../models/UserEntity.tsx";
import { doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";

interface AuthState {
    loading: boolean;
    error: string | null;
    initialized: boolean; // Nuevo: indica si el contexto ya se inicializó
}

interface AuthContextType {
    currentUser: UserEntity | null;
    firebaseUser: User | null;
    state: AuthState;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean; // Nuevo: helper para verificar autenticación
    isReady: boolean; // Nuevo: indica si el contexto está listo para usar
}

// Tipo para los datos raw de Firestore
interface FirestoreUserData {
    firstName?: string;
    lastName?: string;
    email: string;
    photoURL?: string;
    userPhotoURL?: string;
    birthYear?: number;
    birthDate?: Timestamp;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    userRole: 'CLIENT' | 'TRAINER';
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    isActive?: boolean;
    linkedTrainerUid?: string;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    firebaseUser: null,
    state: { loading: true, error: null, initialized: false },
    signOut: async () => {},
    refreshUser: async () => {},
    isAuthenticated: false,
    isReady: false,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [state, setState] = useState<AuthState>({
        loading: true,
        error: null,
        initialized: false
    });

    const auth = getAuth();
    const db = getFirestore();

    // Funciones helper para actualizar estado
    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    const setInitialized = useCallback((initialized: boolean) => {
        setState(prev => ({ ...prev, initialized }));
    }, []);

    // Función para obtener año de nacimiento
    const getBirthYear = useCallback((data: FirestoreUserData): number | undefined => {
        if (data.birthYear) return data.birthYear;
        if (data.birthDate) {
            return data.birthDate.toDate().getFullYear();
        }
        return undefined;
    }, []);

    // Función para obtener perfil de usuario desde Firestore
    const fetchUserProfile = useCallback(async (user: User): Promise<UserEntity | null> => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                console.warn(`No user document found for uid: ${user.uid}`);
                return null;
            }

            const profileData = userSnapshot.data() as FirestoreUserData;

            // Validar estructura de datos críticos
            if (!profileData.userRole || !profileData.email) {
                console.error('Invalid user data structure:', profileData);
                throw new Error('Datos de usuario incompletos');
            }

            // Validar que el email coincida
            if (profileData.email !== user.email) {
                console.error('Email mismatch:', {
                    firebaseEmail: user.email,
                    firestoreEmail: profileData.email
                });
                throw new Error('Email no coincide con el perfil');
            }

            // Verificar que la cuenta esté activa
            if (profileData.isActive === false) {
                throw new Error('Cuenta desactivada');
            }

            // Crear perfil de usuario
            const userProfile: UserEntity = {
                uid: user.uid,
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: user.email!,
                photoURL: profileData.photoURL || profileData.userPhotoURL,
                birthYear: getBirthYear(profileData),
                gender: profileData.gender,
                userRole: profileData.userRole,
                createdAt: profileData.createdAt,
                updatedAt: profileData.updatedAt,
                isActive: profileData.isActive ?? true,
                linkedTrainerUid: profileData.linkedTrainerUid
            };

            console.log('✅ Perfil de usuario cargado:', user.uid);
            return userProfile;

        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }, [db, getBirthYear]);

    // Función para refrescar usuario
    const refreshUser = useCallback(async (): Promise<void> => {
        if (!firebaseUser) {
            console.warn('No hay usuario de Firebase para refrescar');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const profile = await fetchUserProfile(firebaseUser);
            setCurrentUser(profile);

            if (!profile) {
                console.warn('No se pudo cargar el perfil del usuario');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar datos del usuario';
            console.error('Error refreshing user:', error);
            setError(errorMessage);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, [firebaseUser, fetchUserProfile, setLoading, setError]);

    // Función para cerrar sesión
    const signOut = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            await firebaseSignOut(auth);

            // Limpiar estado
            setCurrentUser(null);
            setFirebaseUser(null);
            setError(null);

            console.log('✅ Sesión cerrada correctamente');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
            console.error('Error signing out:', error);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [auth, setLoading, setError]);

    // Valores calculados
    const isAuthenticated = Boolean(currentUser && firebaseUser);
    const isReady = state.initialized && !state.loading;

    // Effect principal para manejar cambios de autenticación
    useEffect(() => {
        setLoading(true);
        setInitialized(false);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setFirebaseUser(user);
                setError(null);

                if (user) {
                    console.log('🔐 Usuario autenticado:', user.uid);

                    try {
                        const profile = await fetchUserProfile(user);
                        setCurrentUser(profile);

                        if (!profile) {
                            console.warn('⚠️ Usuario autenticado pero sin perfil');
                            // Opcional: redirigir a completar perfil
                        }
                    } catch (profileError) {
                        const errorMessage = profileError instanceof Error ? profileError.message : 'Error al cargar perfil';
                        console.error('❌ Error cargando perfil:', profileError);
                        setError(errorMessage);
                        setCurrentUser(null);

                        // Auto-logout en errores críticos
                        if (errorMessage.includes('incompletos') ||
                            errorMessage.includes('no coincide') ||
                            errorMessage.includes('desactivada')) {
                            console.log('🚪 Cerrando sesión por error crítico');
                            await signOut();
                        }
                    }
                } else {
                    console.log('🚪 Usuario no autenticado');
                    setCurrentUser(null);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error en autenticación';
                console.error('❌ Error en cambio de estado de auth:', error);
                setError(errorMessage);
                setCurrentUser(null);
                setFirebaseUser(null);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        });

        return () => {
            console.log('🧹 Limpiando listener de auth');
            unsubscribe();
        };
    }, [auth, fetchUserProfile, setLoading, setError, setInitialized, signOut]);

    // Debug logging (solo en desarrollo)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Auth State:', {
                firebaseUser: firebaseUser?.uid || null,
                currentUser: currentUser?.uid || null,
                loading: state.loading,
                error: state.error,
                initialized: state.initialized,
                isAuthenticated,
                isReady
            });
        }
    }, [firebaseUser, currentUser, state, isAuthenticated, isReady]);

    const value: AuthContextType = {
        currentUser,
        firebaseUser,
        state,
        signOut,
        refreshUser,
        isAuthenticated,
        isReady
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};