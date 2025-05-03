import {ChangeEvent, useRef, useState} from "react";
import "../../styles/ClientRegistrationForm.css";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {db, storage } from "../../firebase/firebaseConfig.tsx";
import {addDoc, collection, updateDoc, serverTimestamp, doc} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";



const ClientRegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({

        userName: '',
        userLastName: '',
        birthDate: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        registrationDate: new Date().toISOString().split('T')[0],
        measurements: {
            height:'',
            weight:'',
            neck: '',
            chest: '',
            arms: '',
            waist: '',
            thigh: '',
            calf: '',
        },
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name in formData.measurements) {
            setFormData((prevData) => ({
                ...prevData,
                measurements: {
                    ...prevData.measurements,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Debes estar logueado como entrenador para crear un cliente.");
            return;
        }

        try {
            // 1) Referencia a la sub‐colección `clients` de este trainer
            const clientsRef = collection(
                db,
                "users",
                currentUser.uid,
                "clients"
            );

            // 2) Añadimos el doc con linkedTrainerUid y timestamp
            const docRef = await addDoc(clientsRef, {
                ...formData,
                registrationDate: new Date(formData.registrationDate),
                measurements: {
                    height: Number(formData.measurements.height),
                    weight: Number(formData.measurements.weight),
                    neck:   Number(formData.measurements.neck),
                    chest:  Number(formData.measurements.chest),
                    arms:   Number(formData.measurements.arms),
                    waist:  Number(formData.measurements.waist),
                    thigh:  Number(formData.measurements.thigh),
                    calf:   Number(formData.measurements.calf)
                },
                linkedTrainerUid: currentUser.uid,
                createdAt: serverTimestamp()
            });
            if (photoFile) {
                const path = `users/${currentUser.uid}/clients/${docRef.id}/photo.jpg`;
                const imgRef = storageRef(storage, path);
                await uploadBytes(imgRef, photoFile);
                const url = await getDownloadURL(imgRef);
                await updateDoc(doc(db, "users", currentUser.uid, "clients", docRef.id), { userPhotoURL: url });
            }
            alert("Cliente registrado con éxito.");
            navigate("/trainerdashboard");
        } catch (err) {
            console.error("Error al crear cliente:", err);
            alert("No se pudo crear el cliente. Intenta de nuevo.");
        }
    };


    return (
        <div className="form-container">
            <div
                className="photo-placeholder"
                onMouseEnter={() => {/* podrías cambiar estado para tooltip */
                }}
                onClick={handlePhotoClick}
                style={{position: "relative", cursor: "pointer"}}
            >
                {photoPreview
                    ? <img src={photoPreview} alt="Foto cliente" className="photo-preview"/>
                    : <FontAwesomeIcon icon={faUserCircle} className="photo-icon"/>}
                <span className="tooltip">Añadir foto</span>

                {/* input file oculto */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{display: "none"}}
                    onChange={handlePhotoChange}
                />
            </div>
            <h2>Formulario de Registro de Cliente</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-layout">
                    <div className="form-main">
                        <div className="form-group">
                            <label>Nombres:</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos:</label>
                            <input
                                type="text"
                                name="userLastName"
                                value={formData.userLastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de nacimiento:</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de alta:</label>
                            <input
                                type="date"
                                name="registrationDate"
                                value={formData.registrationDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Género:</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Correo electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono de contacto:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección (opcional):</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>


                    </div>

                    <div className="form-measurements">
                        <fieldset className="measurements-section">
                            <legend>Medidas</legend>
                            <div className="form-group">
                                <label>Altura (cm):</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.measurements.height}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Peso (kg):</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.measurements.weight}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cuello (cm):</label>
                                <input
                                    type="number"
                                    name="neck"
                                    value={formData.measurements.neck}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Pectoral (cm):</label>
                                <input
                                    type="number"
                                    name="chest"
                                    value={formData.measurements.chest}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Brazos (cm):</label>
                                <input
                                    type="number"
                                    name="arms"
                                    value={formData.measurements.arms}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cintura (cm):</label>
                                <input
                                    type="number"
                                    name="waist"
                                    value={formData.measurements.waist}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Muslo (cm):</label>
                                <input
                                    type="number"
                                    name="thigh"
                                    value={formData.measurements.thigh}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Pantorrilla (cm):</label>
                                <input
                                    type="number"
                                    name="calf"
                                    value={formData.measurements.calf}
                                    onChange={handleChange}
                                />
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn cancel" onClick={() => {
                        navigate('/trainerdashboard');
                    }}>

                        Cancelar
                    </button>
                    <button type="submit" className="btn send">Enviar a cliente</button>
                    <button type="submit" className="btn save">Guardar</button>
                </div>
            </form>
        </div>
    );
};


export default ClientRegistrationForm;