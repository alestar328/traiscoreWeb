import {UserProfile, UserRole} from "../../../models/UserProfile.tsx";
import {useEffect, useState} from "react";
import '../../../styles/UserProfile.css';
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../firebase/firebaseConfig.tsx";



interface Props {
    user: UserProfile;
}


const UserProfileForm: React.FC<Props> = ({ user }) => {
    const [isValid, setIsValid] = useState(false);
    const [formTouched, setFormTouched] = useState(false);

    const [formData, setFormData] = useState({
        userName: user.userName || '',
        userLastName: user.userLastName || '',
        userEmail: user.userEmail || '',
        birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : '',
        userRole: user.userRole || 'client',
    });
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { userName, userLastName, userEmail, birthDate, userRole } = formData;

        const valid =
            userName.trim() !== "" &&
            userLastName.trim() !== "" &&
            emailRegex.test(userEmail) &&
            birthDate.trim() !== "" &&
            (userRole === "client" || userRole === "trainer");

        setIsValid(valid);
    }, [formData]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormTouched(true);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleRoleSelect = (role: UserRole) => {
        setFormTouched(true);
        setFormData({ ...formData, userRole: role });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const profileToSave: UserProfile = {
            uid: user.uid,
            userEmail: formData.userEmail,
            userName: formData.userName,
            userLastName: formData.userLastName,
            userPhotoURL: user.userPhotoURL || '',
            birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
            userRole: formData.userRole,
            createdAt: user.createdAt || new Date(),
        };

        try {
            await setDoc(doc(db, "users", profileToSave.uid), profileToSave);
            console.log("✅ Perfil actualizado en Firestore:", profileToSave);
            alert("✅ ¡Guardado con éxito!");
        } catch (error) {
            console.error("❌ Error al guardar el perfil:", error);
            alert("❌ Hubo un error al guardar el perfil.");
        }
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
                    <button
                        type="button"
                        className={`btn-role trainer ${formData.userRole === 'trainer' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('trainer')}
                    >
                        Entrenador
                    </button>
                    <button
                        type="button"
                        className={`btn-role athlete ${formData.userRole === 'client' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('client')}
                    >
                        Atleta
                    </button>
                </div>
                <button
                    type="submit"
                    className={!isValid || !formTouched ? "btn-disabled" : "btn-submit"}
                    disabled={!isValid || !formTouched}
                >
                    Save profile
                </button>

                {!isValid && formTouched && (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                        Completa todos los campos correctamente
                    </p>
                )}
            </form>
        </>
    );
};

export default UserProfileForm;