import React, {useEffect, useState} from 'react';
import { Search, ChevronDown, ArrowLeft, TrendingUp } from 'lucide-react';
import {getExercisesWithCategories, getUserExerciseList, calculateExerciseStats} from "../../domain/StatsDomain.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Exercise} from "../../config/StatsFireDB.tsx";
import "../../styles/ClientStats.css";
import {useParams, useNavigate} from "react-router-dom";
import { FaArrowLeft, FaHistory, FaDumbbell } from 'react-icons/fa';

import {
    BodyMeasurementType,
    getBodyMeasurementProgressData, getChartDataForMeasurement, MEASUREMENT_INFO,
    MeasurementSummary
} from "../../domain/BodyStatsDomain.tsx";

// Interfaces para tipado
interface MeasurementData {
    current: number;
    change: string;
    records: number;
    chartData: number[];
    summary?: MeasurementSummary;
}

interface ExerciseData {
    maxWeight: number;
    maxReps: number;
    effort: number;
    weightHistory: number[];
    repsHistory: number[];
    totalWeight: number;
    workoutCount: number;
}

interface CircularProgressProps {
    value: number;
    max: number;
    label: string;
    unit: string;
    color?: string;
}

interface LineChartProps {
    data: number[];
    height?: string;
}

type TabType = 'records' | 'measurements';

const ClientStats: React.FC = () => {
    const { uid: clientId } = useParams<{ uid: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabType>('records');
    const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurementType | string>('waist');
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [userExercises, setUserExercises] = useState<string[]>([]);
    const [exerciseStats, setExerciseStats] = useState<ExerciseData | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [clientName, setClientName] = useState<string>('');

    // Estados para medidas corporales
    const [bodyMeasurements, setBodyMeasurements] = useState<Record<string, MeasurementData>>({});
    const [availableBodyMetrics, setAvailableBodyMetrics] = useState<BodyMeasurementType[]>([]);
    const [isLoadingBodyStats, setIsLoadingBodyStats] = useState(false);

    // Datos de fallback para medidas corporales
    const fallbackMeasurementData: Record<string, MeasurementData> = {
        'waist': {
            current: 85,
            change: '-3',
            records: 4,
            chartData: [88, 87, 86, 85]
        },
        'weight': {
            current: 75,
            change: '+2',
            records: 6,
            chartData: [73, 73.5, 74, 74.5, 75, 75]
        },
        'chest': {
            current: 102,
            change: '+4',
            records: 5,
            chartData: [98, 99, 100, 101, 102]
        }
    };

    const CircularProgress: React.FC<CircularProgressProps> = ({
                                                                   value,
                                                                   max,
                                                                   label,
                                                                   unit,
                                                                   color = '#00E5CC'
                                                               }) => {
        const percentage = (value / max) * 100;
        const circumference = 2 * Math.PI * 45;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                    <svg
                        style={{ width: '96px', height: '96px', transform: 'rotate(-90deg)' }}
                        viewBox="0 0 96 96"
                    >
                        <circle
                            cx="48"
                            cy="48"
                            r="45"
                            stroke="#374151"
                            strokeWidth="6"
                            fill="transparent"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="45"
                            stroke={color}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#00E5CC'
                        }}>
                            {value} {unit}
                        </span>
                    </div>
                </div>
                <p style={{
                    fontSize: '14px',
                    color: '#D1D5DB',
                    marginTop: '8px',
                    textAlign: 'center'
                }}>
                    {label}
                </p>
            </div>
        );
    };

    const LineChart: React.FC<LineChartProps> = ({ data, height = '128px' }) => {
        const validData = Array.isArray(data) ? data.filter(val => typeof val === 'number' && !isNaN(val)) : [];

        if (validData.length === 0) {
            return (
                <div style={{
                    width: '100%',
                    height: height,
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No hay datos disponibles</p>
                </div>
            );
        }

        const max = Math.max(...validData);
        const min = Math.min(...validData);
        const range = max - min || 1;

        const points = validData.map((value: number, index: number) => {
            const x = (index / Math.max(validData.length - 1, 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div style={{
                width: '100%',
                height: height,
                backgroundColor: '#374151',
                borderRadius: '8px',
                padding: '16px'
            }}>
                <svg
                    style={{ width: '100%', height: 'calc(100% - 32px)' }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <polyline
                        fill="none"
                        stroke="#00E5CC"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={points}
                    />
                    {validData.map((value: number, index: number) => {
                        const x = (index / Math.max(validData.length - 1, 1)) * 100;
                        const y = 100 - ((value - min) / range) * 100;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="2"
                                fill="#00E5CC"
                            />
                        );
                    })}
                </svg>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#9CA3AF'
                }}>
                    {validData.map((value: number, index: number) => (
                        <span key={index}>{value}</span>
                    ))}
                </div>
            </div>
        );
    };

    // Función para cargar medidas corporales del cliente
    const loadBodyMeasurements = async () => {
        if (!clientId) return;

        setIsLoadingBodyStats(true);
        try {
            const progressData = await getBodyMeasurementProgressData(clientId);

            if (progressData && progressData.availableMetrics.length > 0) {
                const processedMeasurements: Record<string, MeasurementData> = {};

                progressData.availableMetrics.forEach(metric => {
                    const summary = progressData.summaries[metric];
                    const chartData = getChartDataForMeasurement(metric, progressData.measurements);

                    if (summary) {
                        processedMeasurements[metric] = {
                            current: summary.latestValue,
                            change: summary.change >= 0 ? `+${summary.change.toFixed(1)}` : summary.change.toFixed(1),
                            records: summary.totalRecords,
                            chartData: chartData.map(d => d.value),
                            summary
                        };
                    }
                });

                setBodyMeasurements(processedMeasurements);
                setAvailableBodyMetrics(progressData.availableMetrics);

                if (progressData.availableMetrics.length > 0 &&
                    !progressData.availableMetrics.includes(selectedMeasurement as BodyMeasurementType)) {
                    setSelectedMeasurement(progressData.availableMetrics[0]);
                }

                console.log('✅ Medidas corporales del cliente cargadas:', progressData.availableMetrics.length);
            } else {
                setBodyMeasurements(fallbackMeasurementData);
                setAvailableBodyMetrics([]);
                console.log('ℹ️ No hay suficientes medidas corporales del cliente, usando datos de ejemplo');
            }
        } catch (error) {
            console.error('Error cargando medidas corporales del cliente:', error);
            setBodyMeasurements(fallbackMeasurementData);
            setAvailableBodyMetrics([]);
        } finally {
            setIsLoadingBodyStats(false);
        }
    };

    // Función para cargar ejercicios del cliente
    const loadUserExercises = async () => {
        if (!clientId) return;

        try {
            const userExerciseList = await getUserExerciseList(clientId);
            setUserExercises(userExerciseList);

            if (userExerciseList.length > 0 && !selectedExercise) {
                setSelectedExercise(userExerciseList[0]);
            }
            console.log('✅ Ejercicios del cliente cargados:', userExerciseList.length);
        } catch (error) {
            console.error('Error cargando ejercicios del cliente:', error);
        }
    };

    // Función para cargar estadísticas del ejercicio seleccionado
    const loadExerciseStats = async (exerciseName: string) => {
        if (!clientId || !exerciseName) return;

        setIsLoadingStats(true);
        try {
            const stats = await calculateExerciseStats(clientId, exerciseName);
            setExerciseStats({
                maxWeight: stats.maxWeight,
                maxReps: stats.maxReps,
                effort: stats.averageRir,
                weightHistory: stats.weightHistory,
                repsHistory: stats.repsHistory,
                totalWeight: stats.totalWeight,
                workoutCount: stats.workoutCount
            });
            console.log('✅ Estadísticas del ejercicio cargadas para cliente');
        } catch (error) {
            console.error('Error cargando estadísticas del ejercicio del cliente:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    // Función para cargar información del cliente
    const loadClientInfo = async () => {
        if (!clientId) return;

        try {
            // Aquí puedes cargar información básica del cliente desde Firestore
            // Por ahora usamos un placeholder
            setClientName(`Cliente ${clientId.substring(0, 8)}`);
        } catch (error) {
            console.error('Error cargando información del cliente:', error);
        }
    };

    // Obtener datos actuales
    const currentMeasurement: MeasurementData = bodyMeasurements[selectedMeasurement] ||
        fallbackMeasurementData[selectedMeasurement] || {
            current: 0,
            change: '0',
            records: 0,
            chartData: [0]
        };

    const safeExerciseData: ExerciseData = exerciseStats || {
        maxWeight: 0,
        maxReps: 0,
        effort: 0,
        weightHistory: [0],
        repsHistory: [0],
        totalWeight: 0,
        workoutCount: 0
    };

    // Helper functions para manejo de tipos de medidas
    const getDisplayName = (measurement: BodyMeasurementType | string): string => {
        if (typeof measurement === 'string') {
            const maybeEnumKey = Object.values(BodyMeasurementType).find(val => val === measurement);
            if (maybeEnumKey) {
                return MEASUREMENT_INFO[maybeEnumKey].displayName;
            }
            return measurement;
        }
        return MEASUREMENT_INFO[measurement].displayName;
    };

    const getUnit = (measurement: BodyMeasurementType | string): string => {
        if (typeof measurement === 'string') {
            const maybeEnumKey = Object.values(BodyMeasurementType).find(val => val === measurement) as BodyMeasurementType | undefined;
            if (maybeEnumKey) {
                return MEASUREMENT_INFO[maybeEnumKey].unit;
            }
            return 'cm';
        }
        return MEASUREMENT_INFO[measurement].unit;
    };

    // Effects
    useEffect(() => {
        const loadData = async () => {
            if (!clientId || !currentUser?.uid) return;

            try {
                // Verificar que el cliente pertenece al entrenador actual
                // (Esta verificación la podrías hacer en el backend o aquí)

                await Promise.all([
                    loadClientInfo(),
                    loadUserExercises(),
                    loadBodyMeasurements()
                ]);

                // Cargar ejercicios globales para fallback
                const exercisesList = await getExercisesWithCategories();
                setExercises(exercisesList);
            } catch (error) {
                console.error('Error cargando datos del cliente:', error);
            }
        };

        loadData();
    }, [clientId, currentUser?.uid]);

    useEffect(() => {
        if (activeTab === 'measurements' && clientId) {
            loadBodyMeasurements();
        }
    }, [activeTab, clientId]);

    useEffect(() => {
        if (selectedExercise && clientId) {
            loadExerciseStats(selectedExercise);
        }
    }, [selectedExercise, clientId]);

    // Validaciones
    if (!clientId) {
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
                    <p>ID de cliente no válido</p>
                    <button
                        onClick={() => navigate('/clients')}
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
                        Volver a clientes
                    </button>
                </div>
            </div>
        );
    }

    if (activeTab === 'records' && !selectedExercise && !isLoadingStats) {
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
                    <p>
                        {userExercises.length === 0 ?
                            'Este cliente no tiene ejercicios registrados aún' :
                            'Cargando datos de ejercicios del cliente...'
                        }
                    </p>
                </div>
            </div>
        );
    }

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
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '32px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #374151'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: '#374151',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                <ArrowLeft size={16} />
                                Volver
                            </button>
                            <div>
                                <h1 style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    margin: '0'
                                }}>
                                    Estadísticas de {clientName}
                                </h1>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#9CA3AF',
                                    margin: '4px 0 0 0'
                                }}>
                                    Progreso y medidas del cliente
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp style={{ width: '24px', height: '24px', color: '#00E5CC' }} />
                        </div>
                    </div>

                    {/* Tabs and Selector Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '32px',
                        alignItems: 'end'
                    }}>
                        {/* Left Column - Tabs */}
                        <div style={{
                            backgroundColor: '#374151',
                            borderRadius: '12px',
                            padding: '4px',
                            display: 'flex'
                        }}>
                            <button
                                onClick={() => setActiveTab('records')}
                                style={{
                                    flex: 1,
                                    padding: '14px 20px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: activeTab === 'records' ? '#00E5CC' : 'transparent',
                                    color: activeTab === 'records' ? '#1F2937' : '#D1D5DB',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Records de ejercicios
                            </button>
                            <button
                                onClick={() => setActiveTab('measurements')}
                                style={{
                                    flex: 1,
                                    padding: '14px 20px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: activeTab === 'measurements' ? '#00E5CC' : 'transparent',
                                    color: activeTab === 'measurements' ? '#1F2937' : '#D1D5DB',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Medidas corporales
                            </button>
                        </div>

                        {/* Right Column - Selector */}
                        <div>
                            <h2 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#9CA3AF'
                            }}>
                                {activeTab === 'measurements' ? 'Seleccionar medida:' : 'Filtrar por ejercicio:'}
                            </h2>
                            <div style={{position: 'relative'}}>
                                <select
                                    value={activeTab === 'measurements' ? selectedMeasurement : selectedExercise}
                                    onChange={(e) => activeTab === 'measurements'
                                        ? setSelectedMeasurement(e.target.value)
                                        : setSelectedExercise(e.target.value)
                                    }
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        color: '#1F2937',
                                        padding: '18px 20px',
                                        borderRadius: '12px',
                                        appearance: 'none',
                                        border: '2px solid #00E5CC',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {activeTab === 'measurements'
                                        ? Object.keys(bodyMeasurements).length > 0
                                            ? Object.keys(bodyMeasurements).map((measurement) => (
                                                <option key={measurement} value={measurement}>
                                                    {getDisplayName(measurement)}
                                                </option>
                                            ))
                                            : Object.keys(fallbackMeasurementData).map((measurement) => (
                                                <option key={measurement} value={measurement}>
                                                    {getDisplayName(measurement)}
                                                </option>
                                            ))
                                        : [
                                            ...userExercises.map((exerciseName) => (
                                                <option key={exerciseName} value={exerciseName}>
                                                    {exerciseName} ({safeExerciseData.workoutCount > 0 ?
                                                    `${safeExerciseData.workoutCount} registros` :
                                                    'sin datos'})
                                                </option>
                                            )),
                                            ...exercises
                                                .filter(exercise => !userExercises.includes(exercise.name))
                                                .map((exercise) => (
                                                    <option key={exercise.name} value={exercise.name}>
                                                        {exercise.name} (disponible)
                                                    </option>
                                                ))
                                        ]
                                    }
                                </select>
                                <ChevronDown style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '24px',
                                    height: '24px',
                                    color: '#4B5563',
                                    pointerEvents: 'none'
                                }}/>
                            </div>
                        </div>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'measurements' ? (
                        <>
                            {/* Loading State for Body Stats */}
                            {isLoadingBodyStats && (
                                <div style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    marginBottom: '32px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#9CA3AF' }}>Cargando medidas corporales del cliente...</p>
                                </div>
                            )}

                            {/* Progress Chart and Summary - Side by Side Layout */}
                            {!isLoadingBodyStats && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr',
                                    gap: '32px',
                                    marginBottom: '32px'
                                }}>
                                    {/* Left Section - Progress Chart */}
                                    <div>
                                        <h3 style={{
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            color: '#F9FAFB'
                                        }}>
                                            Progreso de {getDisplayName(selectedMeasurement)}:
                                        </h3>
                                        <LineChart data={currentMeasurement.chartData} height="280px" />
                                    </div>

                                    {/* Right Section - Summary */}
                                    <div style={{
                                        backgroundColor: '#374151',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        height: 'fit-content'
                                    }}>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '24px',
                                            color: '#F9FAFB'
                                        }}>
                                            Resumen de {getDisplayName(selectedMeasurement)}
                                        </h3>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '20px'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#9CA3AF',
                                                    marginBottom: '6px',
                                                    fontWeight: '500'
                                                }}>
                                                    Valor actual:
                                                </p>
                                                <p style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    color: '#00E5CC'
                                                }}>
                                                    {currentMeasurement.current} {getUnit(selectedMeasurement)}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#9CA3AF',
                                                    marginBottom: '6px',
                                                    fontWeight: '500'
                                                }}>
                                                    Cambio total:
                                                </p>
                                                <p style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    color: currentMeasurement.change.startsWith('+') ? '#10B981' :
                                                        currentMeasurement.change.startsWith('-') ? '#EF4444' : '#00E5CC'
                                                }}>
                                                    {currentMeasurement.change} {getUnit(selectedMeasurement)}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#9CA3AF',
                                                    marginBottom: '6px',
                                                    fontWeight: '500'
                                                }}>
                                                    Registros:
                                                </p>
                                                <p style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                    color: '#00E5CC'
                                                }}>
                                                    {currentMeasurement.records}
                                                </p>
                                            </div>

                                            {/* Mostrar tendencia si hay datos reales */}
                                            {currentMeasurement.summary && (
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        color: currentMeasurement.summary.trend === 'increasing' ? '#10B981' :
                                                            currentMeasurement.summary.trend === 'decreasing' ? '#EF4444' : '#6B7280'
                                                    }}>
                                                        {currentMeasurement.summary.trend === 'increasing' ? '📈 Aumentando' :
                                                            currentMeasurement.summary.trend === 'decreasing' ? '📉 Disminuyendo' : '➡️ Estable'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* No Data State for Body Measurements */}
                            {!isLoadingBodyStats && availableBodyMetrics.length === 0 && (
                                <div style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '16px',
                                        color: '#F9FAFB'
                                    }}>
                                        Sin suficientes datos corporales
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#9CA3AF',
                                        marginBottom: '16px'
                                    }}>
                                        Este cliente necesita al menos 2 registros de medidas corporales para ver el progreso.
                                    </p>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#6B7280',
                                        fontStyle: 'italic'
                                    }}>
                                        Mostrando datos de ejemplo mientras tanto.
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Loading State */}
                            {isLoadingStats && (
                                <div style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    marginBottom: '32px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#9CA3AF' }}>Cargando estadísticas del cliente...</p>
                                </div>
                            )}

                            {/* Circular Progress Indicators */}
                            {!isLoadingStats && (
                                <div style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    marginBottom: '32px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '32px'
                                    }}>
                                        <div style={{textAlign: 'center'}}>
                                            <p style={{
                                                fontSize: '16px',
                                                color: '#9CA3AF',
                                                marginBottom: '16px',
                                                fontWeight: '600'
                                            }}>
                                                1RM: {safeExerciseData.maxWeight} Kg
                                            </p>
                                            <CircularProgress
                                                value={safeExerciseData.maxWeight}
                                                max={150}
                                                label={`${safeExerciseData.maxWeight} Kg`}
                                                unit=""
                                                color="#00E5CC"
                                            />
                                        </div>
                                        <div style={{textAlign: 'center'}}>
                                            <p style={{
                                                fontSize: '16px',
                                                color: '#9CA3AF',
                                                marginBottom: '16px',
                                                fontWeight: '600'
                                            }}>
                                                MR: {safeExerciseData.maxReps} reps
                                            </p>
                                            <CircularProgress
                                                value={safeExerciseData.maxReps}
                                                max={20}
                                                label={`${safeExerciseData.maxReps} reps`}
                                                unit=""
                                                color="#00E5CC"
                                            />
                                        </div>
                                        <div style={{textAlign: 'center'}}>
                                            <p style={{
                                                fontSize: '16px',
                                                color: '#9CA3AF',
                                                marginBottom: '16px',
                                                fontWeight: '600'
                                            }}>
                                                Esfuerzo: {safeExerciseData.effort} RIR
                                            </p>
                                            <CircularProgress
                                                value={safeExerciseData.effort}
                                                max={10}
                                                label={`${safeExerciseData.effort} RIR`}
                                                unit=""
                                                color="#F59E0B"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Weight and Repetitions Progress - Side by Side */}
                            {!isLoadingStats && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '24px',
                                    marginBottom: '32px'
                                }}>
                                    {/* Weight Progress */}
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '16px',
                                            color: '#F9FAFB'
                                        }}>
                                            Por peso:
                                        </h3>
                                        <LineChart data={safeExerciseData.weightHistory} height="140px" />
                                    </div>

                                    {/* Repetitions Progress */}
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '16px',
                                            color: '#F9FAFB'
                                        }}>
                                            Por repeticiones:
                                        </h3>
                                        <LineChart data={safeExerciseData.repsHistory} height="140px" />
                                    </div>
                                </div>
                            )}

                            {/* Summary Statistics */}
                            {!isLoadingStats && safeExerciseData.workoutCount > 0 && (
                                <div style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#F9FAFB'
                                    }}>
                                        Resumen de {selectedExercise}
                                    </h3>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '20px'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#9CA3AF',
                                                marginBottom: '6px',
                                                fontWeight: '500'
                                            }}>
                                                Total levantado:
                                            </p>
                                            <p style={{
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                color: '#00E5CC'
                                            }}>
                                                {safeExerciseData.totalWeight} kg
                                            </p>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#9CA3AF',
                                                marginBottom: '6px',
                                                fontWeight: '500'
                                            }}>
                                                Entrenamientos:
                                            </p>
                                            <p style={{
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                color: '#00E5CC'
                                            }}>
                                                {safeExerciseData.workoutCount}
                                            </p>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#9CA3AF',
                                                marginBottom: '6px',
                                                fontWeight: '500'
                                            }}>
                                                Promedio por sesión:
                                            </p>
                                            <p style={{
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                color: '#00E5CC'
                                            }}>
                                                {safeExerciseData.workoutCount > 0 ?
                                                    (safeExerciseData.totalWeight / safeExerciseData.workoutCount).toFixed(1) :
                                                    '0'
                                                } kg
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fun Facts for Client */}
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '16px',
                                        backgroundColor: '#4B5563',
                                        borderRadius: '8px'
                                    }}>
                                        <h4 style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#F9FAFB',
                                            marginBottom: '8px'
                                        }}>
                                            💪 Logros del cliente:
                                        </h4>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#D1D5DB',
                                            margin: '0'
                                        }}>
                                            {safeExerciseData.totalWeight >= 1000
                                                ? "¡Tu cliente ha levantado más de una tonelada! 🐘"
                                                : safeExerciseData.totalWeight >= 500
                                                    ? "¡Tu cliente ha levantado el peso de una motocicleta! 🏍️"
                                                    : safeExerciseData.totalWeight >= 100
                                                        ? "¡Tu cliente ha levantado el peso de una persona! 🧑‍🤝‍🧑"
                                                        : "¡Tu cliente está en el buen camino para alcanzar grandes logros! 🚀"
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* No Data State */}
                            {!isLoadingStats && safeExerciseData.workoutCount === 0 && selectedExercise && (
                                <div style={{
                                    backgroundColor: '#374151',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '16px',
                                        color: '#F9FAFB'
                                    }}>
                                        Sin datos para "{selectedExercise}"
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#9CA3AF',
                                        marginBottom: '0'
                                    }}>
                                        Este cliente no ha entrenado este ejercicio aún.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientStats;