import {UserProfile} from "../models/UserProfile.tsx";
import {createContext, ReactNode, useContext, useState} from "react";
import {getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseUser} from "firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore";


interface RegistrationContextType {
    pendingUser: Partial<UserProfile> | null;
    registerWithGoogle: () => Promise<boolean>;
    clearPendingUser: () => void;
}

const RegistrationContext = createContext<RegistrationContextType>({
    pendingUser: null,
    registerWithGoogle: async () => false,
    clearPendingUser: () => {},
});

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pendingUser, setPendingUser] = useState<Partial<UserProfile> | null>(null);

    const registerWithGoogle = async (): Promise<boolean> => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const fbUser: FirebaseUser = result.user;
            if (!fbUser.email) throw new Error("Sin email en el perfil de Google");

            // Comprueba en Firestore si ya existe
            const db = getFirestore();
            const userRef = doc(db, "users", fbUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                alert("Ya hay una cuenta registrada con este email");
                return false;
            }

            // Divide displayName en nombre y apellido(s)
            const [firstName, ...lastParts] = fbUser.displayName?.split(" ") ?? ["", ""];
            const lastName = lastParts.join(" ");

            setPendingUser({
                uid: fbUser.uid,
                email: fbUser.email,
                userName: firstName,
                userLastName: lastName,
                userPhotoURL: fbUser.photoURL ?? undefined,
                userRole: "CLIENT",
                createdAt: new Date(),
            });

            return true;
        } catch (err) {
            console.error("Error en registro con Google:", err);
            return false;
        }
    };

    const clearPendingUser = () => setPendingUser(null);

    return (
        <RegistrationContext.Provider value={{ pendingUser, registerWithGoogle, clearPendingUser }}>
            {children}
        </RegistrationContext.Provider>
    );
};
