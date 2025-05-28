import {Timestamp} from "@firebase/firestore";

export type UserRole = 'CLIENT' | 'TRAINER';

export interface UserProfile {
    uid: string;
    email: string;
    firstName: string;        // Cambio: era userName
    lastName: string;         // Cambio: era userLastName
    photoURL?: string;        // Cambio: era userPhotoURL
    birthYear?: number;       // Cambio: era birthDate (Date)
    gender?: 'MALE' | 'FEMALE' | 'OTHER';  // Cambio: valores lowercase
    userRole: UserRole;
    createdAt?: Timestamp;    // Cambio: usar Timestamp en lugar de Date
    updatedAt?: Timestamp;    // Nuevo: para coincidir con Android
    isActive?: boolean;       // Nuevo: para coincidir con Android
    linkedTrainerUid?: string;
}

export interface TrainerProfile extends UserProfile {
    userRole: 'TRAINER';
}


export interface ClientProfile extends UserProfile {
    userRole: 'CLIENT';
    measurements?: {
        height: number;      // Cambio: era heightCm
        weight: number;      // Cambio: era weightKg
        neck: number;        // Cambio: era neckCm
        chest: number;       // Cambio: era chestCm
        arms: number;        // Cambio: era armsCm
        waist: number;       // Cambio: era waistCm
        thigh: number;       // Cambio: era thighCm
        calf: number;        // Cambio: era calfCm
        lastUpdated?: Timestamp;
    };
}

export interface ClientFirestoreData {
    // Datos básicos (nombres cambiados)
    firstName: string;       // Cambio: era userName
    lastName: string;        // Cambio: era userLastName
    email: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';  // Cambio: valores lowercase
    photoURL?: string;       // Cambio: era userPhotoURL

    // Fechas (estructura simplificada)
    birthYear?: number;      // Cambio: era birthDate (Date/Timestamp)
    createdAt?: Timestamp;
    updatedAt?: Timestamp;   // Nuevo
    isActive?: boolean;      // Nuevo

    // Medidas corporales (nombres simplificados)
    measurements?: {
        height: number;      // Cambio: nombres simplificados
        weight: number;
        neck: number;
        chest: number;
        arms: number;
        waist: number;
        thigh: number;
        calf: number;
        lastUpdated?: Timestamp;
    };

    // Relación con el entrenador
    linkedTrainerUid: string;
}

export interface LegacyClientData {
    userName: string;
    userLastName: string;
    userPhotoURL?: string;
    birthDate?: Date | string;
    measurements?: {
        heightCm?: number;
        weightKg?: number;
        neckCm?: number;
        chestCm?: number;
        armsCm?: number;
        waistCm?: number;
        thighCm?: number;
        calfCm?: number;
    };
}

// Función de conversión para migrar datos existentes
export const convertLegacyToNew = (legacy: LegacyClientData): Partial<ClientFirestoreData> => {
    const birthYear = legacy.birthDate
        ? new Date(legacy.birthDate).getFullYear()
        : undefined;

    return {
        firstName: legacy.userName,
        lastName: legacy.userLastName,
        photoURL: legacy.userPhotoURL,
        birthYear,
        measurements: legacy.measurements ? {
            height: legacy.measurements.heightCm || 0,
            weight: legacy.measurements.weightKg || 0,
            neck: legacy.measurements.neckCm || 0,
            chest: legacy.measurements.chestCm || 0,
            arms: legacy.measurements.armsCm || 0,
            waist: legacy.measurements.waistCm || 0,
            thigh: legacy.measurements.thighCm || 0,
            calf: legacy.measurements.calfCm || 0,
        } : undefined
    }
}