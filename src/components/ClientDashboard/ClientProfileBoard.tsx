import {BodyStats, UserEntity} from "../../models/UserEntity.tsx";
import "../../styles/ClientProfileBoard.css";
import {FaUser, FaArrowUp, FaWeight, FaRulerHorizontal, FaHeart, FaDumbbell, FaRuler, FaRunning} from "react-icons/fa";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {JSX, useEffect, useState} from "react";
import {doc, getDoc, collection, getDocs, query, orderBy, limit, Timestamp} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig.tsx";

interface LoadingState {
    loading: boolean;
    error: string | null;
}

const ClientProfileBoard: React.FC = () => {
    const { currentUser, state: authState } = useAuth();
    const [client, setClient] = useState<UserEntity | null>(null);
    const [bodyStats, setBodyStats] = useState<BodyStats | null>(null);
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

                    // 2. Cargar medidas corporales más recientes desde bodyStats
                    try {
                        const bodyStatsRef = collection(db, "users", currentUser.uid, "bodyStats");
                        const bodyStatsQuery = query(
                            bodyStatsRef,
                            orderBy("createdAt", "desc"),
                            limit(1)
                        );

                        const bodyStatsSnap = await getDocs(bodyStatsQuery);

                        if (!bodyStatsSnap.empty) {
                            const rawBodyStats = bodyStatsSnap.docs[0].data();

                            const convertedBodyStats: BodyStats = {
                                userId: bodyStatsSnap.docs[0].id,
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

                            setBodyStats(convertedBodyStats);
                        } else {
                            setBodyStats(null);
                        }
                    } catch (bodyStatsError) {
                        console.error('Error cargando bodyStats:', bodyStatsError);
                        setBodyStats(null);
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
                <h3>Medidas Corporales</h3>
                {bodyStats ? (
                    <>
                        <div>
                            Última actualización: {formatDate(bodyStats.measurementDate)}
                        </div>
                        <ul>
                            {bodyStats.height > 0 && (
                                <li>
                                    <div className="measurement-icon">
                                        {getMeasurementIcon('height')}
                                    </div>
                                    <span className="measurement-label">Altura</span>
                                    <span className="measurement-value">{bodyStats.height} cm</span>
                                </li>
                            )}
                            {bodyStats.weight > 0 && (
                                <li>
                                    <div className="measurement-icon">
                                        {getMeasurementIcon('weight')}
                                    </div>
                                    <span className="measurement-label">Peso</span>
                                    <span className="measurement-value">{bodyStats.weight} kg</span>
                                </li>
                            )}
                            {bodyStats.waist > 0 && (
                                <li>
                                    <div className="measurement-icon">
                                        {getMeasurementIcon('waist')}
                                    </div>
                                    <span className="measurement-label">Cintura</span>
                                    <span className="measurement-value">{bodyStats.waist} cm</span>
                                </li>
                            )}
                            {bodyStats.chest > 0 && (
                                <li>
                                    <div className="measurement-icon">
                                        {getMeasurementIcon('chest')}
                                    </div>
                                    <span className="measurement-label">Pecho</span>
                                    <span className="measurement-value">{bodyStats.chest} cm</span>
                                </li>
                            )}
                            {bodyStats.arms > 0 && (
                                <li>
                                    <div className="measurement-icon">
                                        {getMeasurementIcon('arms')}
                                    </div>
                                    <span className="measurement-label">Brazos</span>
                                    <span className="measurement-value">{bodyStats.arms} cm</span>
                                </li>
                            )}
                            {bodyStats.thigh > 0 && (
                                <li>
                                    <div className="measurement-icon">
                                        {getMeasurementIcon('thigh')}
                                    </div>
                                    <span className="measurement-label">Muslos</span>
                                    <span className="measurement-value">{bodyStats.thigh} cm</span>
                                </li>
                            )}
                        </ul>
                    </>
                ) : (
                    <p>No hay medidas registradas</p>
                )}
            </div>


        </div>
    );
};

export default ClientProfileBoard;