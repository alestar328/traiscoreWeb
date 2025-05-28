import {useState, ChangeEvent, FormEvent, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faUser} from "@fortawesome/free-solid-svg-icons";
import "../../styles/ClientProfileForm.css";
import {useParams} from "react-router-dom";
import {doc, getDoc, Timestamp, updateDoc} from "firebase/firestore";
import {db, storage } from "../../firebase/firebaseConfig.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {calculateAge} from "../../utils/UsefullFunctions.tsx";
import {UserEntity} from "../../models/UserEntity.tsx";
import {ClientData, initialClientFormValues} from "../../utils/initialValues.tsx";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

function ClientProfileForm() {
    const { uid } = useParams<{ uid: string }>();
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ClientData>(initialClientFormValues);
    const [photoFile, setPhotoFile] = useState<File|null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };
    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        const docRef = doc(db, "users", currentUser.uid, "clients", uid!);

        console.log('✅ Perfil guardado:', formData);
        const updateData: Partial<UserEntity> = {
            firstName: formData.userName,
            lastName: formData.userLastName,
            email: formData.email ,

            birthDate: new Date(formData.birthDate),
            measurements: {
                height: Number(formData.height),
                weight: Number(formData.weight),
                neck:   Number(formData.neck),
                chest:  Number(formData.chest),
                arms:   Number(formData.arms),
                waist:  Number(formData.waist),
                thigh:  Number(formData.thigh),
                calf:   Number(formData.calf),
            }

        };
        await updateDoc(docRef, updateData);
        const preparedData = {
            ...formData,
            age: Number(formData.age),
            height: Number(formData.height),
            weight: Number(formData.weight),
            neck: Number(formData.neck),
            chest: Number(formData.chest),
            arms: Number(formData.arms),
            waist: Number(formData.waist),
            thigh: Number(formData.thigh),
            calf: Number(formData.calf),
        };

        if (photoFile) {
            const path = `users/${currentUser.uid}/clients/${uid}/photo.jpg`;
            const imgRef = storageRef(storage, path);
            await uploadBytes(imgRef, photoFile);
            const url = await getDownloadURL(imgRef);
            await updateDoc(docRef, { userPhotoURL: url });
            setFormData(prev => ({ ...prev, userPhotoURL: url }));
        }

        console.log('✅ Perfil guardado (números):', preparedData);
        // Enviar preparedData a backend
    };
    useEffect(() => {
        if (!uid || !currentUser) return;
        (async () => {
            const ref = doc(db, "users", currentUser.uid, "clients", uid);
            const snap = await getDoc(ref);
            if (!snap.exists()) return;
            const data = snap.data() as UserEntity;

            const birthStr = data.birthDate? (
                    data.birthDate instanceof Timestamp? data.birthDate.toDate(): new Date(data.birthDate)).toISOString().split("T")[0] : '';

            setFormData(prev => ({
                ...prev,
                userPhotoURL: data.userPhotoURL ?? "",
                userName:       data.firstName || "",
                userLastName:   data.lastName || "",
                birthDate:     birthStr,
                email: data.email || "",
                age: data.birthDate
                    ? String(calculateAge(
                        data.birthDate instanceof Timestamp
                            ? data.birthDate.toDate()
                            : new Date(data.birthDate)
                    ))
                    : "",
                gender:         data.gender || "",
                height:         data.measurements?.height  ? String(data.measurements.height) : "",
                weight:         data.measurements?.weight  ? String(data.measurements.weight) : "",
                neck:           data.measurements?.neck    ? String(data.measurements.neck) : "",
                chest:          data.measurements?.chest   ? String(data.measurements.chest) : "",
                arms:           data.measurements?.arms    ? String(data.measurements.arms) : "",
                waist:          data.measurements?.waist   ? String(data.measurements.waist) : "",
                thigh:          data.measurements?.thigh   ? String(data.measurements.thigh) : "",
                calf:           data.measurements?.calf    ? String(data.measurements.calf) : "",

            }));
            if (data.userPhotoURL) {
                setPhotoPreview(data.userPhotoURL);
            }
        })();
    }, [uid, currentUser]);
    return (
        <div className="client-profile-page">
            <div className="client-profile-wrapper">
                <div className="profile-sidebar">


                    <div className="photo-container" onClick={handlePhotoClick}>
                        {photoPreview
                            ? <img src={photoPreview} alt="Foto cliente" className="profile-avatar-img"/>
                            : <FontAwesomeIcon icon={faUser} className="profile-avatar"/>
                        }
                        <div className="photo-overlay">
                            <FontAwesomeIcon icon={faCamera}/>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{display: "none"}}
                            onChange={handlePhotoChange}
                        />
                    </div>
                    <h3> {formData.userName || "—"}</h3>
                    <p> {formData.email || "—"}</p>
                    <hr/>
                    <div className="profile-info">
                        <p><strong>Nombre:</strong> {formData.userName || "—"}</p>
                        <p><strong>Apellido:</strong> {formData.userLastName || "—"}</p>
                        <p><strong>Edad:</strong> {formData.age || "—"}</p>
                        <p><strong>Sexo:</strong> {formData.gender || "—"}</p>
                        <p><strong>Peso:</strong> {formData.weight || "—"} kg</p>
                        <p><strong>Altura:</strong> {formData.height || "—"} cm</p>
                        <p><strong>Cuello:</strong> {formData.neck || "—"} cm</p>
                        <p><strong>Pectoral:</strong> {formData.chest || "—"} cm</p>
                        <p><strong>Brazos:</strong> {formData.arms || "—"} cm</p>
                        <p><strong>Cintura:</strong> {formData.waist || "—"} cm</p>
                        <p><strong>Muslo:</strong> {formData.thigh || "—"} cm</p>
                        <p><strong>Pantorrilla:</strong> {formData.calf || "—"} cm</p>
                    </div>
                </div>

                <div className="client-form">
                    <h2>Datos del Cliente</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Nombre"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="userLastName"
                            placeholder="Apellido"
                            value={formData.userLastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Edad"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Género</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                            <option value="other">Otro</option>
                        </select>

                        <div className="measurements-inputs">
                            <input
                                type="number"
                                name="height"
                                placeholder="Altura (cm)"
                                value={formData.height}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="weight"
                                placeholder="Peso (kg)"
                                value={formData.weight}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="neck"
                                placeholder="Cuello (cm)"
                                value={formData.neck}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="chest"
                                placeholder="Pectoral (cm)"
                                value={formData.chest}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="arms"
                                placeholder="Brazos (cm)"
                                value={formData.arms}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="waist"
                                placeholder="Cintura (cm)"
                                value={formData.waist}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="thigh"
                                placeholder="Muslo (cm)"
                                value={formData.thigh}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="calf"
                                placeholder="Pantorrilla (cm)"
                                value={formData.calf}
                                onChange={handleChange}
                            />
                        </div>



                        <button type="submit">Guardar Perfil</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClientProfileForm;