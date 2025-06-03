import { Timestamp } from "firebase/firestore";
import { JSX } from 'react';
import {
    FaWeight, FaArrowUp, FaRulerHorizontal, FaHeart,
    FaDumbbell, FaRuler, FaRunning
} from "react-icons/fa";
import {BodyStats} from "./UserEntity.tsx";
import {BodyStatsData, ClientData, ClientProfileTData} from "../data/ClientProfileTData.tsx";

export interface ClientProfileState {
    clientData: ClientData;
    bodyStats: BodyStats | null;
    bodyStatsHistory: BodyStats[];
    loading: boolean;
    error: string | null;
}

export class ClientProfileTModel {
    /**
     * Calcula la edad desde el año de nacimiento
     */
    static calculateAge(birthYear: string | number): number | null {
        if (!birthYear) return null;
        const year = typeof birthYear === 'string' ? parseInt(birthYear) : birthYear;
        if (isNaN(year)) return null;
        return new Date().getFullYear() - year;
    }

    /**
     * Formatea el género para mostrar en español
     */
    static formatGender(gender: string): string {
        switch (gender) {
            case 'MALE': return 'Masculino';
            case 'FEMALE': return 'Femenino';
            case 'OTHER': return 'Otro';
            default: return 'No especificado';
        }
    }

    /**
     * Formatea fecha para mostrar en español
     */
    static formatDate(timestamp: Timestamp | Date | string | number | null | undefined): string {
        if (!timestamp) return 'Fecha no disponible';

        try {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
                return timestamp.toDate().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }

            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return 'Fecha no válida';
            }

            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return 'Fecha no válida';
        }
    }

    /**
     * Obtiene el icono apropiado para cada tipo de medida
     */
    static getMeasurementIcon(measurement: string): JSX.Element {
        const iconMap: Record<string, JSX.Element> = {
            'height': <FaArrowUp />,
            'weight': <FaWeight />,
            'waist': <FaRulerHorizontal />,
            'chest': <FaHeart />,
            'arms': <FaDumbbell />,
            'neck': <FaRuler />,
            'thigh': <FaRunning />,
            'calf': <FaRunning />
        };
        return iconMap[measurement] || <FaRuler />;
    }

    /**
     * Obtiene el nombre en español de cada medida
     */
    static getMeasurementLabel(measurement: string): string {
        const labelMap: Record<string, string> = {
            'height': 'Altura',
            'weight': 'Peso',
            'waist': 'Cintura',
            'chest': 'Pecho',
            'arms': 'Brazos',
            'neck': 'Cuello',
            'thigh': 'Muslos',
            'calf': 'Pantorrillas'
        };
        return labelMap[measurement] || measurement;
    }

    /**
     * Obtiene la unidad de medida apropiada
     */
    static getMeasurementUnit(measurement: string): string {
        return measurement === 'weight' ? 'kg' : 'cm';
    }

    /**
     * Obtiene las medidas válidas (mayores a 0) de un BodyStats
     */
    static getValidMeasurements(stats: BodyStats): Array<{
        key: string;
        value: number;
        label: string;
        unit: string;
        icon: JSX.Element;
    }> {
        const measurements = [
            { key: 'height', value: stats.height },
            { key: 'weight', value: stats.weight },
            { key: 'waist', value: stats.waist },
            { key: 'chest', value: stats.chest },
            { key: 'arms', value: stats.arms },
            { key: 'thigh', value: stats.thigh },
            { key: 'neck', value: stats.neck },
            { key: 'calf', value: stats.calf }
        ];

        return measurements
            .filter(m => m.value > 0)
            .map(m => ({
                key: m.key,
                value: m.value,
                label: this.getMeasurementLabel(m.key),
                unit: this.getMeasurementUnit(m.key),
                icon: this.getMeasurementIcon(m.key)
            }));
    }

    /**
     * Genera el nombre completo del cliente
     */
    static getClientFullName(clientData: ClientData): string {
        if (clientData.firstName || clientData.lastName) {
            return `${clientData.firstName} ${clientData.lastName}`.trim();
        }
        return 'Nombre no disponible';
    }

    /**
     * Carga todos los datos del cliente (perfil + medidas)
     */
    static async loadClientProfile(uid: string, currentTrainerUid: string): Promise<{
        clientData: ClientData;
        bodyStatsData: BodyStatsData;
    }> {
        // Verificar acceso del entrenador
        const hasAccess = await ClientProfileTData.verifyTrainerAccess(uid, currentTrainerUid);
        if (!hasAccess) {
            throw new Error('No tienes permisos para ver este cliente');
        }

        // Cargar datos del cliente en paralelo
        const [clientData, bodyStatsData] = await Promise.all([
            ClientProfileTData.getClientData(uid),
            ClientProfileTData.getBodyStats(uid)
        ]);

        return {
            clientData,
            bodyStatsData
        };
    }

    /**
     * Valida si hay medidas históricas disponibles
     */
    static hasHistoricalData(bodyStatsHistory: BodyStats[]): boolean {
        return bodyStatsHistory.length > 1;
    }

    /**
     * Valida si el cliente tiene medidas actuales
     */
    static hasCurrentMeasurements(bodyStats: BodyStats | null): boolean {
        return bodyStats !== null;
    }
}