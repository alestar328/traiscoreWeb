import {BodyStats, UserEntity} from "../../models/UserEntity.tsx";
import "../../styles/ClientProfileBoard.css";
import * as React from "react";

import {
    FaUser,
    FaArrowUp,
    FaWeight,
    FaRulerHorizontal,
    FaHeart,
    FaDumbbell,
    FaRuler,
    FaRunning,
    FaArrowLeft, FaHistory
} from "react-icons/fa";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {JSX, useEffect, useState, type FC} from "react";
import {doc, getDoc, collection, getDocs, query, orderBy,  Timestamp} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig.tsx";

interface LoadingState {
    loading: boolean;
    error: string | null;
}

const ClientProfileBoard: FC = () => {
    const { currentUser, state: authState } = useAuth();
    const [client, setClient] = useState<UserEntity | null>(null);
    const [bodyStats, setBodyStats] = useState<BodyStats | null>(null);
    const [bodyStatsHistory, setBodyStatsHistory] = useState<BodyStats[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [state, setState] = useState<LoadingState>({
        loading: true,
        error: null
    });

    // Datos de logros - estos pueden venir de Firebase en el futuro
    const [achievements] = useState({
        peso: 65,
        tenK: 50,
        fuerza: 80,
    });

    useEffect(() => {
        const loadClientData = async () => {
            if (authState.loading) {
                return;
            }

            if (!currentUser) {
                setState({ loading: false, error: 'Usuario no autenticado' });
                return;
            }

            try {
                setState({ loading: true, error: null });

                if (currentUser.userRole === 'CLIENT') {
                    // 1. Cargar datos básicos del usuario
                    const clientRef = doc(db, "users", currentUser.uid);
                    const clientSnap = await getDoc(clientRef);

                    if (!clientSnap.exists()) {
                        setState({ loading: false, error: 'Perfil de usuario no encontrado' });
                        return;
                    }

                    const clientData = clientSnap.data() as UserEntity;
                    setClient(clientData);

                    // 2. Cargar medidas corporales - TODAS para el historial
                    try {
                        const bodyStatsRef = collection(db, "users", currentUser.uid, "bodyStats");
                        const bodyStatsQuery = query(
                            bodyStatsRef,
                            orderBy("createdAt", "desc")
                        );

                        const bodyStatsSnap = await getDocs(bodyStatsQuery);

                        if (!bodyStatsSnap.empty) {
                            const allBodyStats: BodyStats[] = bodyStatsSnap.docs.map(doc => {
                                const rawBodyStats = doc.data();
                                return {
                                    userId: doc.id,
                                    height: parseFloat(rawBodyStats.measurements?.Height || '0') || 0,
                                    weight: parseFloat(rawBodyStats.measurements?.Weight || '0') || 0,
                                    neck: parseFloat(rawBodyStats.measurements?.Neck || '0') || 0,
                                    chest: parseFloat(rawBodyStats.measurements?.Chest || '0') || 0,
                                    arms: parseFloat(rawBodyStats.measurements?.Arms || '0') || 0,
                                    waist: parseFloat(rawBodyStats.measurements?.Waist || '0') || 0,
                                    thigh: parseFloat(rawBodyStats.measurements?.Thigh || '0') || 0,
                                    calf: parseFloat(rawBodyStats.measurements?.Calf || '0') || 0,
                                    measurementDate: rawBodyStats.createdAt || rawBodyStats.updatedAt || Timestamp.now(),
                                    createdAt: rawBodyStats.createdAt,
                                    updatedAt: rawBodyStats.updatedAt
                                };
                            });

                            setBodyStatsHistory(allBodyStats);
                            setBodyStats(allBodyStats[0] || null); // El más reciente
                        } else {
                            setBodyStats(null);
                            setBodyStatsHistory([]);
                        }
                    } catch (bodyStatsError) {
                        console.error('Error cargando bodyStats:', bodyStatsError);
                        setBodyStats(null);
                        setBodyStatsHistory([]);
                    }

                    setState({ loading: false, error: null });
                } else {
                    setState({ loading: false, error: 'Solo los clientes pueden ver esta página' });
                }

            } catch (error) {
                setState({
                    loading: false,
                    error: `Error al cargar los datos del cliente: ${error instanceof Error ? error.message : 'Error desconocido'}`
                });
            }
        };

        loadClientData();
    }, [currentUser, authState.loading]);

    // Función para calcular la edad desde birthYear
    const calculateAge = (birthYear?: number): number | null => {
        if (!birthYear) return null;
        return new Date().getFullYear() - birthYear;
    };

    // Función para formatear el género
    const formatGender = (gender?: string): string => {
        switch (gender) {
            case 'MALE': return 'Masculino';
            case 'FEMALE': return 'Femenino';
            case 'OTHER': return 'Otro';
            default: return 'No especificado';
        }
    };

    // Función para formatear fecha
    const formatDate = (timestamp: Timestamp | Date | string | number | null | undefined): string => {
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
    };

    // Función para obtener icono de medida
    const getMeasurementIcon = (measurement: string) => {
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
    };

    // Función para renderizar una entrada de medidas
    const renderMeasurements = (stats: BodyStats, isHistorical: boolean = false) => (
        <div className={`measurement-entry ${isHistorical ? 'historical' : 'current'}`}>
            {isHistorical && (
                <div className="measurement-date">
                    {formatDate(stats.measurementDate)}
                </div>
            )}
            <ul>
                {stats.height > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('height')}
                        </div>
                        <span className="measurement-label">Altura</span>
                        <span className="measurement-value">{stats.height} cm</span>
                    </li>
                )}
                {stats.weight > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('weight')}
                        </div>
                        <span className="measurement-label">Peso</span>
                        <span className="measurement-value">{stats.weight} kg</span>
                    </li>
                )}
                {stats.waist > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('waist')}
                        </div>
                        <span className="measurement-label">Cintura</span>
                        <span className="measurement-value">{stats.waist} cm</span>
                    </li>
                )}
                {stats.chest > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('chest')}
                        </div>
                        <span className="measurement-label">Pecho</span>
                        <span className="measurement-value">{stats.chest} cm</span>
                    </li>
                )}
                {stats.arms > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('arms')}
                        </div>
                        <span className="measurement-label">Brazos</span>
                        <span className="measurement-value">{stats.arms} cm</span>
                    </li>
                )}
                {stats.thigh > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('thigh')}
                        </div>
                        <span className="measurement-label">Muslos</span>
                        <span className="measurement-value">{stats.thigh} cm</span>
                    </li>
                )}
            </ul>
        </div>
    );

    // Mostrar loading mientras se autentica
    if (authState.loading) {
        return (
            <div className="client-profile-board loading">
                <div className="loading-spinner">Autenticando usuario...</div>
            </div>
        );
    }

    // Mostrar error de autenticación
    if (authState.error) {
        return (
            <div className="client-profile-board error">
                <div className="error-message">
                    Error de autenticación: {authState.error}
                </div>
            </div>
        );
    }

    // Mostrar loading mientras se cargan los datos del cliente
    if (state.loading) {
        return (
            <div className="client-profile-board loading">
                <div className="loading-spinner">Cargando perfil del cliente...</div>
            </div>
        );
    }

    // Mostrar error si hay algún problema
    if (state.error) {
        return (
            <div className="client-profile-board error">
                <div className="error-message">{state.error}</div>
            </div>
        );
    }

    return (
        <div className="client-profile-board">
            {/* Tarjeta del perfil */}
            <div className="profile-header">
                <div className="avatar">
                    {client?.photoURL ? (
                        <img src={client.photoURL} alt={`${client.firstName} avatar`}/>
                    ) : (
                        <FaUser className="avatar-icon"/>
                    )}
                </div>
                <div className="profile-info">
                    <h2>
                        {client ? `${client.firstName} ${client.lastName}` : 'Nombre no disponible'}
                    </h2>
                    <div className="basic-stats">
                        <span>Edad: {client ? (calculateAge(client.birthYear) || 'No especificada') : 'No disponible'}</span>
                        <span>Nivel: Intermedio</span>
                        <span>Género: {client ? formatGender(client.gender) : 'No especificado'}</span>
                        <span>Email: {client?.email || 'No disponible'}</span>
                        {client?.createdAt && (
                            <span>Miembro desde: {formatDate(client.createdAt)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tarjeta de medidas corporales */}
            <div className="measurements">
                <div className="measurements-header">
                    <h3>{showHistory ? 'Historial de Medidas' : 'Medidas Corporales'}</h3>
                    {bodyStatsHistory.length > 1 && (
                        <button
                            className="history-toggle-btn"
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            {showHistory ? (
                                <>
                                    <FaArrowLeft /> Volver
                                </>
                            ) : (
                                <>
                                    <FaHistory /> Ver Historial ({bodyStatsHistory.length})
                                </>
                            )}
                        </button>
                    )}
                </div>

                {showHistory ? (
                    // Vista de historial
                    <div className="history-view">
                        {bodyStatsHistory.length > 0 ? (
                            <div className="history-list">
                                {bodyStatsHistory.map((stats, index) => (
                                    <div key={index} className="history-item">
                                        {renderMeasurements(stats, true)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No hay registros históricos</p>
                        )}
                    </div>
                ) : (
                    // Vista actual
                    <div className="current-view">
                        {bodyStats ? (
                            <>
                                <div>
                                    Última actualización: {formatDate(bodyStats.measurementDate)}
                                </div>
                                {renderMeasurements(bodyStats)}
                            </>
                        ) : (
                            <p>No hay medidas registradas</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientProfileBoard;