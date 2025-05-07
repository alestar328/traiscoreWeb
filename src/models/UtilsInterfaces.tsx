export interface ClientMeasurements {
    height: number;
    weight: number;
    neck: number;
    chest: number;
    arms: number;
    waist: number;
    thigh: number;
    calf: number;
}

export interface RegClientFormData {
    gender: "" | "male" | "female" | "other";
    phone: string;
    address: string;
    measurements: ClientMeasurements;
}