import {Exercise, getExercises, getWorkoutEntries, WorkoutEntry} from "../config/StatsFireDB.tsx";

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