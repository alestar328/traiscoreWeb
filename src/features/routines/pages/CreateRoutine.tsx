import { useState, useEffect  } from 'react';
import { Exercise } from '../types';
import '../../../styles/CreateRoutine.css';
import RoutineTablePrev from "../components/RoutineTablePrev.tsx";
import {firestore} from "../../../firebase.ts";
import {addDoc, collection, getDocs} from "@firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import {initDefaultExercises} from "../../../scripts/initDefaultExercises.tsx";
import {exportRoutineToJson} from "../../../scripts/UsefullFunctions.tsx";

function CreateRoutine() {
    const [routineByType, setRoutineByType] = useState<Record<string, Exercise[]>>({});
    const [currentType, setCurrentType] = useState<string>('Empuje');
    const ref = collection(firestore, "routines");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [newExercise, setNewExercise] = useState<Exercise>(
        { name: '', series:'' ,reps: '', weight: '', rir: 0 });
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);

    useEffect(() => {
        const loadExercises = async () => {
            try {
                await initDefaultExercises(); // asegura que se ejecuta y se espera
                const snapshot = await getDocs(collection(firestore, "exercises"));
                const names = snapshot.docs.map(doc => doc.data().name);
                setExerciseOptions(names);
            } catch (error) {
                console.error("Error cargando los ejercicios por defecto:", error);
            }
        };

        loadExercises();
    }, []);


    const [clientName, setClient] = useState("");

    const addExercise = () => {
        setRoutineByType(prev => {
            const updated = { ...prev };
            const currentList = updated[currentType] || [];
            updated[currentType] = [...currentList, newExercise];
            return updated;
        });

        setNewExercise({ name: '', series: '', reps: '', weight: '', rir: 0 });
    };

    const saveRoutine = async(e: React.FormEvent) => {
        e.preventDefault(); // evita recargar

        const routineData = {
            clientName,
            createdAt: serverTimestamp(),
            routine: routineByType
        };
        try{
            const docRef = await addDoc(ref, routineData);
            console.log("Rutina guardada EXITO id: " , docRef.id);

            setSuccessMessage("✅ Rutina generada con éxito!");

            // Limpiar todo
            setClient("");
            setRoutineByType({});
            setNewExercise({ name: '', series: '', reps: '', weight: '', rir: 0 });

            setTimeout(() => setSuccessMessage(null), 3000);

        }catch (error){
            console.log(error);
        }
    }


    return (
        <div className="create-routine-container">
            {successMessage && (
                <div className="toast">
                    {successMessage}
                </div>
            )}
            <form className="routine-form" onSubmit={saveRoutine}>
                <h2>Crear Nueva Rutina</h2>

                <label htmlFor="userName">Usuario de la rutina:</label>
                <input id="userName"
                       type="text"
                       value={clientName}
                       onChange={(e) => setClient(e.currentTarget.value)}
                       placeholder="Nombre cliente" required/>

                <label>Tipo</label>
                <select
                    value={currentType}
                    onChange={(e) => setCurrentType(e.target.value)}
                >
                    <option>Empuje</option>
                    <option>Tirón</option>
                    <option>Pierna</option>
                    <option>Full Body</option>
                    <option>Cardio</option>
                </select>

                <h3>Ejercicios</h3>

                <div className="exercise-row">

                    <div className="form-group">
                        <label htmlFor="newExeName">Ejercicio</label>
                        <input id="newExeName"
                               type="text"
                               list="exerciseList"
                               placeholder="Ejercicio"
                               value={newExercise.name}
                               onChange={(e) =>
                                   setNewExercise({...newExercise, name: e.target.value})
                               }/>
                        <datalist id="exerciseList">
                            {exerciseOptions.map((name, index) => (
                                <option key={index} value={name}/>
                            ))}
                        </datalist>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newSeri">Series:</label>
                        <input
                            id="newSeri"
                            type="text"
                            placeholder="Series"
                            value={newExercise.series}
                            onChange={(e) =>
                                setNewExercise({...newExercise, series: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newReps">Reps estimada:</label>
                        <input
                            id="newReps"
                            type="text"
                            placeholder="Reps"
                            value={newExercise.reps}
                            onChange={(e) => {
                                setNewExercise({...newExercise, reps: e.target.value})
                            }
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newWeight">Peso:</label>
                        <input
                            id="newWeight"
                            type="text"
                            placeholder="Peso"
                            value={newExercise.weight}
                            onChange={(e) => {
                                setNewExercise({...newExercise, weight: e.target.value})
                            }
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newRIR">RIR:</label>
                        <input
                            id="newRIR"
                            type="number"
                            placeholder="RIR"
                            value={newExercise.rir}
                            onChange={(e) => {
                                setNewExercise({...newExercise, rir: +e.target.value})
                            }
                            }
                            min={0}
                            max={15}
                            required
                        />
                    </div>
                </div>
                <button type="button" className="add-btn" onClick={addExercise}>+ Añadir ejercicio</button>
                <button type="submit" className="submit-btn"  onClick={saveRoutine}>Guardar rutina</button>
                {/* Botón para exportar la rutina a JSON */}
                <button onClick={() => exportRoutineToJson(clientName, routineByType)}>
                    Exportar rutina a JSON
                </button>

            </form>
            <div className="tables-wrapper">
                <h2 className="doc-title">Rutina para: <strong>{clientName || 'No especificado'}</strong></h2>
                {Object.entries({
                    ...routineByType,
                    [currentType]: routineByType[currentType] || [],
                }).map(([type, exercises]) => (
                    <RoutineTablePrev
                        key={type}
                        exercises={exercises}
                        clientName={clientName}
                        type={type}
                    />
                ))}
            </div>

        </div>
    );
}

export default CreateRoutine;