import React from 'react';
import { TrendingUp, ArrowLeft, ChevronDown } from 'lucide-react';
import {ClientStatsTModel, ExerciseData, MeasurementData, TabType} from "../models/ClientStatsTModel.tsx";
import {ClientInfo} from "../data/ClientStatsTData.tsx";
import {Exercise} from "../config/StatsFireDB.tsx";


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

interface HeaderProps {
    clientInfo: ClientInfo | null;
    onBack: () => void;
}

interface TabSelectorProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

interface MeasurementSelectorProps {
    activeTab: TabType;
    selectedMeasurement: string;
    selectedExercise: string;
    bodyMeasurements: Record<string, MeasurementData>;
    userExercises: string[];
    exercises: Exercise[];
    exerciseData: ExerciseData;
    onMeasurementChange: (measurement: string) => void;
    onExerciseChange: (exercise: string) => void;
}

interface MeasurementProgressProps {
    selectedMeasurement: string;
    currentMeasurement: MeasurementData;
    isLoading: boolean;
    hasHistoricalData: boolean;
}

interface ExerciseProgressProps {
    selectedExercise: string;
    exerciseData: ExerciseData;
    isLoading: boolean;
}

// Componente de progreso circular
export const CircularProgress: React.FC<CircularProgressProps> = ({
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

// Componente de gráfico lineal
export const LineChart: React.FC<LineChartProps> = ({ data, height = '128px' }) => {
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

// Componente de encabezado
export const Header: React.FC<HeaderProps> = ({ clientInfo, onBack }) => (
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
                onClick={onBack}
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
                    Estadísticas de {ClientStatsTModel.getClientDisplayName(clientInfo)}
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
);

// Componente selector de pestañas
export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => (
    <div style={{
        backgroundColor: '#374151',
        borderRadius: '12px',
        padding: '4px',
        display: 'flex'
    }}>
        <button
            onClick={() => onTabChange('records')}
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
            onClick={() => onTabChange('measurements')}
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
);

// Componente selector de medidas/ejercicios
export const MeasurementSelector: React.FC<MeasurementSelectorProps> = ({
                                                                            activeTab,
                                                                            selectedMeasurement,
                                                                            selectedExercise,
                                                                            bodyMeasurements,
                                                                            userExercises,
                                                                            exercises,
                                                                            exerciseData,
                                                                            onMeasurementChange,
                                                                            onExerciseChange
                                                                        }) => (
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
                    ? onMeasurementChange(e.target.value)
                    : onExerciseChange(e.target.value)
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
                                {ClientStatsTModel.getDisplayName(measurement)}
                            </option>
                        ))
                        : Object.keys(bodyMeasurements).map((measurement) => (
                            <option key={measurement} value={measurement}>
                                {ClientStatsTModel.getDisplayName(measurement)}
                            </option>
                        ))
                    : [
                        ...userExercises.map((exerciseName) => (
                            <option key={exerciseName} value={exerciseName}>
                                {exerciseName} ({exerciseData.workoutCount > 0 ?
                                `${exerciseData.workoutCount} registros` :
                                'sin datos'})
                            </option>
                        )),
                        ...ClientStatsTModel.getAvailableExercises(exercises, userExercises)
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
);

// Componente de progreso de medidas corporales
export const MeasurementProgress: React.FC<MeasurementProgressProps> = ({
                                                                            selectedMeasurement,
                                                                            currentMeasurement,
                                                                            isLoading,
                                                                            hasHistoricalData
                                                                        }) => {
    if (isLoading) {
        return (
            <div style={{
                backgroundColor: '#374151',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                textAlign: 'center'
            }}>
                <p style={{ color: '#9CA3AF' }}>Cargando medidas corporales del cliente...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '32px',
                marginBottom: '32px'
            }}>
                {/* Gráfico de progreso */}
                <div>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '20px',
                        color: '#F9FAFB'
                    }}>
                        Progreso de {ClientStatsTModel.getDisplayName(selectedMeasurement)}:
                    </h3>
                    <LineChart data={currentMeasurement.chartData} height="280px" />
                </div>

                {/* Resumen */}
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
                        Resumen de {ClientStatsTModel.getDisplayName(selectedMeasurement)}
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
                                {currentMeasurement.current} {ClientStatsTModel.getUnit(selectedMeasurement)}
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
                                color: ClientStatsTModel.getChangeColor(currentMeasurement.change)
                            }}>
                                {currentMeasurement.change} {ClientStatsTModel.getUnit(selectedMeasurement)}
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
                                    color: ClientStatsTModel.getTrendColor(currentMeasurement.summary.trend)
                                }}>
                                    {ClientStatsTModel.getTrendText(currentMeasurement.summary.trend)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Estado sin datos para medidas corporales */}
            {!hasHistoricalData && (
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
    );
};

// Componente de progreso de ejercicios
export const ExerciseProgress: React.FC<ExerciseProgressProps> = ({
                                                                      selectedExercise,
                                                                      exerciseData,
                                                                      isLoading
                                                                  }) => {
    if (isLoading) {
        return (
            <div style={{
                backgroundColor: '#374151',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                textAlign: 'center'
            }}>
                <p style={{ color: '#9CA3AF' }}>Cargando estadísticas del cliente...</p>
            </div>
        );
    }

    const hasData = ClientStatsTModel.hasExerciseData(exerciseData);

    return (
        <>
            {/* Indicadores de progreso circular */}
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
                            1RM: {exerciseData.maxWeight} Kg
                        </p>
                        <CircularProgress
                            value={exerciseData.maxWeight}
                            max={150}
                            label={`${exerciseData.maxWeight} Kg`}
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
                            MR: {exerciseData.maxReps} reps
                        </p>
                        <CircularProgress
                            value={exerciseData.maxReps}
                            max={20}
                            label={`${exerciseData.maxReps} reps`}
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
                            Esfuerzo: {exerciseData.effort} RIR
                        </p>
                        <CircularProgress
                            value={exerciseData.effort}
                            max={10}
                            label={`${exerciseData.effort} RIR`}
                            unit=""
                            color="#F59E0B"
                        />
                    </div>
                </div>
            </div>

            {/* Progreso de peso y repeticiones */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <div>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        color: '#F9FAFB'
                    }}>
                        Por peso:
                    </h3>
                    <LineChart data={exerciseData.weightHistory} height="140px" />
                </div>

                <div>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        color: '#F9FAFB'
                    }}>
                        Por repeticiones:
                    </h3>
                    <LineChart data={exerciseData.repsHistory} height="140px" />
                </div>
            </div>

            {/* Estadísticas de resumen */}
            {hasData && (
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
                                {exerciseData.totalWeight} kg
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
                                {exerciseData.workoutCount}
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
                                {ClientStatsTModel.calculateAveragePerSession(exerciseData.totalWeight, exerciseData.workoutCount)} kg
                            </p>
                        </div>
                    </div>

                    {/* Mensaje motivacional */}
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
                            {ClientStatsTModel.getMotivationalMessage(exerciseData.totalWeight)}
                        </p>
                    </div>
                </div>
            )}

            {/* Estado sin datos */}
            {!hasData && selectedExercise && (
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
    );
};