import React from 'react';
import {Link} from "react-router-dom";
import {Button} from "./Button.tsx";
import {ClientProfile} from "../models/UserProfile.tsx";
import {calculateAge} from "../utils/UsefullFunctions.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import "../../src/styles/ClientCard.css";


interface onDelete extends ClientProfile {
    onDelete?: (uid: string) => void;
}

const ClientCard: React.FC<onDelete> = ({
                                         uid,
                                         userName,
                                         userLastName,
                                         birthDate,
                                         gender,
                                         userPhotoURL,
                                         onDelete
                                     }) => {
    const age = birthDate ? calculateAge(birthDate) : '—';

    return (
        <div className="client-card">
            {onDelete && (
                <button
                    className="card-delete-btn"
                    onClick={() => onDelete(uid)}
                    title="Eliminar cliente"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )}
            <div className="client-avatar">
                {userPhotoURL ? (
                    <img
                        src={userPhotoURL}
                        alt={`${userName} ${userLastName}`}
                        className="avatar-image"
                    />
                ) : (
                    <FontAwesomeIcon icon={faUser} className="avatar-icon" />
                )}
            </div>

            <div className="client-details">
                <h3 className="client-name">
                    {userName} {userLastName}
                </h3>

                <p className="client-info">
                    <strong>Edad:</strong> {age}
                </p>

                {gender && (
                    <p className="client-info">
                        <strong>Sexo:</strong> {gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : 'Otro'}
                    </p>
                )}

                <Link to={`/clientprofile/${uid}`}> {/* Ajusta ruta si fuera necesario */}
                    <Button buttonStyle="btn--outline" buttonSize="btn--large">
                        Ver perfil
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ClientCard;
