import {Timestamp} from "@firebase/firestore";

export type UserRole = 'client' | 'trainer';

export interface UserProfile {
    uid: string;
    email: string;
    userName: string;
    userLastName: string;
    userPhotoURL?: string;
    birthDate?: Date;
    userRole: UserRole;
    createdAt?: Date;
    linkedTrainerUid?: string;
}

export interface TrainerProfile extends UserProfile {
    userRole: 'trainer';
}
type Kilograms = number;
type Centimeters = number;

export interface ClientProfile extends UserProfile {
    userRole: 'client';
    uid: string;
    gender?: 'male' | 'female' | 'other';
    measurements?: {
        heightCm?: Centimeters;
        weightKg?: Kilograms;
        neckCm?: Centimeters;
        chestCm?: Centimeters;
        armsCm?: Centimeters;
        waistCm?: Centimeters;
        thighCm?: Centimeters;
        calfCm?: Centimeters;
    };
}

export interface ClientFirestoreData {
    // Datos básicos
    userName: string;
    userLastName: string;
    email: string;
    gender?: 'male' | 'female' | 'other';
    userPhotoURL?: string;

    // Fechas
    birthDate?: Timestamp | Date | string;        // lo que venga de Firestore
    registrationDate: Timestamp | Date | string;  // fecha de alta
    createdAt?: Timestamp;                        // serverTimestamp()

    // Contacto y dirección
    phone?: string;
    address?: string;



    // Medidas corporales
    measurements?: {
        height: number;
        weight: number;
        neck: number;
        chest: number;
        arms: number;
        waist: number;
        thigh: number;
        calf: number;
    };

    // Relación con el entrenador
    linkedTrainerUid: string;
}