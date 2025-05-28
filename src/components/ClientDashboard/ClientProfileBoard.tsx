

// Datos hardcodeados de ejemplo
import RechargeBar from "../elements/RechargeBar.tsx";
import {ClientProfile} from "../../models/UserProfile.tsx";
import "../../styles/ClientProfileBoard.css";
import {FaUser} from "react-icons/fa";


const client: ClientProfile = {
    uid: 'abc123',
    email: 'cliente@fitapp.com',
    userName: 'Carlos',
    userLastName: 'Pérez',
    userPhotoURL: '', // URL de la foto
    birthDate: new Date('1993-07-22'),
    userRole: 'CLIENT',
    createdAt: new Date('2022-01-15'),
    linkedTrainerUid: 'trainer456',
    gender: 'MALE',
    measurements: {
        heightCm: 175,
        weightKg: 72,
        neckCm: 38,
        chestCm: 102,
        armsCm: 34,
        waistCm: 80,
        thighCm: 55,
        calfCm: 38,
    },
};

// Datos de persona fitness
const persona = {
    motto: 'SIN DOLOR, NO HAY GANANCIA',
    characteristics: {
        resistencia: 70,
        fuerza: 85,
        flexibilidad: 50,
        motivacion: 95,
    },
    // Valores para Estado de logros
    achievements: {
        peso: 65,
        tenK: 50,
        fuerza: 80,
    },
    interests: {},
    goals: [],
    frustrations: [],
    habits: [],
};


const ClientProfileBoard: React.FC = () => {
    return (
        <div className="client-profile-board">
            {/* Header con foto y datos básicos */}
            <div className="profile-header">
                <div className="avatar">
                    {client.userPhotoURL ? (
                        <img src={client.userPhotoURL} alt={`${client.userName} avatar`}/>
                    ) : (
                        <FaUser className="avatar-icon"/>
                    )}
                </div>
                <div className="profile-info">
                    <h2>{`${client.userName} ${client.userLastName}`}</h2>
                    <div className="basic-stats">
                        <span>Edad: {client.birthDate && new Date().getFullYear() - client.birthDate.getFullYear()} años</span>
                        <span>Nivel: Intermedio</span>
                        <span>Género: Macho</span>
                        <span>Ciudad: Ciudad Ejemplo</span>
                        <span>Telefono: Ciudad Ejemplo</span>
                        <span>Email: Ciudad Ejemplo</span>
                    </div>
                </div>
            </div>

            {/* Medidas */}
            <div className="measurements">
                <h3>Medidas Corporales</h3>
                <ul>
                    {client.measurements && (
                        <>
                            {client.measurements.heightCm != null && (
                                <li>Altura: {client.measurements.heightCm} cm</li>
                            )}
                            {client.measurements.weightKg != null && (
                                <li>Peso: {client.measurements.weightKg} kg</li>
                            )}
                            {client.measurements.neckCm != null && (
                                <li>Cuello: {client.measurements.neckCm} cm</li>
                            )}
                            {client.measurements.chestCm != null && (
                                <li>Pecho: {client.measurements.chestCm} cm</li>
                            )}
                            {client.measurements.armsCm != null && (
                                <li>Brazos: {client.measurements.armsCm} cm</li>
                            )}
                            {client.measurements.waistCm != null && (
                                <li>Cintura: {client.measurements.waistCm} cm</li>
                            )}
                            {client.measurements.thighCm != null && (
                                <li>Muslos: {client.measurements.thighCm} cm</li>
                            )}
                            {client.measurements.calfCm != null && (
                                <li>Pantorrillas: {client.measurements.calfCm} cm</li>
                            )}
                        </>
                    )}
                </ul>
            </div>

            {/* Intereses Deportivos */}
            <div className="achievements-interest">
                <div className="interests">
                    <h3>Estado de logros</h3>
                    <RechargeBar label="Peso corporal" value={persona.achievements.peso} />
                    <RechargeBar label="10 km" value={persona.achievements.tenK} />
                    <RechargeBar label="Fuerza" value={persona.achievements.fuerza} />
                </div>
                <div className="de-interes">
                    <h3>De Interés</h3>
                    <ul>
                        {['Lesión de rodilla', 'Reumatismo manos'].map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default ClientProfileBoard;