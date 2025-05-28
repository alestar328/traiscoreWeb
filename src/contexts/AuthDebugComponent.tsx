import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {useAuth} from "./AuthContext.tsx";

const AuthDebugComponent: React.FC = () => {
    const { currentUser, firebaseUser, state: authState } = useAuth();
    const [firebaseAuthState, setFirebaseAuthState] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth();
        console.log('🔍 Firebase Auth Debug:', {
            currentUser: auth.currentUser,
            isSignedIn: !!auth.currentUser,
            email: auth.currentUser?.email,
            uid: auth.currentUser?.uid
        });
        setFirebaseAuthState(auth.currentUser);
    }, []);

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f0f0f0',
            margin: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px'
        }}>
            <h3>🔍 Debug de Autenticación</h3>

            <div style={{ marginBottom: '15px' }}>
                <strong>AuthContext State:</strong>
                <pre>{JSON.stringify({
                    currentUser: currentUser ? {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        userRole: currentUser.userRole
                    } : null,
                    firebaseUser: firebaseUser ? {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email
                    } : null,
                    loading: authState.loading,
                    error: authState.error
                }, null, 2)}</pre>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Direct Firebase Auth:</strong>
                <pre>{JSON.stringify(firebaseAuthState ? {
                    uid: firebaseAuthState.uid,
                    email: firebaseAuthState.email,
                    displayName: firebaseAuthState.displayName
                } : null, null, 2)}</pre>
            </div>

            <div>
                <strong>URL Parameters:</strong>
                <pre>{JSON.stringify({
                    currentURL: window.location.href,
                    pathname: window.location.pathname,
                    search: window.location.search
                }, null, 2)}</pre>
            </div>
        </div>
    );
};

export default AuthDebugComponent;