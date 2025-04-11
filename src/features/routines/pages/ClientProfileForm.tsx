import { useState, ChangeEvent, FormEvent } from 'react';
import {ClientData} from "../../../interfaces/ClientData.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

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
        <div style={{ display: 'flex', gap: '2rem', maxWidth: '1100px', margin: '2rem auto', padding: '1rem' }}>
            {/* Perfil lateral */}
            <div style={{
                width: '280px',
                padding: '1.5rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '1rem' }}>
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: '80px', color: '#ccc' }} />
                </div>
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>@NombreUsuario</h3>
                <p style={{ color: '#666' }}>cliente@email.com</p>
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ textAlign: 'left' }}>
                    <p><strong>Nombre:</strong> {formData.fullName || "—"}</p>
                    <p><strong>Edad:</strong> {formData.age || "—"}</p>
                    <p><strong>Sexo:</strong> {formData.gender || "—"}</p>
                    <p><strong>Peso:</strong> {formData.weight || "—"} kg</p>
                    <p><strong>Altura:</strong> {formData.height || "—"} cm</p>
                </div>
            </div>

            {/* Formulario */}
            <div style={{
                flex: 1,
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Datos del Cliente</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" name="fullName" placeholder="Nombre completo" value={formData.fullName} onChange={handleChange} required />
                    <input type="number" name="age" placeholder="Edad" value={formData.age} onChange={handleChange} required />

                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <input type="number" name="height" placeholder="Altura (cm)" value={formData.height} onChange={handleChange} />
                    <input type="number" name="weight" placeholder="Peso (kg)" value={formData.weight} onChange={handleChange} />
                    <input type="text" name="goal" placeholder="Objetivo (e.g. ganar masa)" value={formData.goal} onChange={handleChange} />
                    <input type="text" name="intolerances" placeholder="Intolerancias alimentarias" value={formData.intolerances} onChange={handleChange} />

                    <textarea
                        name="notes"
                        placeholder="Notas adicionales"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        style={{ gridColumn: '1 / -1' }}
                    />

                    <button
                        type="submit"
                        style={{
                            gridColumn: '1 / -1',
                            padding: '0.7rem',
                            backgroundColor: '#8a2be2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Guardar Perfil
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ClientProfileForm;