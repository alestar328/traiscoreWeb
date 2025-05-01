
import {createContext, useContext, useEffect, useState} from "react";
import {getAuth, onAuthStateChanged } from "firebase/auth";
import {UserProfile} from "../models/UserProfile.tsx";
import {getFirestore, doc, getDoc,} from "firebase/firestore";


interface AuthContextType {
    currentUser: UserProfile  | null;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile  | null>(null);


    useEffect(() => {
        const db = getFirestore();
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const profileData = userSnapshot.data() as UserProfile;
                    setCurrentUser(profileData);
                } else {
                    setCurrentUser(null); // el documento no existe en Firestore
                }
            } else {
                setCurrentUser(null); // no autenticado
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};