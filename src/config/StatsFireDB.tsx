import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Interface simple basada en tu Entity
export interface WorkoutEntry {
    id: string;
    exerciseId: number;
    title: string;
    weight: number;
    series: number;
    reps: number;
    rir?: number;
    type: string;
    timestamp: Timestamp; // ✅ Usar Timestamp en lugar de genérico
}

export interface Exercise {
    name: string;        // Para mostrar en el select
    category: string;    // Para identificar/agrupar
    createdBy?: string;  // Opcional
    isDefault?: boolean; // Opcional
}

// Función para obtener todas las workoutEntries de un usuario
export const getWorkoutEntries = async (userId: string): Promise<WorkoutEntry[]> => {
    try {
        console.log('🔍 Obteniendo workoutEntries para usuario:', userId);

        const workoutEntriesRef = collection(db, "users", userId, "workoutEntries");
        const q = query(workoutEntriesRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const entries: WorkoutEntry[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            entries.push({
                id: doc.id,
                exerciseId: data.exerciseId || 0,
                title: data.title || '',
                weight: typeof data.weight === 'number' ? data.weight : 0,
                series: typeof data.series === 'number' ? data.series : 0,
                reps: typeof data.reps === 'number' ? data.reps : 0,
                rir: typeof data.rir === 'number' ? data.rir : 0,
                type: data.type || '',
                timestamp: data.timestamp as Timestamp // ✅ Cast explícito a Timestamp
            });
        });

        console.log('✅ WorkoutEntries obtenidos:', entries.length);
        return entries;

    } catch (error) {
        console.error('❌ Error obteniendo workoutEntries:', error);
        return [];
    }
};

// Función para obtener entradas por ejercicio específico
export const getWorkoutEntriesByExercise = async (userId: string, exerciseTitle: string): Promise<WorkoutEntry[]> => {
    try {
        console.log('🔍 Obteniendo entradas para ejercicio:', exerciseTitle);

        const workoutEntriesRef = collection(db, "users", userId, "workoutEntries");
        const q = query(
            workoutEntriesRef,
            where("title", "==", exerciseTitle),
            orderBy("timestamp", "asc")
        );
        const snapshot = await getDocs(q);

        const entries: WorkoutEntry[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            entries.push({
                id: doc.id,
                exerciseId: data.exerciseId || 0,
                title: data.title || '',
                weight: typeof data.weight === 'number' ? data.weight : 0,
                series: typeof data.series === 'number' ? data.series : 0,
                reps: typeof data.reps === 'number' ? data.reps : 0,
                rir: typeof data.rir === 'number' ? data.rir : 0,
                type: data.type || '',
                timestamp: data.timestamp as Timestamp
            });
        });

        console.log('✅ Entradas por ejercicio obtenidas:', entries.length);
        return entries;

    } catch (error) {
        console.error('❌ Error obteniendo entradas por ejercicio:', error);
        return [];
    }
};

// Función para obtener todos los exercises de la collection global
export const getExercises = async (): Promise<Exercise[]> => {
    try {
        console.log('🔍 Obteniendo exercises de la collection global');

        const exercisesRef = collection(db, "exercises");
        const q = query(exercisesRef, orderBy("name", "asc"));
        const snapshot = await getDocs(q);

        const exercises: Exercise[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            exercises.push({
                name: data.name || '',
                category: data.category || '',
                createdBy: data.createdBy,
                isDefault: data.isDefault
            });
        });

        console.log('✅ Exercises obtenidos:', exercises.length);
        return exercises;

    } catch (error) {
        console.error('❌ Error obteniendo exercises:', error);
        return [];
    }
};