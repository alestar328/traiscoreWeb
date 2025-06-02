import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "./Button.tsx";
import { ClientProfile } from "../models/UserEntity.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import "../../src/styles/ClientCard.css";

// Interface actualizada para coincidir con UserEntity
interface ClientCardProps extends Partial<ClientProfile> {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    userRole: 'CLIENT';

    // Propiedades opcionales del nuevo UserEntity
    photoURL?: string;
    birthYear?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';

    // Callbacks
    onDelete?: (uid: string) => void;
    onClick?: (client: ClientProfile) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
                                                   uid,
                                                   firstName,
                                                   lastName,
                                                   email,
                                                   birthYear,
                                                   gender,
                                                   photoURL,
                                                   userRole,
                                                   onDelete,
                                                   onClick,
                                                   ...rest
                                               }) => {
    // Calcular edad desde birthYear si está disponible
    const calculateAgeFromYear = (year?: number): string => {
        if (!year) return '—';
        const currentYear = new Date().getFullYear();
        return `${currentYear - year}`;
    };

    const age = calculateAgeFromYear(birthYear);

    // Formatear género para mostrar
    const getGenderDisplay = (gender?: 'MALE' | 'FEMALE' | 'OTHER'): string => {
        switch (gender) {
            case 'MALE':
                return 'Masculino';
            case 'FEMALE':
                return 'Femenino';
            case 'OTHER':
                return 'Otro';
            default:
                return '—';
        }
    };

    // Crear objeto cliente completo para onClick
    const clientData: ClientProfile = {
        uid,
        firstName,
        lastName,
        email,
        photoURL,
        birthYear,
        gender,
        userRole,
        ...rest
    };

    // Manejar click en la tarjeta (si hay onClick definido)
    const handleCardClick = () => {
        if (onClick) {
            onClick(clientData);
        }
    };

    return (
        <div
            className={`client-card ${onClick ? 'clickable' : ''}`}
            onClick={onClick ? handleCardClick : undefined}
        >
            {onDelete && (
                <button
                    className="card-delete-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevenir que se active el onClick del card
                        onDelete(uid);
                    }}
                    title="Eliminar cliente"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )}

            <div className="client-avatar">
                {photoURL ? (
                    <img
                        src={photoURL}
                        alt={`${firstName} ${lastName}`}
                        className="avatar-image"
                    />
                ) : (
                    <FontAwesomeIcon icon={faUser} className="avatar-icon" />
                )}
            </div>

            <div className="client-details">
                <h3 className="client-name">
                    {firstName} {lastName}
                </h3>

                <p className="client-info">
                    <strong>Email:</strong> {email}
                </p>

                <p className="client-info">
                    <strong>Edad:</strong> {age} años
                </p>

                {gender && (
                    <p className="client-info">
                        <strong>Sexo:</strong> {getGenderDisplay(gender)}
                    </p>
                )}

                <div className="client-actions">
                    <Link to={`/clientprofile/${uid}`}>
                        <Button buttonStyle="btn--outline" buttonSize="btn--large">
                            Ver perfil
                        </Button>
                    </Link>

                    {/* Botón adicional para ver rutinas del cliente */}
                    <Link to={`/client-routines/${uid}`}>
                        <Button buttonStyle="btn--primary" buttonSize="btn--medium">
                            Ver rutinas
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientCard;