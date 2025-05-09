import { UserRole} from "../../models/UserProfile.tsx";


interface Props {
    formData: { userName: string; userLastName: string; email: string; birthDate: string; userRole: UserRole };
    isValid: boolean;
    formTouched: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRoleSelect: (r: UserRole) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoBack?: () => void;

}


export const UserProfileForm: React.FC<Props> = ({onGoBack, formData,
                                                     isValid, formTouched,
                                                     onChange, onRoleSelect,
                                                     onSubmit
}) => (
    <>
        <h2>Complete your profile</h2>
        {onGoBack && <button type="button" onClick={onGoBack}>Volver</button>} {/* Botón opcional */}

        <form onSubmit={onSubmit}>
            <input type="text" name="userName"
                   value={formData.userName}
                   onChange={onChange}
                   placeholder="Nombre"/>
            <input type="text" name="userLastName"
                   value={formData.userLastName}
                   onChange={onChange}
                   placeholder="Apellido"/>
            <input type="email" name="email"
                   value={formData.email}
                   onChange={onChange}
                   placeholder="Email"/>
            <input name="birthDate" type="date"
                   value={formData.birthDate}
                   onChange={onChange}/>
            <div className="role-buttons">
                <button
                    type="button"
                    className={`btn-role trainer ${formData.userRole === 'trainer' ? 'active' : ''}`}
                    onClick={() => onRoleSelect('trainer')}
                >
                    Entrenador
                </button>
                <button
                    type="button"
                    className={`btn-role athlete ${formData.userRole === 'client' ? 'active' : ''}`}
                    onClick={() => onRoleSelect('client')}
                >
                    Atleta
                </button>
            </div>
            <button type="submit"
                    disabled={!isValid || !formTouched}>{formTouched ? 'Registrar' : '...'}</button>
            {!isValid && formTouched && <p>Completa todos los campos correctamente</p>}
        </form>
    </>
);
