import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { UserEntity } from "../models/UserEntity.tsx";
import { db } from "../firebase/firebaseConfig.tsx";

export interface ClientInfo {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    linkedTrainerUid: string;
}

export class ClientStatsTData {
    /**
     * Obtiene información básica del cliente
     */
    static async getClientInfo(clientId: string): Promise<ClientInfo> {
        try {
            console.log('🔍 Obteniendo información del cliente:', clientId);

            if (!clientId || clientId.trim() === '') {
                throw new Error('ID de cliente no válido');
            }

            const clientRef = doc(db, "users", clientId);
            const clientSnap = await getDoc(clientRef);

            if (!clientSnap.exists()) {
                console.error('❌ Cliente no encontrado en Firestore:', clientId);
                throw new Error('Cliente no encontrado');
            }

            const data = clientSnap.data() as UserEntity;
            console.log('✅ Datos del cliente obtenidos:', {
                id: clientId,
                firstName: data.firstName,
                lastName: data.lastName,
                linkedTrainerUid: data.linkedTrainerUid
            });

            return {
                id: clientId,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                linkedTrainerUid: data.linkedTrainerUid || ''
            };
        } catch (error) {
            console.error('❌ Error obteniendo información del cliente:', error);
            throw error;
        }
    }

    /**
     * Verifica si el cliente pertenece al entrenador actual
     */
    static async verifyClientAccess(clientId: string, trainerId: string): Promise<boolean> {
        try {
            console.log('🔐 Verificando acceso del entrenador:', trainerId, 'al cliente:', clientId);

            if (!clientId || !trainerId) {
                console.error('❌ IDs no válidos para verificación de acceso');
                return false;
            }

            const clientInfo = await this.getClientInfo(clientId);
            const hasAccess = clientInfo.linkedTrainerUid === trainerId;

            console.log('🔐 Resultado de verificación de acceso:', hasAccess, {
                clientTrainer: clientInfo.linkedTrainerUid,
                currentTrainer: trainerId
            });

            return hasAccess;
        } catch (error) {
            console.error('❌ Error verificando acceso al cliente:', error);
            return false;
        }
    }

    /**
     * Verifica si el cliente tiene workoutEntries con mejor logging
     */
    static async hasWorkoutEntries(clientId: string): Promise<boolean> {
        try {
            console.log('🏋️ Verificando workoutEntries para cliente:', clientId);

            // Verificar que el clientId sea válido
            if (!clientId || clientId.trim() === '') {
                console.error('❌ ClientId no válido para workoutEntries:', clientId);
                return false;
            }

            // Primero verificar que el documento del usuario existe
            const userRef = doc(db, "users", clientId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error('❌ Usuario no encontrado para workoutEntries:', clientId);
                return false;
            }

            console.log('✅ Usuario encontrado, verificando subcollección workoutEntries...');

            // Ahora verificar la subcollección workoutEntries
            const workoutEntriesRef = collection(db, "users", clientId, "workoutEntries");
            const snapshot = await getDocs(workoutEntriesRef);

            const hasEntries = !snapshot.empty;
            console.log('🏋️ Resultado workoutEntries:', {
                clientId,
                hasEntries,
                totalDocs: snapshot.size,
                docs: snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
            });

            return hasEntries;
        } catch (error) {
            console.error('❌ Error verificando workoutEntries para cliente:', clientId, error);
            return false;
        }
    }

    /**
     * Verifica si el cliente tiene bodyStats con mejor logging
     */
    static async hasBodyStats(clientId: string): Promise<boolean> {
        try {
            console.log('📏 Verificando bodyStats para cliente:', clientId);

            // Verificar que el clientId sea válido
            if (!clientId || clientId.trim() === '') {
                console.error('❌ ClientId no válido para bodyStats:', clientId);
                return false;
            }

            // Primero verificar que el documento del usuario existe
            const userRef = doc(db, "users", clientId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error('❌ Usuario no encontrado para bodyStats:', clientId);
                return false;
            }

            console.log('✅ Usuario encontrado, verificando subcollección bodyStats...');

            // Ahora verificar la subcollección bodyStats
            const bodyStatsRef = collection(db, "users", clientId, "bodyStats");
            const snapshot = await getDocs(bodyStatsRef);

            const hasStats = !snapshot.empty;
            console.log('📏 Resultado bodyStats:', {
                clientId,
                hasStats,
                totalDocs: snapshot.size,
                docs: snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
            });

            return hasStats;
        } catch (error) {
            console.error('❌ Error verificando bodyStats para cliente:', clientId, error);
            return false;
        }
    }

    /**
     * Obtiene información completa del cliente con validaciones mejoradas
     */
    static async getCompleteClientInfo(clientId: string, trainerId: string): Promise<{
        clientInfo: ClientInfo;
        hasWorkouts: boolean;
        hasBodyMeasurements: boolean;
    }> {
        try {
            console.log('🔍 Obteniendo información completa del cliente:', clientId);

            // Verificar que los IDs sean válidos antes de continuar
            if (!this.validateClientId(clientId)) {
                throw new Error('ID de cliente no válido');
            }

            if (!this.validateTrainerId(trainerId)) {
                throw new Error('ID de entrenador no válido');
            }

            // Verificar acceso primero
            const hasAccess = await this.verifyClientAccess(clientId, trainerId);
            if (!hasAccess) {
                throw new Error('No tienes permisos para ver este cliente');
            }

            // Obtener información del cliente
            const clientInfo = await this.getClientInfo(clientId);

            // Verificar datos disponibles en paralelo con mejor logging
            console.log('🔍 Verificando datos disponibles para cliente:', clientId);

            const [hasWorkouts, hasBodyMeasurements] = await Promise.all([
                this.hasWorkoutEntries(clientId),
                this.hasBodyStats(clientId)
            ]);

            console.log('✅ Información completa del cliente obtenida:', {
                cliente: `${clientInfo.firstName} ${clientInfo.lastName}`,
                clientId,
                hasWorkouts,
                hasBodyMeasurements
            });

            return {
                clientInfo,
                hasWorkouts,
                hasBodyMeasurements
            };
        } catch (error) {
            console.error('❌ Error obteniendo información completa del cliente:', error);
            throw error;
        }
    }

    /**
     * Debug: Lista todas las subcolecciones de un usuario
     */
    static async debugUserSubcollections(clientId: string): Promise<void> {
        try {
            console.log('🔧 DEBUG: Analizando subcolecciones para usuario:', clientId);

            // Verificar documento principal
            const userRef = doc(db, "users", clientId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error('❌ DEBUG: Usuario no encontrado:', clientId);
                return;
            }

            console.log('✅ DEBUG: Usuario encontrado, datos principales:', userSnap.data());

            // Intentar acceder a diferentes subcolecciones conocidas
            const subcollections = ['workoutEntries', 'bodyStats', 'workouts', 'exercises'];

            for (const subcollectionName of subcollections) {
                try {
                    const subcollectionRef = collection(db, "users", clientId, subcollectionName);
                    const snapshot = await getDocs(subcollectionRef);

                    console.log(`🔧 DEBUG: Subcolección '${subcollectionName}':`, {
                        exists: !snapshot.empty,
                        docs: snapshot.size,
                        sampleDoc: snapshot.docs[0]?.data()
                    });
                } catch (error) {
                    console.error(`❌ DEBUG: Error accediendo a '${subcollectionName}':`, error);
                }
            }
        } catch (error) {
            console.error('❌ DEBUG: Error en debug de subcolecciones:', error);
        }
    }

    /**
     * Valida que el clientId sea válido
     */
    static validateClientId(clientId: string | undefined): boolean {
        const isValid = !!(clientId &&
            clientId.trim() !== '' &&
            clientId !== 'undefined' &&
            clientId !== 'null' &&
            clientId.length > 0);

        if (!isValid) {
            console.error('❌ ID de cliente no válido:', clientId);
        }

        return isValid;
    }

    /**
     * Valida que el trainerId sea válido
     */
    static validateTrainerId(trainerId: string | undefined): boolean {
        const isValid = !!(trainerId &&
            trainerId.trim() !== '' &&
            trainerId !== 'undefined' &&
            trainerId !== 'null' &&
            trainerId.length > 0);

        if (!isValid) {
            console.error('❌ ID de entrenador no válido:', trainerId);
        }

        return isValid;
    }
}