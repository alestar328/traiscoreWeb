
import { Exercise } from '../features/routines/types.tsx';

type RoutineSection = {
    type: string;
    exercises: Exercise[];
};

export function exportRoutineToJson(
    clientName: string,
    sections: RoutineSection[]
): void {
    const routineData = {
        clientName,
        createdAt: new Date().toISOString(),
        sections  // ahora exportamos correctamente la estructura actual
    };

    const jsonString = JSON.stringify(routineData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "routine.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}