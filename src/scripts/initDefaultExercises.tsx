import {addDoc, collection, getDocs, query , where} from "@firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {firestore} from "../firebase.ts";


const defaultExercises = [
    { name: 'Press banca', category: 'Pecho', isDefault: true, createdBy: null },
    { name: 'Sentadilla', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Dominadas', category: 'Espalda', isDefault: true, createdBy: null },
    { name: 'Press Militar', category: 'Hombros', isDefault: true, createdBy: null },
    { name: 'Prensa', category: 'Pierna', isDefault: true, createdBy: null },
    { name: 'Remo polea', category: 'Espalda', isDefault: true, createdBy: null },
    { name: 'Curl biceps', category: 'Brazos', isDefault: true, createdBy: null },
    { name: 'Triceps X', category: 'Brazos', isDefault: true, createdBy: null },
    { name: 'Abdominades colgado', category: 'Core', isDefault: true, createdBy: null },
];

export async function initDefaultExercises() {
    try {
        const metaRef = doc(firestore, "meta", "defaultExercisesInserted");
        const metaSnap = await getDoc(metaRef);

        if (metaSnap.exists()) {
            console.log("ℹ️ Ejercicios por defecto ya estaban insertados (meta flag).");
            return;
        }

        const ref = collection(firestore, "exercises");
        const snapshot = await getDocs(query(ref, where("isDefault", "==", true)));
        const existingNames = snapshot.docs.map((doc) => doc.data().name);

        const toInsert = defaultExercises.filter(
            (ex) => !existingNames.includes(ex.name)
        );

        if (toInsert.length > 0) {
            await Promise.all(toInsert.map((ex) => addDoc(ref, ex)));
            console.log(`✅ Insertados ${toInsert.length} ejercicios por defecto nuevos.`);
        } else {
            console.log("ℹ️ Todos los ejercicios ya existían.");
        }

        // Guardamos el flag en 'meta' para evitar futuras inserciones
        await setDoc(metaRef, { inserted: true, insertedAt: new Date().toISOString() });

    } catch (error) {
        console.error("❌ Error al inicializar ejercicios por defecto:", error);
    }
}