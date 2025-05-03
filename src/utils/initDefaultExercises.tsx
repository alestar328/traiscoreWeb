import { collection, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import {firestore} from "../firebase.ts";


const defaultExercises = [
    { name: 'Press banca', category: 'Pecho', isDefault: true, createdBy: null },
    { name: 'Sentadilla', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Cruces maqui disc', category: 'Pecho', isDefault: true, createdBy: null },
    { name: 'Vuelos maq disc', category: 'Pecho', isDefault: true, createdBy: null },
    { name: 'Curl barra Z prono', category: 'Pecho', isDefault: true, createdBy: null },
    { name: 'Predicador disc', category: 'Pecho', isDefault: true, createdBy: null },
    { name: 'Dominadas', category: 'Espalda', isDefault: true, createdBy: null },
    { name: 'Press Militar', category: 'Hombros', isDefault: true, createdBy: null },
    { name: 'Prensa', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Remo polea', category: 'Espalda', isDefault: true, createdBy: null },
    { name: 'Curl biceps', category: 'Brazos', isDefault: true, createdBy: null },
    { name: 'Triceps X', category: 'Brazos', isDefault: true, createdBy: null },
    { name: 'Abdominades colgado', category: 'Core', isDefault: true, createdBy: null },
    { name: 'Sentadilla Hack', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Adductores', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Gemelos de pie', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Gemelos sentado', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Curl femoral unilat', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Hipthust', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Zancadas', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Leg extension', category: 'Pierna', isDefault: true, createdBy: null },

];

export async function initDefaultExercises() {
    try {
        const metaRef = doc(firestore, "meta", "defaultExercisesInserted");
        const metaSnap = await getDoc(metaRef);

        if (metaSnap.exists()) {
            console.log("ℹ️ Ejercicios por defecto ya estaban insertados (meta flag).");
            return;
        }

        const exercisesRef = collection(firestore, "exercises");
        const snapshot = await getDocs(query(exercisesRef, where("isDefault", "==", true)));
        const existingNames = snapshot.docs.map((doc) => doc.data().name);

        const toInsert = defaultExercises.filter((ex) => !existingNames.includes(ex.name));


        if (toInsert.length > 0) {
            await Promise.all(
                toInsert.map(async (exercise, index) => {
                    const docId = `defaultExer${index + 1}`;
                    const docRef = doc(firestore, "exercises", docId);
                    await setDoc(docRef, exercise);
                })
            );
            console.log(`✅ Insertados ${toInsert.length} ejercicios con IDs personalizadas.`);
        } else {
            console.log("ℹ️ Todos los ejercicios ya existían.");
        }

        await setDoc(metaRef, { inserted: true, insertedAt: new Date().toISOString() });

    } catch (error) {
        console.error("❌ Error al inicializar ejercicios por defecto:", error);
    }
}