import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {Button} from "./Button.tsx";


interface ClientCardProps {
    fullName: string;
    lastName: string;
    age: number;
    gender: string;
    sport: string;
    photoUrl?: string; // Opcional
}

const ClientCard: React.FC<ClientCardProps> = ({
                                                   fullName,
                                                   lastName,
                                                   age,
                                                   gender,
                                                   sport,
                                                   photoUrl
                                               }) => {
    return (
        <div style={{
            width: '220px',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '12px',
            backgroundColor: '#000000',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${fullName} ${lastName}`}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (

                    <FontAwesomeIcon
                        icon={faUser}
                        style={{ fontSize: '60px', color: '#ccc' }}
                    />
                )}
            </div>
            <h3 style={{ margin: 0 }}>{fullName} {lastName}</h3>
            <p style={{ margin: '4px 0' }}>Edad: {age}</p>
            <p style={{ margin: '4px 0' }}>Sexo: {gender}</p>
            <p style={{ margin: '4px 0' }}>Deporte: {sport}</p>
            <Link to="/clientprofile">
                <Button buttonStyle="btn--outline" buttonSize="btn--large" className="login-btn">
                    Ver perfil
                </Button>
            </Link>
        </div>
    );
};

export default ClientCard;