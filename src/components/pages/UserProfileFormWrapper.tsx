import {useRegistration} from "../../contexts/RegistrationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {UserProfile, UserRole} from "../../models/UserProfile.tsx";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase/firebaseConfig.tsx";
import {UserProfileForm} from "../Fragments/UserProfileForm.tsx";
import {RegClientFormData} from "../../models/UtilsInterfaces.tsx";
import {RegClientForm} from "../Fragments/RegClientForm.tsx";


type Step = "base" | "client";
export default function UserProfileFormWrapper() {
    const navigate = useNavigate();
    const { pendingUser } = useRegistration();
    const [step, setStep] = useState<Step>("base");

    const [formData, setFormData] = useState({
        userName:    pendingUser?.userName || '',
        userLastName: pendingUser?.userLastName || '',
        email:       pendingUser?.email || '',
        birthDate:   pendingUser?.birthDate?.toISOString().split('T')[0] ?? '',
        userRole:    pendingUser?.userRole || 'client' as UserRole,
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
            userName:     pendingUser.userName    ?? "",
            userLastName: pendingUser.userLastName?? "",
            email:        pendingUser.email       ?? "",
            birthDate:    pendingUser.birthDate
                ? pendingUser.birthDate.toISOString().split("T")[0]
                : "",
            userRole:     pendingUser.userRole    ?? "client",
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
            (userRole === "client" || userRole === "trainer")
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
        if (formData.userRole === "client") {
            setStep("client");
        } else {
            // Si es TRAINER, guardamos y navegamos ya
            persistTrainer();
        }
    };
    const persistTrainer = async () => {
        if (!pendingUser?.uid) return;
        const profile: UserProfile = {
            ...pendingUser,
            uid: pendingUser.uid,
            email: formData.email,
            userName: formData.userName,
            userLastName: formData.userLastName,
            userRole: formData.userRole,
            birthDate: new Date(formData.birthDate),
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
            userName: formData.userName,
            userLastName: formData.userLastName,
            birthDate: new Date(formData.birthDate),
            userRole: "client" as UserRole,
            gender:   clientData.gender,
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
                />
            )}
            {step === "client" && (
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