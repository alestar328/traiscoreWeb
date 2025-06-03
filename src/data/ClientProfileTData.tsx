import { doc, getDoc, Timestamp, collection, getDocs, query, orderBy } from "firebase/firestore";
import {BodyStats, UserEntity} from "../models/UserEntity.tsx";
import {db} from "../firebase/firebaseConfig.tsx";


export interface ClientData {
    firstName: string;
    lastName: string;
    email: string;
    birthYear: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
    photoURL: string;
}

export interface BodyStatsData {
    bodyStats: BodyStats | null;
    bodyStatsHistory: BodyStats[];
}

export class ClientProfileTData {
    /**
     * Obtiene los datos básicos del cliente desde Firebase
     */
    static async getClientData(uid: string): Promise<ClientData> {
        const clientRef = doc(db, "users", uid);
        const clientSnap = await getDoc(clientRef);

        if (!clientSnap.exists()) {
            throw new Error('Cliente no encontrado');
        }

        const data = clientSnap.data() as UserEntity;

        return {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            birthYear: data.birthYear ? data.birthYear.toString() : '',
            gender: data.gender || '',
            photoURL: data.photoURL || ''
        };
    }

    /**
     * Verifica si el cliente está vinculado al entrenador actual
     */
    static async verifyTrainerAccess(uid: string, currentTrainerUid: string): Promise<boolean> {
        const clientRef = doc(db, "users", uid);
        const clientSnap = await getDoc(clientRef);

        if (!clientSnap.exists()) {
            return false;
        }

        const data = clientSnap.data() as UserEntity;
        return data.linkedTrainerUid === currentTrainerUid;
    }

    /**
     * Obtiene las medidas corporales del cliente (actual e historial)
     */
    static async getBodyStats(uid: string): Promise<BodyStatsData> {
        try {
            const bodyStatsRef = collection(db, "users", uid, "bodyStats");
            const bodyStatsQuery = query(
                bodyStatsRef,
                orderBy("createdAt", "desc")
            );

            const bodyStatsSnap = await getDocs(bodyStatsQuery);

            if (bodyStatsSnap.empty) {
                return {
                    bodyStats: null,
                    bodyStatsHistory: []
                };
            }

            const allBodyStats: BodyStats[] = bodyStatsSnap.docs.map(doc => {
                const rawBodyStats = doc.data();
                return {
                    userId: doc.id,
                    height: parseFloat(rawBodyStats.measurements?.Height || '0') || 0,
                    weight: parseFloat(rawBodyStats.measurements?.Weight || '0') || 0,
                    neck: parseFloat(rawBodyStats.measurements?.Neck || '0') || 0,
                    chest: parseFloat(rawBodyStats.measurements?.Chest || '0') || 0,
                    arms: parseFloat(rawBodyStats.measurements?.Arms || '0') || 0,
                    waist: parseFloat(rawBodyStats.measurements?.Waist || '0') || 0,
                    thigh: parseFloat(rawBodyStats.measurements?.Thigh || '0') || 0,
                    calf: parseFloat(rawBodyStats.measurements?.Calf || '0') || 0,
                    measurementDate: rawBodyStats.createdAt || rawBodyStats.updatedAt || Timestamp.now(),
                    createdAt: rawBodyStats.createdAt,
                    updatedAt: rawBodyStats.updatedAt
                };
            });

            return {
                bodyStats: allBodyStats[0] || null,
                bodyStatsHistory: allBodyStats
            };
        } catch (error) {
            console.error('Error cargando bodyStats:', error);
            return {
                bodyStats: null,
                bodyStatsHistory: []
            };
        }
    }
}