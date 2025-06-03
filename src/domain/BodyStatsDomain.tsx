import { Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Tipo para timestamp que puede ser Firestore Timestamp, Date, string o number
 */
type TimestampLike = Timestamp | Date | string | number | null | undefined;

/**
 * Interface para las medidas corporales raw de Firebase
 */

/**
 * Interface para datos raw de Firebase (más flexible)
 */
interface FirebaseDocumentData {
    userId?: string;
    gender?: string;
    measurements?: Record<string, string | undefined>;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

/**
 * Interface para medidas corporales procesadas
 */
export interface BodyMeasurement {
    id: string;
    userId: string;
    gender: string;
    height: number;
    weight: number;
    neck: number;
    chest: number;
    arms: number;
    waist: number;
    thigh: number;
    calf: number;
    createdAt: Date;
    updatedAt?: Date;
}

/**
 * Tipos de medidas corporales disponibles
 */
export enum BodyMeasurementType {
    HEIGHT = 'height',
    WEIGHT = 'weight',
    NECK = 'neck',
    CHEST = 'chest',
    ARMS = 'arms',
    WAIST = 'waist',
    THIGH = 'thigh',
    CALF = 'calf'
}

/**
 * Información de display para cada tipo de medida
 */
export const MEASUREMENT_INFO: Record<BodyMeasurementType, {
    displayName: string;
    unit: string;
    shortName: string;
}> = {
    [BodyMeasurementType.HEIGHT]: {
        displayName: 'Altura',
        unit: 'cm',
        shortName: 'Altura',
    },
    [BodyMeasurementType.WEIGHT]: {
        displayName: 'Peso',
        unit: 'kg',
        shortName: 'Peso',
    },
    [BodyMeasurementType.NECK]: {
        displayName: 'Cuello',
        unit: 'cm',
        shortName: 'Cuello',
    },
    [BodyMeasurementType.CHEST]: {
        displayName: 'Pecho',
        unit: 'cm',
        shortName: 'Pecho',
    },
    [BodyMeasurementType.ARMS]: {
        displayName: 'Brazos',
        unit: 'cm',
        shortName: 'Brazos',
    },
    [BodyMeasurementType.WAIST]: {
        displayName: 'Cintura',
        unit: 'cm',
        shortName: 'Cintura',
    },
    [BodyMeasurementType.THIGH]: {
        displayName: 'Muslos',
        unit: 'cm',
        shortName: 'Muslos',
    },
    [BodyMeasurementType.CALF]: {
        displayName: 'Pantorrillas',
        unit: 'cm',
        shortName: 'Pantorrillas',
    },
};
/**
 * Interface para resumen de progreso de una medida
 */
export interface MeasurementSummary {
    type: BodyMeasurementType;
    latestValue: number;
    firstValue: number;
    change: number;
    changePercent: number;
    totalRecords: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Interface para datos de progreso completos
 */
export interface BodyMeasurementProgressData {
    userId: string;
    measurements: BodyMeasurement[];
    summaries: Record<BodyMeasurementType, MeasurementSummary>;
    availableMetrics: BodyMeasurementType[];
}

/**
 * Convierte Firestore Timestamp a Date
 */
const timestampToDate = (timestamp: TimestampLike): Date => {
    if (!timestamp) return new Date(0);

    if (timestamp && typeof (timestamp as Timestamp).toDate === 'function') {
        return (timestamp as Timestamp).toDate();
    }

    if (timestamp instanceof Date) {
        return timestamp;
    }

    return new Date(timestamp as string | number);
};

/**
 * Convierte datos raw de Firebase a BodyMeasurement
 */
const convertFirebaseToBodyMeasurement = (docId: string, data: FirebaseDocumentData): BodyMeasurement => {
    const measurements = data.measurements || {};

    return {
        id: docId,
        userId: data.userId || '',
        gender: data.gender || 'MALE',
        height: parseFloat(measurements.Height || '0') || 0,
        weight: parseFloat(measurements.Weight || '0') || 0,
        neck: parseFloat(measurements.Neck || '0') || 0,
        chest: parseFloat(measurements.Chest || '0') || 0,
        arms: parseFloat(measurements.Arms || '0') || 0,
        waist: parseFloat(measurements.Waist || '0') || 0,
        thigh: parseFloat(measurements.Thigh || '0') || 0,
        calf: parseFloat(measurements.Calf || '0') || 0,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: data.updatedAt ? timestampToDate(data.updatedAt) : undefined
    };
};

/**
 * Obtiene todas las medidas corporales de un usuario
 */
export const getBodyMeasurements = async (userId: string): Promise<BodyMeasurement[]> => {
    try {
        console.log('🏋️ Obteniendo medidas corporales para usuario:', userId);

        const bodyStatsRef = collection(db, "users", userId, "bodyStats");
        const q = query(bodyStatsRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        const measurements: BodyMeasurement[] = [];
        snapshot.forEach((doc) => {
            const measurement = convertFirebaseToBodyMeasurement(doc.id, doc.data());
            measurements.push(measurement);
        });

        console.log('✅ Medidas corporales obtenidas:', measurements.length);
        return measurements;

    } catch (error) {
        console.error('❌ Error obteniendo medidas corporales:', error);
        return [];
    }
};

/**
 * Calcula el resumen de progreso para una medida específica
 */
const calculateMeasurementSummary = (
    type: BodyMeasurementType,
    measurements: BodyMeasurement[]
): MeasurementSummary | null => {
    // Filtrar medidas con valores válidos para este tipo
    const validMeasurements = measurements.filter(m => {
        const value = m[type as keyof BodyMeasurement] as number;
        return value && value > 0;
    });

    if (validMeasurements.length < 2) {
        return null; // Necesitamos al menos 2 registros para calcular progreso
    }

    // Ordenar por fecha
    const sortedMeasurements = validMeasurements.sort((a, b) =>
        a.createdAt.getTime() - b.createdAt.getTime()
    );

    const firstValue = sortedMeasurements[0][type as keyof BodyMeasurement] as number;
    const latestValue = sortedMeasurements[sortedMeasurements.length - 1][type as keyof BodyMeasurement] as number;
    const change = latestValue - firstValue;
    const changePercent = (change / firstValue) * 100;

    // Determinar tendencia
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 1) { // Si el cambio es mayor al 1%
        trend = change > 0 ? 'increasing' : 'decreasing';
    }

    return {
        type,
        latestValue,
        firstValue,
        change,
        changePercent,
        totalRecords: validMeasurements.length,
        trend
    };
};

/**
 * Obtiene datos de progreso para gráficos de una medida específica
 */
export const getChartDataForMeasurement = (
    type: BodyMeasurementType,
    measurements: BodyMeasurement[]
): Array<{ date: string; value: number }> => {
    // Filtrar medidas con valores válidos
    const validMeasurements = measurements.filter(m => {
        const value = m[type as keyof BodyMeasurement] as number;
        return value && value > 0;
    });

    // Ordenar por fecha y tomar últimos 12 registros
    const sortedMeasurements = validMeasurements
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .slice(-12);

    return sortedMeasurements.map(measurement => ({
        date: measurement.createdAt.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit'
        }),
        value: measurement[type as keyof BodyMeasurement] as number
    }));
};

/**
 * Obtiene datos de progreso completos para un usuario
 */
export const getBodyMeasurementProgressData = async (userId: string): Promise<BodyMeasurementProgressData | null> => {
    try {
        console.log('📊 Calculando datos de progreso corporal para usuario:', userId);

        const measurements = await getBodyMeasurements(userId);

        if (measurements.length < 2) {
            console.log('ℹ️ No hay suficientes medidas para calcular progreso');
            return null;
        }

        // Calcular resúmenes para cada tipo de medida
        const summaries: Record<BodyMeasurementType, MeasurementSummary> = {} as never;
        const availableMetrics: BodyMeasurementType[] = [];

        Object.values(BodyMeasurementType).forEach(type => {
            const summary = calculateMeasurementSummary(type, measurements);
            if (summary) {
                summaries[type] = summary;
                availableMetrics.push(type);
            }
        });

        console.log('✅ Métricas disponibles:', availableMetrics.length);

        return {
            userId,
            measurements,
            summaries,
            availableMetrics
        };

    } catch (error) {
        console.error('❌ Error calculando progreso corporal:', error);
        return null;
    }
};

/**
 * Obtiene las medidas corporales más recientes de un usuario
 */
export const getLatestBodyMeasurements = async (userId: string): Promise<BodyMeasurement | null> => {
    try {
        console.log('📝 Obteniendo medidas más recientes para usuario:', userId);

        const bodyStatsRef = collection(db, "users", userId, "bodyStats");
        const q = query(bodyStatsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('ℹ️ No hay medidas corporales para este usuario');
            return null;
        }

        const latestDoc = snapshot.docs[0];
        const latestMeasurement = convertFirebaseToBodyMeasurement(latestDoc.id, latestDoc.data());

        console.log('✅ Medidas más recientes obtenidas');
        return latestMeasurement;

    } catch (error) {
        console.error('❌ Error obteniendo medidas más recientes:', error);
        return null;
    }
};

/**
 * Calcula estadísticas generales del cuerpo
 */
export const calculateBodyStats = async (userId: string) => {
    try {
        const progressData = await getBodyMeasurementProgressData(userId);

        if (!progressData) {
            return {
                totalRecords: 0,
                availableMetrics: 0,
                hasWeightData: false,
                hasHeightData: false,
                recordsThisMonth: 0
            };
        }

        // Calcular registros del último mes
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const recordsThisMonth = progressData.measurements.filter(
            m => m.createdAt >= oneMonthAgo
        ).length;

        return {
            totalRecords: progressData.measurements.length,
            availableMetrics: progressData.availableMetrics.length,
            hasWeightData: progressData.availableMetrics.includes(BodyMeasurementType.WEIGHT),
            hasHeightData: progressData.availableMetrics.includes(BodyMeasurementType.HEIGHT),
            recordsThisMonth,
            latestMeasurement: progressData.measurements[progressData.measurements.length - 1]
        };

    } catch (error) {
        console.error('❌ Error calculando estadísticas corporales:', error);
        return {
            totalRecords: 0,
            availableMetrics: 0,
            hasWeightData: false,
            hasHeightData: false,
            recordsThisMonth: 0
        };
    }
};