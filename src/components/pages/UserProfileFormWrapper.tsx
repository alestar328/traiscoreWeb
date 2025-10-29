import {useRegistration} from "../../contexts/RegistrationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {UserEntity, UserRole} from "../../models/UserEntity.tsx";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig.tsx";
import {UserProfileForm} from "../Fragments/UserProfileForm.tsx";
import {RegClientFormData} from "../../models/UtilsInterfaces.tsx";
import {RegClientForm} from "../Fragments/RegClientForm.tsx";


type Step = "base" | "CLIENT";
export default function UserProfileFormWrapper( { onGoBack }: { onGoBack: () => void }  ) {


    const navigate = useNavigate();
    const { pendingUser } = useRegistration();
    const [step, setStep] = useState<Step>("base");

    const [formData, setFormData] = useState({
        userName:     pendingUser?.firstName || '',
        userLastName: pendingUser?.lastName || '',
        email:        pendingUser?.email || '',
        // Guardamos como string yyyy-mm-dd para el input date, si no, cadena vacía
        birthDate:    '',
        userRole:     (pendingUser?.userRole || 'CLIENT') as UserRole,
    });
    const [loading, setLoading] = useState(true);
    const [baseTouched, setBaseTouched] = useState(false);
    const [baseValid, setBaseValid]     = useState(false);
    const [clientData, setClientData] = useState<RegClientFormData>({
        gender: "",
        phone: "",
        address: "",
        measurements: {
            height: 0, weight: 0, neck: 0,
            chest: 0, arms: 0, waist: 0,
            thigh: 0, calf: 0,
        },
    });
    const [clientTouched, setClientTouched] = useState(false);
    const [clientValid, setClientValid]     = useState(false);

    useEffect(() => {
        if (!pendingUser) {
            navigate("/register");
            return;
        }
        setFormData({
            userName:     pendingUser.firstName    ?? "",
            userLastName: pendingUser.lastName     ?? "",
            email:        pendingUser.email        ?? "",
            // pendingUser tiene birthYear:number en el modelo; no hay fecha exacta
            birthDate:    pendingUser.birthYear
                ? `${pendingUser.birthYear}-01-01`
                : "",
            userRole:     (pendingUser.userRole    ?? "CLIENT") as UserRole,
        });
        setLoading(false);
    }, [pendingUser, navigate]);

    useEffect(() => {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { userName, userLastName, email, birthDate, userRole } = formData;
        setBaseValid(
            userName.trim() !== "" &&
            userLastName.trim() !== "" &&
            emailRx.test(email) &&
            birthDate.trim() !== "" &&
            (userRole === "CLIENT" || userRole === "TRAINER")
        );
    }, [formData]);

    useEffect(() => {
        const { gender, phone, address, measurements } = clientData;
        const allM = Object.values(measurements).every(v => v > 0);
        setClientValid(
            gender !== "" &&
            phone.trim() !== "" &&
            address.trim() !== "" &&
            allM
        );
    }, [clientData]);

    const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBaseTouched(true);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role: UserRole) => {
        setBaseTouched(true);
        setFormData({ ...formData, userRole: role });
    };
    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setClientTouched(true);
        const { name, value } = e.target;
        if (name.startsWith("measurements.")) {
            const key = name.split(".")[1] as keyof RegClientFormData["measurements"];
            setClientData({
                ...clientData,
                measurements: { ...clientData.measurements, [key]: Number(value) }
            });
        } else {
            setClientData({ ...clientData, [name]: value });
        }
    };
    const handleBaseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!baseValid || !baseTouched) return;

        // Confirm
        if (!window.confirm("¿Deseas terminar de registrarle?")) return;

        // Si es CLIENT, pasamos al siguiente paso
        if (formData.userRole === "CLIENT") {
            setStep("CLIENT");
        } else {
            // Si es TRAINER, guardamos y navegamos ya
            persistTrainer();
        }
    };
    const persistTrainer = async () => {
        if (!pendingUser?.uid) return;
        const profile: UserEntity = {
            ...pendingUser,
            uid: pendingUser.uid,
            email: formData.email,
            firstName: formData.userName,
            lastName:  formData.userLastName,
            userRole:  formData.userRole,
            birthYear: formData.birthDate ? Number(formData.birthDate.substring(0,4)) : undefined,
        };
        await setDoc(doc(db, "users", profile.uid), profile);
        navigate("/trainerdashboard");
    };
    const handleClientSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientValid || !clientTouched || !pendingUser?.uid) return;

        const profile = {
            ...pendingUser,
            uid: pendingUser.uid,
            email: formData.email,
            firstName: formData.userName,
            lastName:  formData.userLastName,
            birthYear: formData.birthDate ? Number(formData.birthDate.substring(0,4)) : undefined,
            userRole:  "CLIENT" as UserRole,
            gender:   clientData.gender ? clientData.gender.toUpperCase() as UserEntity['gender'] : undefined,
            measurements: clientData.measurements,
            phone:    clientData.phone,
            address:  clientData.address,
        };
        await setDoc(doc(db, "users", profile.uid), profile);
        navigate("/clientdashboard");
    };

    if (loading) {
        return <div>Cargando formulario...</div>;
    }

    return (
        <>
            {step === "base" && (
                <UserProfileForm
                    formData={formData}
                    isValid={baseValid}
                    formTouched={baseTouched}
                    onChange={handleBaseChange}
                    onRoleSelect={handleRoleSelect}
                    onSubmit={handleBaseSubmit}
                    onGoBack={onGoBack}
                />
            )}
            {step === "CLIENT" && (
                <RegClientForm
                    formData={clientData}
                    isValid={clientValid}
                    formTouched={clientTouched}
                    onChange={handleClientChange}
                    onSubmit={handleClientSubmit}
                    onGoBack={() => setStep("base")}
                />
            )}
        </>
    );
}