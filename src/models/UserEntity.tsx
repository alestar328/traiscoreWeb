import {Timestamp, Firestore, CollectionReference, DocumentReference} from "@firebase/firestore";
import {collection, doc} from "firebase/firestore";


export type UserRole = 'CLIENT' | 'TRAINER';

export interface UserEntity {
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

export interface TrainerProfile extends UserEntity {
    userRole: 'TRAINER';
}

export interface ClientProfile extends UserEntity {
    userRole: 'CLIENT';
}

// Estructura para las medidas corporales (subcolección bodyStats)
export interface BodyStats {
    userId?: string;              // ID del documento
    height: number;
    weight: number;
    neck: number;
    chest: number;
    arms: number;
    waist: number;
    thigh: number;
    calf: number;
    measurementDate: Timestamp;  // Fecha de la medición
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}



export const getUserStatsRef = (db: Firestore, userId: string): CollectionReference => {
    return collection(db, "users", userId, "bodyStats");
};

export const getUserDocRef = (db: Firestore, userId: string): DocumentReference => {
    return doc(db, "users", userId);
};

// Función para obtener las medidas más recientes
export const getLatestBodyStats = (bodyStats: BodyStats[]): BodyStats | null => {
    if (!bodyStats || bodyStats.length === 0) return null;

    return bodyStats.reduce((latest, current) => {
        const latestDate = latest.measurementDate.toDate();
        const currentDate = current.measurementDate.toDate();
        return currentDate > latestDate ? current : latest;
    });
};
