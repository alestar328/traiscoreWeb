
//INTERFACES
export interface Exercise {
    name: string;
    series:string;
    reps: string;
    weight: string;
    rir: number;
}

export interface Routine {
    id?: string;
    title: string;
    type: string;
    createdBy: string;
    createdAt: Date;
    exercises: Exercise[][];
}

