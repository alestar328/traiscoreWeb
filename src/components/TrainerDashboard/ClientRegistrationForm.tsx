import {useState} from "react";
import "../../styles/ClientRegistrationForm.css";
import {FaUserCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";



const ClientRegistrationForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        registrationReason: '',
        activityLevel: '',
        medicalHistory: '',
        goals: '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        // Aquí puedes agregar la lógica para enviar los datos a tu backend o base de datos
    };

    return (
        <div className="form-container">
            <div className="photo-placeholder">
                <FaUserCircle className="photo-icon"/>
                <p>Foto del cliente</p>
            </div>
            <h2>Formulario de Registro de Cliente</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-layout">
                    <div className="form-main">
                        <div className="form-group">
                            <label>Nombre completo:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
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


                        <div className="form-group">
                            <label>Nivel de actividad física:</label>
                            <select
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione</option>
                                <option value="beginner">Principiante</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Historial médico o lesiones previas:</label>
                            <textarea
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Objetivos del cliente:</label>
                            <textarea
                                name="goals"
                                value={formData.goals}
                                onChange={handleChange}
                                required
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
                                    value={formData.measurements.calf}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Peso (kg):</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.measurements.calf}
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