import {Exercise} from "../features/routines/types.tsx";
import '../styles/RoutineTablePrev.css';

interface Props {
    exercises: Exercise[];
    clientName: string;
    type: string;
}

function RoutineTablePrev({ exercises, type }: Props) {
    return (
       <>
            <h3>
             Tipo: <em>{type}</em>
            </h3>

            <table className="preview-table">
                <thead>
                <tr>
                <th>Ejercicio</th>
                    <th>Series</th>
                    <th>Reps Estimadas</th>
                    <th>Peso</th>
                    <th>RIR</th>
                </tr>
                </thead>
                <tbody>
                {exercises.map((ex, index) => (
                    <tr key={index}>
                        <td>{ex.name}</td>
                        <td>{ex.series}</td>
                        <td>{ex.reps}</td>
                        <td>{ex.weight}</td>
                        <td>{ex.rir}</td>
                    </tr>
                ))}
                </tbody>
            </table>
       </>
    );
}

export default RoutineTablePrev;