import ClientCard from "../ClientCard.tsx";
import '../../styles/MyClientsView.css';
import {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {collection, getDocs, Timestamp, QueryDocumentSnapshot, DocumentData, deleteDoc, doc} from "@firebase/firestore";
import {db} from "../../firebase/firebaseConfig.tsx";
import {ClientFirestoreData, ClientProfile} from "../../models/UserProfile.tsx";

export default function MyClientsView() {

    const { currentUser } = useAuth();
    const [clients, setClients] = useState<ClientProfile[]>([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchClients = async () => {
            const clientsRef = collection(db, 'users', currentUser.uid, 'clients');
            const snapshot = await getDocs(clientsRef);

            const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
                // Forzamos el tipo de data a nuestro interface
                const data = doc.data() as ClientFirestoreData;

                // Convertir birthDate
                let birth: Date | undefined;
                if (data.birthDate) {
                    if (data.birthDate instanceof Timestamp) {
                        birth = data.birthDate.toDate();
                    } else if (typeof data.birthDate === 'string' || typeof data.birthDate === 'number') {
                        birth = new Date(data.birthDate);
                    } else {
                        birth = data.birthDate as Date;
                    }
                }

                // Convertir registrationDate
                let registration: Date;
                if (data.registrationDate instanceof Timestamp) {
                    registration = data.registrationDate.toDate();
                } else if (typeof data.registrationDate === 'string' || typeof data.registrationDate === 'number') {
                    registration = new Date(data.registrationDate);
                } else {
                    registration = data.registrationDate as Date;
                }

                return {
                    uid: doc.id,
                    userName: data.userName,
                    userLastName: data.userLastName,
                    email: data.email,
                    birthDate: birth,
                    registrationDate: registration,
                    gender: data.gender,
                    userPhotoURL: data.userPhotoURL,
                    measurements: data.measurements,
                    linkedTrainerUid: data.linkedTrainerUid,
                    createdAt:
                        data.createdAt instanceof Timestamp
                            ? data.createdAt.toDate()
                            : (data.createdAt as Date | undefined),
                    userRole: 'client'
                } as ClientProfile;
            });

            setClients(list);
        };

        fetchClients();
    }, [currentUser]);
    const handleDelete = async (uid: string) => {
        if (!currentUser) return;
        const ok = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
        if (!ok) return;

        const clientDoc = doc(db, "users", currentUser.uid, "clients", uid);
        await deleteDoc(clientDoc);

        setClients((prev) => prev.filter((c) => c.uid !== uid));
    };
    return (
        <div  className="myclients-wrapper">
            <h1 className="text-3xl font-bold text-center mb-8">Mis clientes</h1>

            <div className="ClientsContainer">
                {clients.map(c => (
                    <ClientCard
                        key={c.uid}
                        uid={c.uid}
                        userName={c.userName}
                        userLastName={c.userLastName}
                        birthDate={c.birthDate!}
                        gender={c.gender}
                        userPhotoURL={c.userPhotoURL}
                        userRole={c.userRole}
                        email={c.email!}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

        </div>
    );
}
