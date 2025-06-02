import {useState, ChangeEvent, FormEvent, useEffect, useRef, JSX} from 'react';
import {
    FaUser, FaEdit, FaSave, FaArrowLeft, FaCamera, FaWeight,
    FaRulerHorizontal, FaHeart, FaDumbbell, FaRuler, FaRunning,
    FaArrowUp, FaHistory, FaCalendarAlt
} from "react-icons/fa";
import "../../styles/ClientProfileForm.css";
import {useParams, useNavigate} from "react-router-dom";
import {doc, getDoc, Timestamp, updateDoc, collection, getDocs, query, orderBy} from "firebase/firestore";
import {db, storage } from "../../firebase/firebaseConfig.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {UserEntity, BodyStats} from "../../models/UserEntity.tsx";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Interface actualizada para coincidir con UserEntity
interface ClientFormData {
    firstName: string;
    lastName: string;
    email: string;
    birthYear: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
    photoURL: string;
}

const initialFormValues: ClientFormData = {
    firstName: '',
    lastName: '',
    email: '',
    birthYear: '',
    gender: '',
    photoURL: ''
};

function ClientProfileForm() {
    const { uid } = useParams<{ uid: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ClientFormData>(initialFormValues);
    const [photoFile, setPhotoFile] = useState<File|null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Estados para medidas corporales
    const [bodyStats, setBodyStats] = useState<BodyStats | null>(null);
    const [bodyStatsHistory, setBodyStatsHistory] = useState<BodyStats[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Calcular edad desde birthYear
    const calculateAge = (birthYear: string | number): number | null => {
        if (!birthYear) return null;
        const year = typeof birthYear === 'string' ? parseInt(birthYear) : birthYear;
        if (isNaN(year)) return null;
        return new Date().getFullYear() - year;
    };

    // Formatear género para mostrar
    const formatGender = (gender: string): string => {
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser || !uid) return;

        setSaving(true);
        setError(null);

        try {
            // CORRECCIÓN: Actualizar el documento en la colección principal
            // En lugar de: users/{currentUser.uid}/clients/{uid}
            // Usar: users/{uid} (colección principal)
            const docRef = doc(db, "users", uid);

            // Subir foto si hay una nueva
            let photoURL = formData.photoURL;
            if (photoFile) {
                // Actualizar el path de storage para ser consistente
                const path = `users/${uid}/photo.jpg`;
                const imgRef = storageRef(storage, path);
                await uploadBytes(imgRef, photoFile);
                photoURL = await getDownloadURL(imgRef);
            }

            // Preparar datos para actualizar
            const updateData: Partial<UserEntity> = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
                gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER' || undefined,
                photoURL: photoURL,
                updatedAt: Timestamp.now()
            };

            // Remover campos undefined
            Object.keys(updateData).forEach(key => {
                if (updateData[key as keyof UserEntity] === undefined) {
                    delete updateData[key as keyof UserEntity];
                }
            });

            await updateDoc(docRef, updateData);

            console.log('✅ Perfil actualizado exitosamente');

            // Actualizar el estado local
            setFormData(prev => ({ ...prev, photoURL }));
            setPhotoFile(null);
            setIsEditing(false);

        } catch (err) {
            console.error('❌ Error actualizando perfil:', err);
            setError('Error al guardar el perfil. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    // Función para renderizar una entrada de medidas
    const renderMeasurements = (stats: BodyStats, isHistorical: boolean = false) => (
        <div className={`measurement-entry ${isHistorical ? 'historical' : 'current'}`}>
            {isHistorical && (
                <div className="measurement-date">
                    <FaCalendarAlt />
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
                {stats.neck > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('neck')}
                        </div>
                        <span className="measurement-label">Cuello</span>
                        <span className="measurement-value">{stats.neck} cm</span>
                    </li>
                )}
                {stats.calf > 0 && (
                    <li>
                        <div className="measurement-icon">
                            {getMeasurementIcon('calf')}
                        </div>
                        <span className="measurement-label">Pantorrillas</span>
                        <span className="measurement-value">{stats.calf} cm</span>
                    </li>
                )}
            </ul>
        </div>
    );

    // Cargar datos del cliente y sus medidas corporales
    useEffect(() => {
        if (!uid || !currentUser) return;

        const loadClientData = async () => {
            try {
                setLoading(true);
                setError(null);

                // CORRECCIÓN: Cargar datos básicos del cliente desde la colección principal users
                // En lugar de: users/{currentUser.uid}/clients/{uid}
                // Usar: users/{uid} (colección principal)
                const clientRef = doc(db, "users", uid);
                const clientSnap = await getDoc(clientRef);

                if (!clientSnap.exists()) {
                    setError('Cliente no encontrado');
                    return;
                }

                const data = clientSnap.data() as UserEntity;

                // Verificar que el cliente esté vinculado al entrenador actual
                if (data.linkedTrainerUid !== currentUser.uid) {
                    setError('No tienes permisos para ver este cliente');
                    return;
                }

                // Mapear datos del UserEntity al formulario (esto ya estaba correcto)
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    birthYear: data.birthYear ? data.birthYear.toString() : '',
                    gender: data.gender || '',
                    photoURL: data.photoURL || ''
                });

                if (data.photoURL) {
                    setPhotoPreview(data.photoURL);
                }

                // Cargar medidas corporales del cliente (esto ya estaba correcto)
                try {
                    const bodyStatsRef = collection(db, "users", uid, "bodyStats");
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
                        setBodyStats(allBodyStats[0] || null);
                    } else {
                        setBodyStats(null);
                        setBodyStatsHistory([]);
                    }
                } catch (bodyStatsError) {
                    console.error('Error cargando bodyStats:', bodyStatsError);
                    setBodyStats(null);
                    setBodyStatsHistory([]);
                }

            } catch (err) {
                console.error('Error cargando datos del cliente:', err);
                setError('Error cargando los datos del cliente');
            } finally {
                setLoading(false);
            }
        };

        loadClientData();
    }, [uid, currentUser]);

    if (loading) {
        return (
            <div className="client-profile-board loading">
                <div className="loading-spinner">Cargando perfil del cliente...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="client-profile-board error">
                <div className="error-message">{error}</div>
                <button onClick={() => navigate(-1)} className="back-btn">
                    <FaArrowLeft />
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="client-profile-board">
            {/* Header con botones de acción */}
            <div className="profile-actions">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    type="button"
                >
                    <FaArrowLeft />
                    Volver
                </button>

                <div className="action-buttons">
                    {!isEditing ? (
                        <button
                            className="edit-button"
                            onClick={() => setIsEditing(true)}
                            type="button"
                        >
                            <FaEdit />
                            Editar Perfil
                        </button>
                    ) : (
                        <>
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setPhotoFile(null);
                                    setPhotoPreview(formData.photoURL);
                                }}
                                type="button"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                className="save-button"
                                onClick={handleSubmit}
                                type="button"
                                disabled={saving}
                            >
                                <FaSave />
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tarjeta del perfil */}
            <div className="profile-header">
                <div className="avatar" onClick={handlePhotoClick}>
                    {photoPreview ? (
                        <img src={photoPreview} alt={`${formData.firstName} avatar`}/>
                    ) : (
                        <FaUser className="avatar-icon"/>
                    )}
                    {isEditing && (
                        <div className="photo-overlay">
                            <FaCamera />
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{display: "none"}}
                        onChange={handlePhotoChange}
                    />
                </div>

                <div className="profile-info">
                    {isEditing ? (
                        <form className="edit-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Nombre"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="name-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Apellido"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="name-input"
                                    required
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="email-input"
                                required
                            />
                            <div className="form-row">
                                <input
                                    type="number"
                                    name="birthYear"
                                    placeholder="Año de nacimiento"
                                    min="1920"
                                    max={new Date().getFullYear()}
                                    value={formData.birthYear}
                                    onChange={handleChange}
                                    className="year-input"
                                />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="gender-select"
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="MALE">Masculino</option>
                                    <option value="FEMALE">Femenino</option>
                                    <option value="OTHER">Otro</option>
                                </select>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2>
                                {formData.firstName || formData.lastName
                                    ? `${formData.firstName} ${formData.lastName}`
                                    : 'Nombre no disponible'
                                }
                            </h2>
                            <div className="basic-stats">
                                <span>Edad: {calculateAge(formData.birthYear) || 'No especificada'}</span>
                                <span>Género: {formatGender(formData.gender)}</span>
                                <span>Email: {formData.email || 'No disponible'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

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
                        onClick={() => navigate('/clientstats')}
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
                        {bodyStats ? (
                            <>
                                <div className="last-update">
                                    Última actualización: {formatDate(bodyStats.measurementDate)}
                                </div>
                                {renderMeasurements(bodyStats)}
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

export default ClientProfileForm;