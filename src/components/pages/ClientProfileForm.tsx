import { useState, ChangeEvent, FormEvent } from 'react';
import {ClientData} from "../../interfaces/ClientData.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import "../../styles/ClientProfileForm.css";

function ClientProfileForm() {
    const [formData, setFormData] = useState<ClientData>({
        fullName: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: '',
        notes: '',
        intolerances: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('✅ Perfil guardado:', formData);
        // Aquí puedes enviar los datos a tu backend o Firebase
        const preparedData = {
            ...formData,
            age: Number(formData.age),
            height: Number(formData.height),
            weight: Number(formData.weight),
        };

        console.log('✅ Perfil guardado:', preparedData);
        // Aquí puedes enviar a Firebase o backend

    };

    return (
        <div className="client-profile-page">
            <div className="client-profile-wrapper">
                <div className="profile-sidebar">
                    <FontAwesomeIcon icon={faUser} className="profile-avatar"/>
                    <h3>@NombreUsuario</h3>
                    <p>cliente@email.com</p>
                    <hr/>
                    <div className="profile-info">
                        <p><strong>Nombre:</strong> {formData.fullName || "—"}</p>
                        <p><strong>Edad:</strong> {formData.age || "—"}</p>
                        <p><strong>Sexo:</strong> {formData.gender || "—"}</p>
                        <p><strong>Peso:</strong> {formData.weight || "—"} kg</p>
                        <p><strong>Altura:</strong> {formData.height || "—"} cm</p>
                    </div>
                </div>

                <div className="client-form">
                    <h2>Datos del Cliente</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="fullName" placeholder="Nombre completo" value={formData.fullName}
                               onChange={handleChange} required/>
                        <input type="number" name="age" placeholder="Edad" value={formData.age} onChange={handleChange}
                               required/>

                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>

                        <input type="number" name="height" placeholder="Altura (cm)" value={formData.height}
                               onChange={handleChange}/>
                        <input type="number" name="weight" placeholder="Peso (kg)" value={formData.weight}
                               onChange={handleChange}/>
                        <input type="text" name="goal" placeholder="Objetivo (e.g. ganar masa)" value={formData.goal}
                               onChange={handleChange}/>
                        <input type="text" name="intolerances" placeholder="Intolerancias alimentarias"
                               value={formData.intolerances} onChange={handleChange}/>

                        <textarea
                            name="notes"
                            placeholder="Notas adicionales"
                            rows={3}
                            value={formData.notes}
                            onChange={handleChange}
                        />
                        <button type="submit">Guardar Perfil</button>
                    </form>
                </div>
            </div>
        </div>
            );
            }

            export default ClientProfileForm;