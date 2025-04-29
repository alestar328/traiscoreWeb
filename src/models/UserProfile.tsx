export type UserRole = 'client' | 'trainer';

export interface UserProfile {
    uid: string;
    userEmail: string;
    userName: string;
    userLastName: string;
    userPhotoURL?: string;
    birthDate?: Date;
    userRole: UserRole;
    createdAt?: Date;
    linkedTrainerUid?: string;
}

export interface TrainerProfile extends UserProfile {
    specialty: string;
    certificationId?: string;
    experienceYears?: number;
}
type Kilograms = number;
type Centimeters = number;

export interface ClientProfile extends UserProfile {
    age: number;
    weight?: Kilograms;
    height?: Centimeters;
    waistSize?: Centimeters;
    armSize?: Centimeters;
    calfSize?: Centimeters;
    chestSize?: Centimeters;
}

