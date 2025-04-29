import {UserProfile} from "../../../models/UserProfile.tsx";
import {useState} from "react";
import '../../../styles/UserProfile.css';



interface Props {
    user: UserProfile;
}


const UserProfileForm: React.FC<Props> = ({ user }) => {
    const [formData, setFormData] = useState({
        userName: user.userName || '',
        userLastName: user.userLastName || '',
        userEmail: user.userEmail || '',
        birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : '',  // 🔥 CORREGIDO aquí
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Perfil actualizado:', formData);
        // Aquí enviarías a Firebase/Firestore si quieres guardar
    };

    return (
        <>
            <h2>Complete your profile</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="userName"
                    placeholder="Nombre"
                    value={formData.userName}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="userLastName"
                    placeholder="Apellido"
                    value={formData.userLastName}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.userEmail}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="birthDate"
                    placeholder="Fecha nacimiento"
                    value={formData.birthDate}
                    onChange={handleChange}
                />
                <div className="role-buttons">
                    <button type="button" className="btn-role trainer">Entrenador</button>
                    <button type="button" className="btn-role athlete">Atleta</button>
                </div>
                <button type="submit">Save profile</button>
            </form>
        </>
    );
};

export default UserProfileForm;