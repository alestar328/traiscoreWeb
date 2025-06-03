import { useState, useEffect } from 'react';
import {
    FaUser, FaArrowLeft, FaDumbbell, FaHistory, FaCalendarAlt
} from "react-icons/fa";
import "../../styles/ClientProfileForm.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { BodyStats } from "../../models/UserEntity.tsx";
import {ClientData} from "../../data/ClientProfileTData.tsx";
import {ClientProfileState, ClientProfileTModel} from "../../models/ClientProfileTModel.tsx";

const initialClientData: ClientData = {
    firstName: '',
    lastName: '',
    email: '',
    birthYear: '',
    gender: '',
    photoURL: ''
};

function ClientProfileTUI() {
    const { uid } = useParams<{ uid: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [state, setState] = useState<ClientProfileState>({
        clientData: initialClientData,
        bodyStats: null,
        bodyStatsHistory: [],
        loading: true,
        error: null
    });

    const [showHistory, setShowHistory] = useState(false);

    // Función para renderizar las medidas de un BodyStats
    const renderMeasurements = (stats: BodyStats, isHistorical: boolean = false) => {
        const validMeasurements = ClientProfileTModel.getValidMeasurements(stats);

        return (
            <div className={`measurement-entry ${isHistorical ? 'historical' : 'current'}`}>
                {isHistorical && (
                    <div className="measurement-date">
                        <FaCalendarAlt />
                        {ClientProfileTModel.formatDate(stats.measurementDate)}
                    </div>
                )}
                <ul>
                    {validMeasurements.map(measurement => (
                        <li key={measurement.key}>
                            <div className="measurement-icon">
                                {measurement.icon}
                            </div>
                            <span className="measurement-label">{measurement.label}</span>
                            <span className="measurement-value">
                                {measurement.value} {measurement.unit}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Cargar datos del cliente
    useEffect(() => {
        if (!uid || !currentUser) return;

        const loadClientData = async () => {
            try {
                setState(prev => ({
                    ...prev,
                    loading: true,
                    error: null
                }));

                const { clientData, bodyStatsData } = await ClientProfileTModel.loadClientProfile(
                    uid,
                    currentUser.uid
                );

                setState(prev => ({
                    ...prev,
                    clientData,
                    bodyStats: bodyStatsData.bodyStats,
                    bodyStatsHistory: bodyStatsData.bodyStatsHistory,
                    loading: false,
                    error: null
                }));

            } catch (err) {
                console.error('Error cargando datos del cliente:', err);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: err instanceof Error ? err.message : 'Error cargando los datos del cliente'
                }));
            }
        };

        loadClientData();
    }, [uid, currentUser]);

    if (state.loading) {
        return (
            <div className="client-profile-board loading">
                <div className="loading-spinner">Cargando perfil del cliente...</div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="client-profile-board error">
                <div className="error-message">{state.error}</div>
                <button onClick={() => navigate(-1)} className="back-btn">
                    <FaArrowLeft />
                    Volver
                </button>
            </div>
        );
    }

    const { clientData, bodyStats, bodyStatsHistory } = state;
    const hasHistoricalData = ClientProfileTModel.hasHistoricalData(bodyStatsHistory);
    const hasCurrentMeasurements = ClientProfileTModel.hasCurrentMeasurements(bodyStats);

    return (
        <div className="client-profile-board">
            {/* Header con botón de regreso */}
            <div className="profile-actions">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    type="button"
                >
                    <FaArrowLeft />
                    Volver
                </button>
            </div>

            {/* Tarjeta del perfil */}
            <div className="profile-header">
                <div className="avatar">
                    {clientData.photoURL ? (
                        <img
                            src={clientData.photoURL}
                            alt={`${clientData.firstName} avatar`}
                        />
                    ) : (
                        <FaUser className="avatar-icon"/>
                    )}
                </div>

                <div className="profile-info">
                    <h2>{ClientProfileTModel.getClientFullName(clientData)}</h2>
                    <div className="basic-stats">
                        <span>
                            Edad: {ClientProfileTModel.calculateAge(clientData.birthYear) || 'No especificada'}
                        </span>
                        <span>
                            Género: {ClientProfileTModel.formatGender(clientData.gender)}
                        </span>
                        <span>
                            Email: {clientData.email || 'No disponible'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tarjeta de medidas corporales */}
            <div className="measurements">
                <div className="measurements-header">
                    <h3>{showHistory ? 'Historial de Medidas' : 'Medidas Corporales'}</h3>
                    {hasHistoricalData && (
                        <button
                            className="history-toggle-btn"
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            {showHistory ? (
                                <>
                                    <FaArrowLeft/> Volver
                                </>
                            ) : (
                                <>
                                    <FaHistory/> Ver Historial ({bodyStatsHistory.length})
                                </>
                            )}
                        </button>
                    )}
                    <button
                        className="view-exercises-btn"
                        onClick={() => navigate(`/clientstats/${uid}`)}
                    >
                        <FaDumbbell/> Ver ejercicios
                    </button>
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
                        {hasCurrentMeasurements ? (
                            <>
                                <div className="last-update">
                                    Última actualización: {ClientProfileTModel.formatDate(bodyStats!.measurementDate)}
                                </div>
                                {renderMeasurements(bodyStats!)}
                            </>
                        ) : (
                            <div className="no-measurements">
                                <p>No hay medidas registradas para este cliente</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClientProfileTUI;