
import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, User, Download, Plus, Eye, Filter } from 'lucide-react';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp
} from '@firebase/firestore';
import {useAuth} from "../../contexts/AuthContext.tsx";
import { firestore } from '../../firebase/firebaseConfig.tsx'; // Ajusta la ruta según tu estructura
import "../../styles/ClientRoutines.css";


// Types matching the Firebase structure
interface SimpleExercise {
    name: string;
    series: number;
    reps: string;
    weight: string;
    rir: number;
}

interface RoutineSection {
    type: string;
    exercises: SimpleExercise[];
}

interface RoutineDocument {
    userId: string;
    trainerId?: string;
    documentId: string;
    type: string;
    createdAt?: Timestamp;
    clientName: string;
    routineName: string;
    sections: RoutineSection[];
}

// Component for individual routine card
const RoutineCard: React.FC<{
    routine: RoutineDocument;
    onView: (routine: RoutineDocument) => void;
    onDelete: (routineId: string, routineName: string) => void;
    onExport: (routine: RoutineDocument) => void;
}> = ({ routine, onView, onDelete, onExport }) => {
    const formatDate = (timestamp?: Timestamp) => {
        if (!timestamp) return 'Fecha desconocida';
        return timestamp.toDate().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getTotalExercises = () => {
        return routine.sections.reduce((total, section) => total + section.exercises.length, 0);
    };



    const getCategoryColor = (type: string) => {
        const colors: Record<string, string> = {
            'Empuje': '#10B981',
            'Tirón': '#3B82F6',
            'Pierna': '#F59E0B',
            'Full Body': '#8B5CF6',
            'Cardio': '#EF4444'
        };
        return colors[type] || '#6B7280';
    };

    return (
        <div className="routine-card">
            <div className="routine-card-header">
                <div className="routine-info">
                    <h3 className="routine-name">{routine.routineName || routine.clientName}</h3>
                    <div className="routine-meta">
                        <span className="routine-date">
                            <Calendar size={14} />
                            {formatDate(routine.createdAt)}
                        </span>
                        <span className="routine-exercises">
                            {getTotalExercises()} ejercicios
                        </span>
                    </div>
                </div>

                <div className="routine-actions">
                    <button
                        className="action-btn view-btn"
                        onClick={() => onView(routine)}
                        title="Ver rutina"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="action-btn export-btn"
                        onClick={() => onExport(routine)}
                        title="Exportar rutina"
                    >
                        <Download size={16} />
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(routine.documentId, routine.routineName || routine.clientName)}
                        title="Eliminar rutina"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="routine-sections">
                {routine.sections.map((section, index) => (
                    <span
                        key={index}
                        className="section-tag"
                        style={{ backgroundColor: getCategoryColor(section.type) }}
                    >
                        {section.type}
                    </span>
                ))}
            </div>

            {routine.trainerId && (
                <div className="trainer-info">
                    <User size={12} />
                    <span>Creada por entrenador</span>
                </div>
            )}
        </div>
    );
};

// Modal for viewing routine details
const RoutineViewModal: React.FC<{
    routine: RoutineDocument | null;
    onClose: () => void;
}> = ({ routine, onClose }) => {
    if (!routine) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{routine.routineName || routine.clientName}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {routine.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="section-container">
                            <h3 className="section-title">{section.type}</h3>
                            <div className="exercises-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Ejercicio</th>
                                        <th>Series</th>
                                        <th>Reps</th>
                                        <th>Peso</th>
                                        <th>RIR</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {section.exercises.map((exercise, exerciseIndex) => (
                                        <tr key={exerciseIndex}>
                                            <td className="exercise-name">{exercise.name}</td>
                                            <td>{exercise.series}</td>
                                            <td>{exercise.reps || '-'}</td>
                                            <td>{exercise.weight || '-'}</td>
                                            <td>{exercise.rir}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main component
const ClientRoutines: React.FC = () => {
    const { currentUser } = useAuth();
    const [routines, setRoutines] = useState<RoutineDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoutine, setSelectedRoutine] = useState<RoutineDocument | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, routineId: string, routineName: string}>({
        show: false,
        routineId: '',
        routineName: ''
    });
    const [filterType, setFilterType] = useState<string>('all');

    // Load routines from Firebase
    const loadRoutines = async () => {
        if (!currentUser?.uid) {
            setError('Usuario no autenticado');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const routinesRef = collection(firestore, 'users', currentUser.uid, 'routines');
            const q = query(routinesRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const routinesList: RoutineDocument[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                routinesList.push({
                    documentId: doc.id,
                    userId: data.userId || currentUser.uid,
                    trainerId: data.trainerId,
                    type: data.sections?.[0]?.type || '',
                    createdAt: data.createdAt,
                    clientName: data.clientName || '',
                    routineName: data.routineName || data.clientName || '',
                    sections: data.sections || []
                });
            });

            setRoutines(routinesList);
            setError(null);
        } catch (err) {
            console.error('Error loading routines:', err);
            setError('Error al cargar las rutinas');
        } finally {
            setLoading(false);
        }
    };

    // Delete routine
    const handleDelete = async (routineId: string) => {
        if (!currentUser?.uid) return;

        try {
            await deleteDoc(doc(firestore, 'users', currentUser.uid, 'routines', routineId));
            setRoutines(prev => prev.filter(routine => routine.documentId !== routineId));
            setDeleteConfirm({ show: false, routineId: '', routineName: '' });
        } catch (err) {
            console.error('Error deleting routine:', err);
            setError('Error al eliminar la rutina');
        }
    };

    // Export routine to JSON
    const handleExport = (routine: RoutineDocument) => {
        const exportData = {
            fileType: "TraiScore_Routine",
            appVersion: "2.0.0",
            routineName: routine.routineName,
            clientName: routine.clientName,
            createdAt: routine.createdAt?.toDate().toISOString(),
            sections: routine.sections
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${routine.routineName || 'rutina'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Filter routines
    const filteredRoutines = filterType === 'all'
        ? routines
        : routines.filter(routine =>
            routine.sections.some(section => section.type === filterType)
        );

    useEffect(() => {
        loadRoutines();
    }, [currentUser?.uid]);

    if (loading) {
        return (
            <div className="routines-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando rutinas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="routines-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={loadRoutines} className="retry-btn">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="routines-container">
            <div className="routines-header">
                <div className="header-title">
                    <h1>Mis Rutinas</h1>
                    <span className="routines-count">
                        {filteredRoutines.length} rutina{filteredRoutines.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="header-actions">
                    <div className="filter-section">
                        <Filter size={16} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todas</option>
                            <option value="Empuje">Empuje</option>
                            <option value="Tirón">Tirón</option>
                            <option value="Pierna">Pierna</option>
                            <option value="Full Body">Full Body</option>
                            <option value="Cardio">Cardio</option>
                        </select>
                    </div>

                    <button
                        className="create-routine-btn"
                        onClick={() => window.location.href = '/create-routine'}
                    >
                        <Plus size={16} />
                        Nueva Rutina
                    </button>
                </div>
            </div>

            {filteredRoutines.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No tienes rutinas guardadas</h3>
                    <p>Crea tu primera rutina para empezar a entrenar</p>
                    <button
                        className="create-first-routine-btn"
                        onClick={() => window.location.href = '/create-routine'}
                    >
                        <Plus size={16} />
                        Crear Primera Rutina
                    </button>
                </div>
            ) : (
                <div className="routines-grid">
                    {filteredRoutines.map((routine) => (
                        <RoutineCard
                            key={routine.documentId}
                            routine={routine}
                            onView={setSelectedRoutine}
                            onDelete={(id, name) => setDeleteConfirm({ show: true, routineId: id, routineName: name })}
                            onExport={handleExport}
                        />
                    ))}
                </div>
            )}

            {/* View Modal */}
            <RoutineViewModal
                routine={selectedRoutine}
                onClose={() => setSelectedRoutine(null)}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <h3>Confirmar eliminación</h3>
                        <p>¿Estás seguro de que quieres eliminar la rutina "{deleteConfirm.routineName}"?</p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setDeleteConfirm({ show: false, routineId: '', routineName: '' })}
                            >
                                Cancelar
                            </button>
                            <button
                                className="confirm-delete-btn"
                                onClick={() => handleDelete(deleteConfirm.routineId)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientRoutines;