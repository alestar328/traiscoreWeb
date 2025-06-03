import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ClientStats.css";
import { BodyMeasurementType } from "../../domain/BodyStatsDomain";
import {
    Header,
    TabSelector,
    MeasurementSelector,
    MeasurementProgress,
    ExerciseProgress
} from "../ClientStatsUI.tsx";
import { ClientStatsState, ClientStatsTModel, TabType } from "../../models/ClientStatsTModel.tsx";
import { ClientStatsTData } from "../../data/ClientStatsTData.tsx";

const ClientStats: React.FC = () => {
    const { uid: clientId } = useParams<{ uid: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // DEBUG: Logs inmediatos
    console.log('🔍 ClientStats mounted with:', {
        clientId,
        currentUserUid: currentUser?.uid,
        urlParams: useParams()
    });

    // Estado principal del componente
    const [state, setState] = useState<ClientStatsState>(ClientStatsTModel.getInitialState());
    const [activeTab, setActiveTab] = useState<TabType>('records');
    const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurementType | string>('waist');
    const [selectedExercise, setSelectedExercise] = useState<string>('');

    // Función de carga inicial del cliente
    const loadInitialClientData = async () => {
        console.log('🚀 loadInitialClientData called with:', { clientId, currentUserUid: currentUser?.uid });

        if (!clientId || !currentUser?.uid) {
            console.log('❌ Faltan parámetros:', {
                clientId: !!clientId,
                currentUserUid: !!currentUser?.uid,
                clientIdValue: clientId,
                currentUserUidValue: currentUser?.uid
            });
            setState(prev => ({
                ...prev,
                error: 'Parámetros de cliente no válidos',
                isLoadingInitial: false
            }));
            return;
        }

        try {
            console.log('🚀 Iniciando carga de datos del cliente:', clientId);
            setState(prev => ({ ...prev, error: null, isLoadingInitial: true }));

            // DEBUG: Añadir la función de debug temporal
            await ClientStatsTData.debugUserSubcollections(clientId);

            // Validar parámetros
            const validation = ClientStatsTModel.validateParameters(clientId, currentUser.uid);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            // Cargar información completa del cliente
            const { clientInfo, hasWorkouts, hasBodyMeasurements } = await ClientStatsTModel.loadCompleteClientInfo(
                clientId,
                currentUser.uid
            );

            // Cargar datos adicionales en paralelo
            const [userExercises, allExercises] = await Promise.all([
                ClientStatsTModel.loadUserExercises(clientId),
                ClientStatsTModel.loadAllExercises()
            ]);

            setState(prev => ({
                ...prev,
                clientInfo,
                userExercises,
                exercises: allExercises,
                hasWorkoutData: hasWorkouts,
                hasBodyData: hasBodyMeasurements,
                isLoadingInitial: false,
                error: null
            }));

            // Establecer ejercicio inicial si hay datos disponibles
            if (userExercises.length > 0 && !selectedExercise) {
                setSelectedExercise(userExercises[0]);
            }

            console.log('✅ Datos iniciales del cliente cargados exitosamente:', {
                cliente: ClientStatsTModel.getClientDisplayName(clientInfo),
                hasWorkouts,
                hasBodyMeasurements,
                ejercicios: userExercises.length
            });

        } catch (error) {
            console.error('❌ Error cargando datos iniciales del cliente:', error);
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Error cargando los datos del cliente',
                isLoadingInitial: false
            }));
        }
    };

    // Función de carga de medidas corporales
    const loadBodyMeasurements = async () => {
        if (!clientId || !state.hasBodyData) {
            console.log('ℹ️ Saltando carga de medidas corporales - no hay datos o clientId inválido');
            return;
        }

        setState(prev => ({ ...prev, isLoadingBodyStats: true }));

        try {
            const { measurements, availableMetrics } = await ClientStatsTModel.loadBodyMeasurements(clientId);

            setState(prev => ({
                ...prev,
                bodyMeasurements: measurements,
                availableBodyMetrics: availableMetrics,
                isLoadingBodyStats: false
            }));

            // Ajustar selección si es necesario
            if (availableMetrics.length > 0 &&
                !availableMetrics.includes(selectedMeasurement as BodyMeasurementType)) {
                setSelectedMeasurement(availableMetrics[0]);
            }

        } catch (error) {
            console.error('❌ Error cargando medidas corporales:', error);
            setState(prev => ({ ...prev, isLoadingBodyStats: false }));
        }
    };

    // Función de carga de estadísticas de ejercicio
    const loadExerciseStats = async (exerciseName: string) => {
        if (!clientId || !exerciseName || !state.hasWorkoutData) {
            console.log('ℹ️ Saltando carga de estadísticas - no hay datos o parámetros inválidos');
            return;
        }

        setState(prev => ({ ...prev, isLoadingStats: true }));

        try {
            const exerciseData = await ClientStatsTModel.loadExerciseStats(clientId, exerciseName);

            setState(prev => ({
                ...prev,
                exerciseStats: exerciseData,
                isLoadingStats: false
            }));

        } catch (error) {
            console.error('❌ Error cargando estadísticas del ejercicio:', error);
            setState(prev => ({ ...prev, isLoadingStats: false }));
        }
    };

    // Effects
    useEffect(() => {
        console.log('🔄 useEffect principal triggered:', { clientId, currentUserUid: currentUser?.uid });
        loadInitialClientData();
    }, [clientId, currentUser?.uid]);

    useEffect(() => {
        if (activeTab === 'measurements' && clientId && state.hasBodyData && !state.isLoadingInitial) {
            loadBodyMeasurements();
        }
    }, [activeTab, clientId, state.hasBodyData, state.isLoadingInitial]);

    useEffect(() => {
        if (selectedExercise && clientId && state.hasWorkoutData && !state.isLoadingInitial) {
            loadExerciseStats(selectedExercise);
        }
    }, [selectedExercise, clientId, state.hasWorkoutData, state.isLoadingInitial]);

    // DEBUG: Logs del estado actual
    console.log('🔍 Estado actual del componente:', {
        clientId,
        currentUserUid: currentUser?.uid,
        isLoadingInitial: state.isLoadingInitial,
        error: state.error,
        hasWorkoutData: state.hasWorkoutData,
        hasBodyData: state.hasBodyData,
        clientInfo: state.clientInfo
    });

    // Renderizado de estados de error y carga
    if (!clientId) {
        console.log('❌ ClientId is falsy:', { clientId, type: typeof clientId });
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0F172A',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <p>DEBUG: No se pudo obtener el ID del cliente</p>
                    <p>ClientId: {JSON.stringify(clientId)}</p>
                    <p>Params: {JSON.stringify(useParams())}</p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            marginTop: '16px',
                            padding: '8px 16px',
                            backgroundColor: '#00E5CC',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    if (state.isLoadingInitial) {
        console.log('⏳ Mostrando estado de carga inicial');
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0F172A',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <p>Cargando información del cliente...</p>
                    <p>DEBUG: ClientId: {clientId}</p>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #374151',
                        borderTop: '4px solid #00E5CC',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '16px auto'
                    }} />
                </div>
            </div>
        );
    }

    if (state.error) {
        console.log('❌ Mostrando estado de error:', state.error);
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0F172A',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#EF4444', marginBottom: '16px' }}>Error</h3>
                    <p>{state.error}</p>
                    <p>DEBUG: ClientId: {clientId}</p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            marginTop: '16px',
                            padding: '8px 16px',
                            backgroundColor: '#00E5CC',
                            color: '#1F2937',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    // Verificar si hay datos disponibles para la pestaña activa
    if (!state.hasWorkoutData && activeTab === 'records') {
        console.log('⚠️ No hay datos de entrenamientos para la pestaña records');
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0F172A',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <h3 style={{ marginBottom: '16px' }}>Sin datos de entrenamientos</h3>
                    <p style={{ marginBottom: '20px' }}>
                        {ClientStatsTModel.getNoDataMessage(state.hasWorkoutData, state.hasBodyData, activeTab)}
                    </p>
                    <p>DEBUG: ClientId: {clientId}</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={() => setActiveTab('measurements')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: state.hasBodyData ? '#00E5CC' : '#6B7280',
                                color: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: state.hasBodyData ? 'pointer' : 'not-allowed'
                            }}
                            disabled={!state.hasBodyData}
                        >
                            Ver medidas corporales
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!state.hasBodyData && activeTab === 'measurements') {
        console.log('⚠️ No hay datos de medidas corporales para la pestaña measurements');
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0F172A',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <h3 style={{ marginBottom: '16px' }}>Sin datos de medidas corporales</h3>
                    <p style={{ marginBottom: '20px' }}>
                        {ClientStatsTModel.getNoDataMessage(state.hasWorkoutData, state.hasBodyData, activeTab)}
                    </p>
                    <p>DEBUG: ClientId: {clientId}</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={() => setActiveTab('records')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: state.hasWorkoutData ? '#00E5CC' : '#6B7280',
                                color: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: state.hasWorkoutData ? 'pointer' : 'not-allowed'
                            }}
                            disabled={!state.hasWorkoutData}
                        >
                            Ver entrenamientos
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Obtener datos actuales para renderizado
    const currentMeasurement = ClientStatsTModel.getCurrentMeasurement(
        state.bodyMeasurements,
        selectedMeasurement
    );
    const safeExerciseData = ClientStatsTModel.getSafeExerciseData(state.exerciseStats);
    const hasHistoricalData = ClientStatsTModel.hasHistoricalBodyData(state.availableBodyMetrics);

    console.log('✅ Renderizando componente principal');

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0F172A',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            {/* Container Marco */}
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                backgroundColor: '#1F2937',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #374151',
                overflow: 'hidden'
            }}>
                {/* Dashboard Content */}
                <div style={{
                    color: 'white',
                    padding: '24px'
                }}>
                    {/* Header */}
                    <Header
                        clientInfo={state.clientInfo}
                        onBack={() => navigate(-1)}
                    />

                    {/* Tabs and Selector Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '32px',
                        alignItems: 'end'
                    }}>
                        {/* Left Column - Tabs */}
                        <TabSelector
                            activeTab={activeTab}
                            onTabChange={(tab) => {
                                // Solo permitir cambio si hay datos disponibles para esa pestaña
                                if (tab === 'records' && !state.hasWorkoutData) {
                                    console.log('ℹ️ No se puede cambiar a records - sin datos de entrenamientos');
                                    return;
                                }
                                if (tab === 'measurements' && !state.hasBodyData) {
                                    console.log('ℹ️ No se puede cambiar a measurements - sin datos corporales');
                                    return;
                                }
                                setActiveTab(tab);
                            }}
                        />

                        {/* Right Column - Selector */}
                        <MeasurementSelector
                            activeTab={activeTab}
                            selectedMeasurement={selectedMeasurement}
                            selectedExercise={selectedExercise}
                            bodyMeasurements={state.bodyMeasurements}
                            userExercises={state.userExercises}
                            exercises={state.exercises}
                            exerciseData={safeExerciseData}
                            onMeasurementChange={setSelectedMeasurement}
                            onExerciseChange={setSelectedExercise}
                        />
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'measurements' ? (
                        <MeasurementProgress
                            selectedMeasurement={selectedMeasurement}
                            currentMeasurement={currentMeasurement}
                            isLoading={state.isLoadingBodyStats}
                            hasHistoricalData={hasHistoricalData}
                        />
                    ) : (
                        <ExerciseProgress
                            selectedExercise={selectedExercise}
                            exerciseData={safeExerciseData}
                            isLoading={state.isLoadingStats}
                        />
                    )}
                </div>
            </div>

            {/* CSS para la animación de carga */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default ClientStats;