import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import {registerFireDB} from "../config/RegisterFireDB.tx.tsx";

interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
    userRole: 'CLIENT' | 'TRAINER' | '';
}

interface RegisterState {
    loading: boolean;
    error: string;
    success: boolean;
}

export const useRegisterDomain = () => {
    const [formData, setFormData] = useState<RegisterFormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        gender: '',
        userRole: ''
    });

    const [state, setState] = useState<RegisterState>({
        loading: false,
        error: '',
        success: false
    });

    const auth = getAuth();

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    };

    const setError = (error: string) => {
        setState(prev => ({ ...prev, error }));
    };

    const setSuccess = (success: boolean) => {
        setState(prev => ({ ...prev, success }));
    };

    const updateField = (field: keyof RegisterFormState, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (state.error) setError('');
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthDate: '',
            gender: '',
            userRole: ''
        });
        setState({
            loading: false,
            error: '',
            success: false
        });
    };

    const validateForm = (): string | null => {
        if (!formData.firstName.trim()) return 'El nombre es requerido';
        if (!formData.lastName.trim()) return 'El apellido es requerido';
        if (!formData.email.trim()) return 'El email es requerido';
        if (!formData.password) return 'La contraseña es requerida';
        if (!formData.confirmPassword) return 'Confirma tu contraseña';
        if (!formData.birthDate) return 'La fecha de nacimiento es requerida';
        if (!formData.gender) return 'Selecciona tu género';
        if (!formData.userRole) return 'Selecciona el tipo de cuenta';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return 'Ingresa un email válido';
        }

        if (formData.password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            return 'Las contraseñas no coinciden';
        }

        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 13) {
            return 'Debes tener al menos 13 años para registrarte';
        }

        return null;
    };

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (state.loading) return;

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            // 1. Crear usuario en Firebase Auth
            const result = await createUserWithEmailAndPassword(
                auth,
                formData.email.toLowerCase().trim(),
                formData.password
            );

            const user = result.user;

            // 2. Actualizar perfil de Firebase Auth
            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`.trim()
            });

            // 3. Crear perfil en Firestore
            await registerFireDB.createUser({
                uid: user.uid,
                email: user.email!,
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthYear: new Date(formData.birthDate).getFullYear(),
                gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
                userRole: formData.userRole as 'CLIENT' | 'TRAINER'
            });

            setSuccess(true);
            console.log('✅ Usuario registrado exitosamente');

            setTimeout(() => {
                resetForm();
            }, 2000);

        } catch (error: unknown) {
            console.error("Error en registro:", error);

            // Cleanup en caso de error
            try {
                if (auth.currentUser) {
                    await auth.currentUser.delete();
                    console.log('🧹 Usuario de Auth eliminado tras error');
                }
            } catch (cleanupError) {
                console.warn('Error limpiando usuario de Auth:', cleanupError);
            }

            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setError('❌ Ya existe una cuenta con este email');
                        break;
                    case 'auth/invalid-email':
                        setError('❌ Email no válido');
                        break;
                    case 'auth/operation-not-allowed':
                        setError('❌ Registro con email no habilitado');
                        break;
                    case 'auth/weak-password':
                        setError('❌ La contraseña es muy débil');
                        break;
                    case 'auth/network-request-failed':
                        setError('❌ Error de conexión. Verifica tu internet');
                        break;
                    default:
                        setError('❌ Error del servidor. Intenta más tarde');
                }
            } else if (error instanceof Error) {
                if (error.message.includes('ya existe')) {
                    setError('❌ Ya existe una cuenta con estos datos');
                } else if (error.message.includes('base de datos')) {
                    setError('❌ Error guardando en base de datos. Intenta más tarde');
                } else {
                    setError(`❌ ${error.message}`);
                }
            } else {
                setError('❌ Error inesperado al crear la cuenta');
            }
        } finally {
            setLoading(false);
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        return maxDate.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        return minDate.toISOString().split('T')[0];
    };

    const isFormValid = () => {
        return Object.values(formData).every(value => value.trim() !== '') &&
            formData.password === formData.confirmPassword &&
            formData.password.length >= 6;
    };

    return {
        formData,
        state,
        updateField,
        handleEmailRegister,
        resetForm,
        getMaxDate,
        getMinDate,
        isFormValid
    };
};