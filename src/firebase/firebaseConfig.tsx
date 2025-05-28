
import {initializeApp} from "firebase/app";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {UserEntity} from "../models/UserEntity.tsx";
import { getAuth , signInWithPopup, GoogleAuthProvider, UserCredential} from 'firebase/auth';
import { getStorage } from "firebase/storage";
import {Timestamp} from "@firebase/firestore";




const firebaseConfig = {
    apiKey: "AIzaSyC7qqh_tY4nk2FZVpOa_3gQ8kF6Phh2qEQ",
    authDomain: "traiscore.firebaseapp.com",
    projectId: "traiscore",
    storageBucket: "traiscore.firebasestorage.app",
    messagingSenderId: "484079628970",
    appId: "1:484079628970:web:04911d7f2a445593add6d3",
    measurementId: "G-VBNGHDFH9M"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserEntity> => {
    const result: UserCredential = await signInWithPopup(auth, provider);
    const googleUser = result.user;

    const fullName = googleUser.displayName?.split(' ') || [];


    const userProfile: UserEntity = {
        uid: googleUser.uid,
        firstName: fullName[0] || '',                    // Cambio: era userName
        lastName: fullName.slice(1).join(' ') || '',     // Cambio: era userLastName
        email: googleUser.email || '',
        photoURL: googleUser.photoURL || undefined,      // Cambio: era userPhotoURL
        userRole: 'CLIENT', // Default
        createdAt: Timestamp.now(),                      // Cambio: era solo Timestamp
        updatedAt: Timestamp.now(),                      // Nuevo campo
        isActive: true,                                  // Nuevo campo
        // birthYear se puede agregar después en el formulario de perfil
    };

    const userDocRef = doc(db, 'users', userProfile.uid);
    const existingUser = await getDoc(userDocRef);

    if (!existingUser.exists()) {
        await setDoc(userDocRef, {
            ...userProfile,
            // Convertir Timestamps a formato serializable
            createdAt: userProfile.createdAt,
            updatedAt: userProfile.updatedAt
        });
        console.log('✅ Usuario nuevo creado en Firestore');
    } else {
        console.log('🔁 Usuario ya existente');
        // Actualizar campos si es necesario
        const existingData = existingUser.data() as UserEntity;

        // Actualizar solo si hay cambios
        const needsUpdate =
            existingData.photoURL !== userProfile.photoURL ||
            existingData.email !== userProfile.email;

        if (needsUpdate) {
            await setDoc(userDocRef, {
                ...existingData,
                photoURL: userProfile.photoURL,
                email: userProfile.email,
                updatedAt: Timestamp.now()
            }, { merge: true });
            console.log('✅ Usuario actualizado en Firestore');
        }
    }

    return userProfile;
};

export const createUserProfile = async (userData: Partial<UserEntity>): Promise<void> => {
    if (!userData.uid) {
        throw new Error('UID es requerido para crear perfil');
    }

    const userProfile: UserEntity = {
        uid: userData.uid,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        photoURL: userData.photoURL,
        birthYear: userData.birthYear,
        gender: userData.gender,
        userRole: userData.userRole || 'CLIENT',
        createdAt: userData.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: userData.isActive ?? true,
        linkedTrainerUid: userData.linkedTrainerUid
    };

    const userDocRef = doc(db, 'users', userProfile.uid);
    await setDoc(userDocRef, userProfile);
    console.log('✅ Perfil de usuario creado completamente');
};

// Función para actualizar perfil de usuario
export const updateUserProfile = async (
    uid: string,
    updates: Partial<UserEntity>
): Promise<void> => {
    const userDocRef = doc(db, 'users', uid);

    await setDoc(userDocRef, {
        ...updates,
        updatedAt: Timestamp.now()
    }, { merge: true });


};