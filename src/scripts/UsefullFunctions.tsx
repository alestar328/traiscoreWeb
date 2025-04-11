
import { Exercise } from '../features/routines/types.tsx';


export function exportRoutineToJson(
    clientName: string,
    routineByType: Record<string, Exercise[]> // Puedes especificar un tipo más preciso si lo tienes
): void {
    // Construye el objeto con los datos a exportar
    const routineData = {
        clientName,             // ahora clientName viene como parámetro
        createdAt: new Date(),  // Si quieres conservarlo así
        routine: routineByType  // routineByType también viene como parámetro
    };

    // Convertir el objeto a una cadena JSON con formato
    const jsonString = JSON.stringify(routineData, null, 2);

    // Crear un Blob a partir de esa cadena y generar una URL
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Crear un enlace temporal para iniciar la descarga
    const link = document.createElement("a");
    link.href = url;
    link.download = "routine.json"; // Nombre del archivo de exportación
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revocar la URL después de la descarga (opcional)
    URL.revokeObjectURL(url);
}