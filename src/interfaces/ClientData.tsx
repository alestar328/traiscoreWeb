


export interface ClientData {
    fullName: string;
    age: string;     // Podemos dejarlo como string para validación y convertir al enviar
    gender: string;
    height: string;
    weight: string;
    goal: string;
    notes: string;
    photoUrl?: string;
    intolerances?: string;
}