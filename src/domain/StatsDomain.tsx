import {Exercise, getExercises, getWorkoutEntries, WorkoutEntry} from "../config/StatsFireDB.tsx";
import {Timestamp} from "firebase/firestore";

type TimestampLike = Timestamp | Date | string | number | null | undefined;

/**
 * Convierte Firestore Timestamp a Date
 * @param timestamp - Firestore Timestamp, Date, string, number o null/undefined
 * @returns Date object
 */
const timestampToDate = (timestamp: TimestampLike): Date => {
    if (!timestamp) return new Date(0);

    // Si es un Timestamp de Firestore, usar toDate()
    if (timestamp && typeof (timestamp as Timestamp).toDate === 'function') {
        return (timestamp as Timestamp).toDate();
    }

    // Si ya es un Date, devolverlo
    if (timestamp instanceof Date) {
        return timestamp;
    }

    // Si es un string o number, crear Date
    return new Date(timestamp as string | number);
};

/**
 * Obtiene el total de workouts de un usuario y verifica la conexión
 * @param userId - ID del usuario
 * @returns Promise con array de WorkoutEntry
 */
export const getWorkoutsTotal = async (userId: string): Promise<WorkoutEntry[]> => {
    try {
        console.log('🚀 Iniciando getWorkoutsTotal para usuario:', userId);

        if (!userId) {
            console.warn('⚠️ Usuario ID no proporcionado');
            return [];
        }

        // Llamar a la función de base de datos
        const workoutEntries = await getWorkoutEntries(userId);

        console.log('📊 Total de workouts obtenidos:', workoutEntries.length);

        // Log de verificación de conexión
        if (workoutEntries.length > 0) {
            console.log('✅ Conexión exitosa - Primer workout:', {
                id: workoutEntries[0].id,
                title: workoutEntries[0].title,
                timestamp: workoutEntries[0].timestamp
            });
        } else {
            console.log('ℹ️ No se encontraron workouts para este usuario');
        }

        return workoutEntries;

    } catch (error) {
        console.error('❌ Error en getWorkoutsTotal:', error);
        return [];
    }
};

/**
 * Obtiene workouts filtrados por ejercicio específico
 * @param userId - ID del usuario
 * @param exerciseTitle - Título del ejercicio
 * @returns Promise con array de WorkoutEntry filtrado
 */
export const getWorkoutsByExercise = async (userId: string, exerciseTitle: string): Promise<WorkoutEntry[]> => {
    try {
        console.log('🔍 Obteniendo workouts para ejercicio:', exerciseTitle, 'usuario:', userId);

        if (!userId || !exerciseTitle) {
            console.warn('⚠️ Usuario ID o título de ejercicio no proporcionado');
            return [];
        }

        // Obtener todos los workouts y filtrar por título
        const allWorkouts = await getWorkoutEntries(userId);
        const filteredWorkouts = allWorkouts.filter(workout =>
            workout.title.toLowerCase() === exerciseTitle.toLowerCase()
        );

        console.log('📊 Workouts filtrados para', exerciseTitle, ':', filteredWorkouts.length);

        return filteredWorkouts;

    } catch (error) {
        console.error('❌ Error en getWorkoutsByExercise:', error);
        return [];
    }
};

/**
 * Calcula estadísticas de progreso para un ejercicio específico
 * @param userId - ID del usuario
 * @param exerciseTitle - Título del ejercicio
 * @returns Promise con estadísticas calculadas
 */
export const calculateExerciseStats = async (userId: string, exerciseTitle: string) => {
    try {
        const workouts = await getWorkoutsByExercise(userId, exerciseTitle);

        if (workouts.length === 0) {
            return {
                maxWeight: 0,
                maxReps: 0,
                averageRir: 0,
                totalWeight: 0,
                workoutCount: 0,
                weightHistory: [],
                repsHistory: [],
                lastWorkoutDate: null
            };
        }

        // ✅ FIX: Convertir Timestamp a Date antes de ordenar
        const sortedWorkouts = workouts.sort((a, b) => {
            const dateA = timestampToDate(a.timestamp);
            const dateB = timestampToDate(b.timestamp);
            return dateB.getTime() - dateA.getTime();
        });

        console.log('📈 Workouts ordenados:', sortedWorkouts.length);
        console.log('🔍 Primer workout fecha:', timestampToDate(sortedWorkouts[0]?.timestamp));

        // Calcular estadísticas
        const maxWeight = Math.max(...workouts.map(w => w.weight));
        const maxReps = Math.max(...workouts.map(w => w.reps));
        const averageRir = workouts.reduce((sum, w) => sum + (w.rir || 0), 0) / workouts.length;
        const totalWeight = workouts.reduce((sum, w) => sum + w.weight, 0);

        // Obtener últimos 12 registros para gráficos (en orden cronológico)
        const recentWorkouts = sortedWorkouts.slice(0, 12).reverse();

        const weightHistory = recentWorkouts.map(w => w.weight);
        const repsHistory = recentWorkouts.map(w => w.reps);

        console.log('📊 Estadísticas calculadas:', {
            maxWeight,
            maxReps,
            averageRir: Math.round(averageRir),
            totalWeight: Number(totalWeight.toFixed(1)),
            workoutCount: workouts.length
        });

        return {
            maxWeight: Number(maxWeight.toFixed(1)),
            maxReps,
            averageRir: Math.round(averageRir),
            totalWeight: Number(totalWeight.toFixed(1)),
            workoutCount: workouts.length,
            weightHistory,
            repsHistory,
            lastWorkoutDate: sortedWorkouts[0] ? timestampToDate(sortedWorkouts[0].timestamp) : null
        };

    } catch (error) {
        console.error('❌ Error calculando estadísticas:', error);
        return {
            maxWeight: 0,
            maxReps: 0,
            averageRir: 0,
            totalWeight: 0,
            workoutCount: 0,
            weightHistory: [],
            repsHistory: [],
            lastWorkoutDate: null
        };
    }
};

/**
 * Obtiene lista de ejercicios únicos del usuario
 * @param userId - ID del usuario
 * @returns Promise con array de nombres de ejercicios únicos
 */
export const getUserExerciseList = async (userId: string): Promise<string[]> => {
    try {
        console.log('🏋️ Obteniendo lista de ejercicios únicos para usuario:', userId);

        const workouts = await getWorkoutEntries(userId);

        // Obtener títulos únicos
        const uniqueExercises = Array.from(new Set(workouts.map(w => w.title)));

        console.log('📋 Ejercicios únicos encontrados:', uniqueExercises.length);

        return uniqueExercises.sort(); // Ordenar alfabéticamente

    } catch (error) {
        console.error('❌ Error obteniendo lista de ejercicios:', error);
        return [];
    }
};

/**
 * Obtiene estadísticas de progreso temporal para un ejercicio
 * @param userId - ID del usuario
 * @param exerciseTitle - Título del ejercicio
 * @param daysBack - Número de días hacia atrás (default: 30)
 * @returns Promise con datos de progreso temporal
 */
export const getExerciseProgressOverTime = async (
    userId: string,
    exerciseTitle: string,
    daysBack: number = 30
) => {
    try {
        const workouts = await getWorkoutsByExercise(userId, exerciseTitle);

        if (workouts.length === 0) {
            return {
                dates: [],
                weights: [],
                reps: [],
                volume: [] // peso * reps
            };
        }

        // Filtrar por fecha (últimos X días)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);

        const recentWorkouts = workouts.filter(workout => {
            const workoutDate = timestampToDate(workout.timestamp);
            return workoutDate >= cutoffDate;
        });

        // Ordenar por fecha ascendente
        const sortedWorkouts = recentWorkouts.sort((a, b) => {
            const dateA = timestampToDate(a.timestamp);
            const dateB = timestampToDate(b.timestamp);
            return dateA.getTime() - dateB.getTime();
        });

        // Formatear datos para gráficos
        const dates = sortedWorkouts.map(w => {
            const date = timestampToDate(w.timestamp);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit'
            });
        });

        const weights = sortedWorkouts.map(w => w.weight);
        const reps = sortedWorkouts.map(w => w.reps);
        const volume = sortedWorkouts.map(w => w.weight * w.reps);

        return {
            dates,
            weights,
            reps,
            volume
        };

    } catch (error) {
        console.error('❌ Error obteniendo progreso temporal:', error);
        return {
            dates: [],
            weights: [],
            reps: [],
            volume: []
        };
    }
};

/**
 * Obtiene todos los ejercicios de la colección global con sus categorías
 */
export const getExercisesWithCategories = async (): Promise<Exercise[]> => {
    try {
        console.log('🚀 Iniciando getExercisesWithCategories');

        // Llamar a la función de base de datos
        const exercises = await getExercises();

        console.log('📊 Total de ejercicios obtenidos:', exercises.length);

        // Log de verificación de conexión
        if (exercises.length > 0) {
            console.log('✅ Conexión exitosa - Primer ejercicio:', {
                name: exercises[0].name,
                category: exercises[0].category,
                createdBy: exercises[0].createdBy,
                isDefault: exercises[0].isDefault
            });
        } else {
            console.log('ℹ️ No se encontraron ejercicios en la collection');
        }

        return exercises;

    } catch (error) {
        console.error('❌ Error en getExercisesWithCategories:', error);
        return [];
    }
};