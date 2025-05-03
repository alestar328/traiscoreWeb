
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

export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDelta = today.getMonth() - birthDate.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}