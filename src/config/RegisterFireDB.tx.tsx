import { doc, getFirestore, setDoc, getDoc } from "firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import { UserEntity, UserRole } from "../models/UserEntity";

interface RegisterUserData {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    birthYear: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    userRole: UserRole;
    photoURL?: string;
}

export class RegisterFireDB {
    private db = getFirestore();

    /**
     * Filtra campos undefined de un objeto para Firestore
     */
    private filterUndefined<T>(obj: T): Partial<T> {
        const filtered = {} as Partial<T>;
        const entries = Object.entries(obj as Record<string, unknown>);
        for (const [key, value] of entries) {
            if (value !== undefined) {
                (filtered as Record<string, unknown>)[key] = value;
            }
        }
        return filtered;
    }

    /**
     * Verifica si ya existe un usuario con el UID dado
     */
    async checkUserExists(uid: string): Promise<boolean> {
        try {
            const userDocRef = doc(this.db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            return userDoc.exists();
        } catch (error) {
            console.error('Error checking if user exists:', error);
            throw new Error('Error verificando usuario existente');
        }
    }




    /**
     * Crea un nuevo usuario en la colección 'users'
     */
    async createUser(userData: RegisterUserData): Promise<UserEntity> {
        try {
            // Verificar si el usuario ya existe
            const userExists = await this.checkUserExists(userData.uid);
            if (userExists) {
                throw new Error('El usuario ya existe en la base de datos');
            }

            // Crear el perfil de usuario
            const userEntity: UserEntity = {
                uid: userData.uid,
                email: userData.email.toLowerCase().trim(),
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                birthYear: userData.birthYear,
                gender: userData.gender,
                userRole: userData.userRole,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                isActive: true,
                // Solo añadir photoURL si existe
                ...(userData.photoURL && { photoURL: userData.photoURL }),
                // linkedTrainerUid se omite si es undefined
            };

            // Filtrar campos undefined antes de guardar
            const cleanUserEntity = this.filterUndefined(userEntity);

            // Guardar en Firestore
            const userDocRef = doc(this.db, 'users', userData.uid);
            await setDoc(userDocRef, cleanUserEntity);

            console.log('✅ Usuario creado exitosamente en Firestore:', userData.uid);
            return userEntity;

        } catch (error) {
            console.error('Error creating user in Firestore:', error);

            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Error inesperado al crear usuario en la base de datos');
            }
        }
    }

    /**
     * Actualiza un usuario existente
     */
    async updateUser(uid: string, updates: Partial<UserEntity>): Promise<void> {
        try {
            const userDocRef = doc(this.db, 'users', uid);

            // Verificar que el usuario existe
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                throw new Error('Usuario no encontrado');
            }

            // Filtrar campos undefined y añadir timestamp
            const cleanUpdates = this.filterUndefined({
                ...updates,
                updatedAt: Timestamp.now()
            });

            // Actualizar con merge
            await setDoc(userDocRef, cleanUpdates, { merge: true });

            console.log('✅ Usuario actualizado exitosamente:', uid);

        } catch (error) {
            console.error('Error updating user:', error);

            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Error inesperado al actualizar usuario');
            }
        }
    }

    /**
     * Obtiene un usuario por su UID
     */
    async getUser(uid: string): Promise<UserEntity | null> {
        try {
            const userDocRef = doc(this.db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return null;
            }

            const userData = userDoc.data();

            // Validar estructura de datos
            if (!userData.email || !userData.userRole) {
                throw new Error('Datos de usuario incompletos en Firestore');
            }

            return userData as UserEntity;

        } catch (error) {
            console.error('Error getting user:', error);

            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Error inesperado al obtener usuario');
            }
        }
    }

    /**
     * Desactiva un usuario (soft delete)
     */
    async deactivateUser(uid: string): Promise<void> {
        try {
            await this.updateUser(uid, {
                isActive: false
            });

            console.log('✅ Usuario desactivado:', uid);

        } catch (error) {
            console.error('Error deactivating user:', error);
            throw error;
        }
    }

    /**
     * Activa un usuario
     */
    async activateUser(uid: string): Promise<void> {
        try {
            await this.updateUser(uid, {
                isActive: true
            });

            console.log('✅ Usuario activado:', uid);

        } catch (error) {
            console.error('Error activating user:', error);
            throw error;
        }
    }

    /**
     * Vincula un cliente con un entrenador
     */
    async linkClientToTrainer(clientUid: string, trainerUid: string): Promise<void> {
        try {
            // Verificar que el entrenador existe y es TRAINER
            const trainer = await this.getUser(trainerUid);
            if (!trainer || trainer.userRole !== 'TRAINER') {
                throw new Error('Entrenador no válido');
            }

            // Verificar que el cliente existe y es CLIENT
            const client = await this.getUser(clientUid);
            if (!client || client.userRole !== 'CLIENT') {
                throw new Error('Cliente no válido');
            }

            // Vincular cliente al entrenador
            await this.updateUser(clientUid, {
                linkedTrainerUid: trainerUid
            });

            console.log('✅ Cliente vinculado al entrenador:', { clientUid, trainerUid });

        } catch (error) {
            console.error('Error linking client to trainer:', error);
            throw error;
        }
    }


}

// Instancia singleton para usar en toda la aplicación
export const registerFireDB = new RegisterFireDB();