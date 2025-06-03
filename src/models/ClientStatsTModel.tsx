import {
    BodyMeasurementType,
    getBodyMeasurementProgressData, getChartDataForMeasurement,
    MEASUREMENT_INFO,
    MeasurementSummary
} from "../domain/BodyStatsDomain.tsx";
import { ClientInfo, ClientStatsTData } from "../data/ClientStatsTData.tsx";
import { Exercise } from "../config/StatsFireDB.tsx";
import { calculateExerciseStats, getExercisesWithCategories, getUserExerciseList } from "../domain/StatsDomain.tsx";

export interface MeasurementData {
    current: number;
    change: string;
    records: number;
    chartData: number[];
    summary?: MeasurementSummary;
}

export interface ExerciseData {
    maxWeight: number;
    maxReps: number;
    effort: number;
    weightHistory: number[];
    repsHistory: number[];
    totalWeight: number;
    workoutCount: number;
}

export interface ClientStatsState {
    clientInfo: ClientInfo | null;
    exercises: Exercise[];
    userExercises: string[];
    exerciseStats: ExerciseData | null;
    bodyMeasurements: Record<string, MeasurementData>;
    availableBodyMetrics: BodyMeasurementType[];
    isLoadingStats: boolean;
    isLoadingBodyStats: boolean;
    isLoadingInitial: boolean;
    error: string | null;
    hasWorkoutData: boolean;
    hasBodyData: boolean;
}

export type TabType = 'records' | 'measurements';

export class ClientStatsTModel {
    // Datos de fallback para medidas corporales
    private static readonly FALLBACK_MEASUREMENTS: Record<string, MeasurementData> = {
        'waist': {
            current: 85,
            change: '-3',
            records: 4,
            chartData: [88, 87, 86, 85]
        },
        'weight': {
            current: 75,
            change: '+2',
            records: 6,
            chartData: [73, 73.5, 74, 74.5, 75, 75]
        },
        'chest': {
            current: 102,
            change: '+4',
            records: 5,
            chartData: [98, 99, 100, 101, 102]
        }
    };

    /**
     * Valida los parámetros de entrada
     */
    static validateParameters(clientId: string | undefined, trainerId: string | undefined): {
        isValid: boolean;
        error?: string;
    } {
        if (!ClientStatsTData.validateClientId(clientId)) {
            return { isValid: false, error: 'ID de cliente no válido' };
        }

        if (!ClientStatsTData.validateTrainerId(trainerId)) {
            return { isValid: false, error: 'ID de entrenador no válido' };
        }

        return { isValid: true };
    }

    /**
     * Genera el nombre completo del cliente
     */
    static getClientDisplayName(clientInfo: ClientInfo | null): string {
        if (!clientInfo) return 'Cliente';

        if (clientInfo.firstName || clientInfo.lastName) {
            return `${clientInfo.firstName} ${clientInfo.lastName}`.trim();
        }

        return `Cliente ${clientInfo.id.substring(0, 8)}`;
    }

    /**
     * Obtiene el nombre de visualización de una medida
     */
    static getDisplayName(measurement: BodyMeasurementType | string): string {
        if (typeof measurement === 'string') {
            const maybeEnumKey = Object.values(BodyMeasurementType).find(val => val === measurement);
            if (maybeEnumKey) {
                return MEASUREMENT_INFO[maybeEnumKey].displayName;
            }
            return measurement;
        }
        return MEASUREMENT_INFO[measurement].displayName;
    }

    /**
     * Obtiene la unidad de una medida
     */
    static getUnit(measurement: BodyMeasurementType | string): string {
        if (typeof measurement === 'string') {
            const maybeEnumKey = Object.values(BodyMeasurementType).find(val => val === measurement) as BodyMeasurementType | undefined;
            if (maybeEnumKey) {
                return MEASUREMENT_INFO[maybeEnumKey].unit;
            }
            return 'cm';
        }
        return MEASUREMENT_INFO[measurement].unit;
    }

    /**
     * Carga la información completa del cliente con validaciones
     */
    static async loadCompleteClientInfo(clientId: string, trainerId: string): Promise<{
        clientInfo: ClientInfo;
        hasWorkouts: boolean;
        hasBodyMeasurements: boolean;
    }> {
        try {
            console.log('🚀 Iniciando carga completa de información del cliente');

            const validation = this.validateParameters(clientId, trainerId);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            return await ClientStatsTData.getCompleteClientInfo(clientId, trainerId);
        } catch (error) {
            console.error('❌ Error en loadCompleteClientInfo:', error);
            throw error;
        }
    }

    /**
     * Carga los ejercicios del usuario con validación
     */
    static async loadUserExercises(clientId: string): Promise<string[]> {
        try {
            console.log('🏋️ Cargando ejercicios del usuario:', clientId);

            if (!ClientStatsTData.validateClientId(clientId)) {
                return [];
            }

            const userExerciseList = await getUserExerciseList(clientId);
            console.log('✅ Ejercicios del cliente cargados:', userExerciseList.length);
            return userExerciseList;
        } catch (error) {
            console.error('❌ Error cargando ejercicios del cliente:', error);
            return [];
        }
    }

    /**
     * Carga las estadísticas de un ejercicio específico
     */
    static async loadExerciseStats(clientId: string, exerciseName: string): Promise<ExerciseData> {
        try {
            console.log('📊 Cargando estadísticas del ejercicio:', exerciseName, 'para cliente:', clientId);

            if (!ClientStatsTData.validateClientId(clientId) || !exerciseName.trim()) {
                return this.getEmptyExerciseData();
            }

            const stats = await calculateExerciseStats(clientId, exerciseName);
            console.log('✅ Estadísticas del ejercicio cargadas para cliente:', stats.workoutCount, 'entrenamientos');

            return {
                maxWeight: stats.maxWeight,
                maxReps: stats.maxReps,
                effort: stats.averageRir,
                weightHistory: stats.weightHistory,
                repsHistory: stats.repsHistory,
                totalWeight: stats.totalWeight,
                workoutCount: stats.workoutCount
            };
        } catch (error) {
            console.error('❌ Error cargando estadísticas del ejercicio del cliente:', error);
            return this.getEmptyExerciseData();
        }
    }

    /**
     * Carga las medidas corporales del cliente
     */
    static async loadBodyMeasurements(clientId: string): Promise<{
        measurements: Record<string, MeasurementData>;
        availableMetrics: BodyMeasurementType[];
    }> {
        try {
            console.log('📏 Cargando medidas corporales del cliente:', clientId);

            if (!ClientStatsTData.validateClientId(clientId)) {
                return {
                    measurements: this.FALLBACK_MEASUREMENTS,
                    availableMetrics: []
                };
            }

            const progressData = await getBodyMeasurementProgressData(clientId);

            if (progressData && progressData.availableMetrics.length > 0) {
                const processedMeasurements: Record<string, MeasurementData> = {};

                progressData.availableMetrics.forEach(metric => {
                    const summary = progressData.summaries[metric];
                    const chartData = getChartDataForMeasurement(metric, progressData.measurements);

                    if (summary) {
                        processedMeasurements[metric] = {
                            current: summary.latestValue,
                            change: summary.change >= 0 ? `+${summary.change.toFixed(1)}` : summary.change.toFixed(1),
                            records: summary.totalRecords,
                            chartData: chartData.map(d => d.value),
                            summary
                        };
                    }
                });

                console.log('✅ Medidas corporales del cliente cargadas:', progressData.availableMetrics.length);

                return {
                    measurements: processedMeasurements,
                    availableMetrics: progressData.availableMetrics
                };
            } else {
                console.log('ℹ️ No hay suficientes medidas corporales del cliente, usando datos de ejemplo');

                return {
                    measurements: this.FALLBACK_MEASUREMENTS,
                    availableMetrics: []
                };
            }
        } catch (error) {
            console.error('❌ Error cargando medidas corporales del cliente:', error);

            return {
                measurements: this.FALLBACK_MEASUREMENTS,
                availableMetrics: []
            };
        }
    }

    /**
     * Carga todos los ejercicios disponibles
     */
    static async loadAllExercises(): Promise<Exercise[]> {
        try {
            console.log('🏃 Cargando todos los ejercicios disponibles');
            const exercises = await getExercisesWithCategories();
            console.log('✅ Ejercicios globales cargados:', exercises.length);
            return exercises;
        } catch (error) {
            console.error('❌ Error cargando ejercicios globales:', error);
            return [];
        }
    }

    /**
     * Obtiene los datos de ejercicio seguros (con fallback)
     */
    static getSafeExerciseData(exerciseStats: ExerciseData | null): ExerciseData {
        return exerciseStats || this.getEmptyExerciseData();
    }

    /**
     * Obtiene los datos de medida actuales (con fallback)
     */
    static getCurrentMeasurement(
        bodyMeasurements: Record<string, MeasurementData>,
        selectedMeasurement: string
    ): MeasurementData {
        return bodyMeasurements[selectedMeasurement] ||
            this.FALLBACK_MEASUREMENTS[selectedMeasurement] || {
                current: 0,
                change: '0',
                records: 0,
                chartData: [0]
            };
    }

    /**
     * Valida si hay datos históricos de medidas
     */
    static hasHistoricalBodyData(availableBodyMetrics: BodyMeasurementType[]): boolean {
        return availableBodyMetrics.length > 0;
    }

    /**
     * Valida si el ejercicio tiene datos de entrenamiento
     */
    static hasExerciseData(exerciseData: ExerciseData): boolean {
        return exerciseData.workoutCount > 0;
    }

    /**
     * Obtiene el color para el cambio de medida corporal
     */
    static getChangeColor(change: string): string {
        if (change.startsWith('+')) return '#10B981';
        if (change.startsWith('-')) return '#EF4444';
        return '#00E5CC';
    }

    /**
     * Obtiene el color de tendencia para medidas corporales
     */
    static getTrendColor(trend: string): string {
        switch (trend) {
            case 'increasing': return '#10B981';
            case 'decreasing': return '#EF4444';
            default: return '#6B7280';
        }
    }

    /**
     * Obtiene el texto de tendencia
     */
    static getTrendText(trend: string): string {
        switch (trend) {
            case 'increasing': return '📈 Aumentando';
            case 'decreasing': return '📉 Disminuyendo';
            default: return '➡️ Estable';
        }
    }

    /**
     * Genera mensaje motivacional basado en el peso total levantado
     */
    static getMotivationalMessage(totalWeight: number): string {
        if (totalWeight >= 1000) {
            return "¡Tu cliente ha levantado más de una tonelada! 🐘";
        } else if (totalWeight >= 500) {
            return "¡Tu cliente ha levantado el peso de una motocicleta! 🏍️";
        } else if (totalWeight >= 100) {
            return "¡Tu cliente ha levantado el peso de una persona! 🧑‍🤝‍🧑";
        } else {
            return "¡Tu cliente está en el buen camino para alcanzar grandes logros! 🚀";
        }
    }

    /**
     * Calcula el promedio por sesión
     */
    static calculateAveragePerSession(totalWeight: number, workoutCount: number): string {
        if (workoutCount > 0) {
            return (totalWeight / workoutCount).toFixed(1);
        }
        return '0';
    }

    /**
     * Filtra ejercicios que no están en la lista del usuario
     */
    static getAvailableExercises(allExercises: Exercise[], userExercises: string[]): Exercise[] {
        return allExercises.filter(exercise => !userExercises.includes(exercise.name));
    }

    /**
     * Inicializa el estado por defecto
     */
    static getInitialState(): ClientStatsState {
        return {
            clientInfo: null,
            exercises: [],
            userExercises: [],
            exerciseStats: null,
            bodyMeasurements: {},
            availableBodyMetrics: [],
            isLoadingStats: false,
            isLoadingBodyStats: false,
            isLoadingInitial: true,
            error: null,
            hasWorkoutData: false,
            hasBodyData: false
        };
    }

    /**
     * Determina el mensaje apropiado cuando no hay datos
     */
    static getNoDataMessage(hasWorkoutData: boolean, hasBodyData: boolean, activeTab: TabType): string {
        if (activeTab === 'records') {
            if (!hasWorkoutData) {
                return 'Este cliente no tiene entrenamientos registrados aún. Las estadísticas aparecerán cuando comience a entrenar.';
            }
            return 'Cargando datos de ejercicios del cliente...';
        } else {
            if (!hasBodyData) {
                return 'Este cliente no tiene medidas corporales registradas aún. Las estadísticas aparecerán cuando se registren sus medidas.';
            }
            return 'Cargando medidas corporales del cliente...';
        }
    }

    /**
     * Datos de ejercicio vacíos
     */
    private static getEmptyExerciseData(): ExerciseData {
        return {
            maxWeight: 0,
            maxReps: 0,
            effort: 0,
            weightHistory: [0],
            repsHistory: [0],
            totalWeight: 0,
            workoutCount: 0
        };
    }
}