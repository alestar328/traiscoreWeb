import React, {useEffect, useState} from 'react';
import { Search, ChevronDown } from 'lucide-react';
import {getExercisesWithCategories, getWorkoutsTotal} from "../../domain/StatsDomain.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Exercise} from "../../config/StatsFireDB.tsx";

// Interfaces para tipado
interface MeasurementData {
    current: number;
    change: string;
    records: number;
    chartData: number[];
}

interface ExerciseData {
    maxWeight: number;
    maxReps: number;
    effort: number;
    weightHistory: number[];
    repsHistory: number[];
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

const ProgressDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('records');
    const [selectedMeasurement, setSelectedMeasurement] = useState<string>('Cintura');
    const [selectedExercise, setSelectedExercise] = useState<string>('Press banca');
    const { currentUser} = useAuth();
    const [exercises, setExercises] = useState<Exercise[]>([]);

    // Datos de ejemplo para medidas corporales
    const measurementData: Record<string, MeasurementData> = {
        'Cintura': {
            current: 444,
            change: '+321',
            records: 4,
            chartData: [123, 800, 450, 444]
        },
        'Pecho': {
            current: 158,
            change: '+12',
            records: 6,
            chartData: [146, 150, 152, 155, 156, 158]
        },
        'Brazos': {
            current: 120,
            change: '+8',
            records: 5,
            chartData: [112, 115, 117, 118, 120]
        }
    };

    // Datos de ejemplo para ejercicios
    const exerciseData: Record<string, ExerciseData> = {
        'Press banca': {
            maxWeight: 60.0,
            maxReps: 8,
            effort: 2,
            weightHistory: [60, 25, 22, 20, 30, 25, 25, 27, 27, 27],
            repsHistory: [5, 6, 8, 8, 6, 7, 8, 8, 6, 6]
        },
        'Sentadillas': {
            maxWeight: 80.0,
            maxReps: 12,
            effort: 3,
            weightHistory: [80, 75, 70, 72, 75, 78, 80, 82, 80, 85],
            repsHistory: [8, 10, 12, 10, 9, 8, 10, 12, 11, 12]
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
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const points = data.map((value: number, index: number) => {
            const x = (index / (data.length - 1)) * 100;
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
                        strokeWidth="2"
                        points={points}
                    />
                    {data.map((value: number, index: number) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = 100 - ((value - min) / range) * 100;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="1.5"
                                fill="#00E5CC"
                            />
                        );
                    })}
                </svg>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#9CA3AF'
                }}>
                    {data.map((value: number, index: number) => (
                        <span key={index}>{value}</span>
                    ))}
                </div>
            </div>
        );
    };

    const currentMeasurement: MeasurementData = measurementData[selectedMeasurement];
    const currentExercise: ExerciseData = exerciseData[selectedExercise];



    useEffect(() => {
        const loadExercises = async () => {
            try {
                const exercisesList = await getExercisesWithCategories();
                setExercises(exercisesList);

                // Si hay ejercicios, seleccionar el primero por defecto
                if (exercisesList.length > 0) {
                    setSelectedExercise(exercisesList[0].name);
                }
            } catch (error) {
                console.error('Error cargando ejercicios:', error);
            }
        };

        loadExercises();
    }, []);


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
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            margin: '0'
                        }}>
                            Trai<span style={{ color: '#00E5CC' }}>Score</span>
                        </h1>
                        <Search style={{ width: '28px', height: '28px', color: '#00E5CC' }} />
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
                                onClick={async () => {
                                    setActiveTab('records');

                                    // Llamar función para comprobar conexión
                                    if (currentUser?.uid) {
                                        await getWorkoutsTotal(currentUser.uid);
                                    } else {
                                        console.warn('⚠️ No hay usuario autenticado');
                                    }
                                }}
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
                                Mis records
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
                                Mis medidas
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
                                {activeTab === 'measurements' ? 'Seleccionar medida:' : 'Filtrar por:'}
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
                                        ? Object.keys(measurementData).map((measurement) => (
                                            <option key={measurement} value={measurement}>
                                                {measurement}
                                            </option>
                                        ))
                                        : exercises.map((exercise) => (
                                            <option key={exercise.name} value={exercise.name}>
                                                {exercise.name}
                                            </option>
                                        ))
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
                            {/* Measurement Selector */}
                            <div style={{marginBottom: '32px'}}>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    marginBottom: '16px',
                                    color: '#F9FAFB'
                                }}>
                                    Seleccionar medida:
                                </h2>
                                <div style={{position: 'relative'}}>
                                    <select
                                        value={selectedMeasurement}
                                        onChange={(e) => setSelectedMeasurement(e.target.value)}
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
                                        {Object.keys(measurementData).map((measurement) => (
                                            <option key={measurement} value={measurement}>
                                                {measurement}
                                            </option>
                                        ))}
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
                                    }} />
                                </div>
                            </div>

                            {/* Progress Chart and Summary - Side by Side Layout */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr', // 2/3 para gráfico, 1/3 para resumen
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
                                        Progreso de {selectedMeasurement}:
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
                                        Resumen de {selectedMeasurement}
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
                                                {currentMeasurement.current} cm
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
                                                color: '#00E5CC'
                                            }}>
                                                {currentMeasurement.change} cm
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
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>


                            {/* Circular Progress Indicators */}
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
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#9CA3AF',
                                            marginBottom: '16px',
                                            fontWeight: '600'
                                        }}>
                                            1RM: {currentExercise.maxWeight}
                                        </p>
                                        <CircularProgress
                                            value={currentExercise.maxWeight}
                                            max={100}
                                            label={`${currentExercise.maxWeight} Kg`}
                                            unit=""
                                            color="#00E5CC"
                                        />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#9CA3AF',
                                            marginBottom: '16px',
                                            fontWeight: '600'
                                        }}>
                                            MR: {currentExercise.maxReps}
                                        </p>
                                        <CircularProgress
                                            value={currentExercise.maxReps}
                                            max={15}
                                            label={`${currentExercise.maxReps} reps`}
                                            unit=""
                                            color="#00E5CC"
                                        />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#9CA3AF',
                                            marginBottom: '16px',
                                            fontWeight: '600'
                                        }}>
                                            Esfuerzo
                                        </p>
                                        <CircularProgress
                                            value={currentExercise.effort}
                                            max={10}
                                            label={`${currentExercise.effort} RIR`}
                                            unit=""
                                            color="#F59E0B"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Weight Progress */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    color: '#F9FAFB'
                                }}>
                                    Por peso:
                                </h3>
                                <LineChart data={currentExercise.weightHistory} height="180px" />
                            </div>

                            {/* Repetitions Progress */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    color: '#F9FAFB'
                                }}>
                                    Por repeticiones:
                                </h3>
                                <LineChart data={currentExercise.repsHistory} height="180px" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressDashboard;