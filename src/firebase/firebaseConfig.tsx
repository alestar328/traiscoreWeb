
import {initializeApp} from "firebase/app";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {UserProfile} from "../models/UserProfile.tsx";
import { getAuth , signInWithPopup, GoogleAuthProvider, UserCredential} from 'firebase/auth';
import {getAnalytics} from "firebase/analytics";



const firebaseConfig = {
    apiKey: "AIzaSyC7qqh_tY4nk2FZVpOa_3gQ8kF6Phh2qEQ",
    authDomain: "traiscore.firebaseapp.com",
    projectId: "traiscore",
    storageBucket: "traiscore.firebasestorage.app",
    messagingSenderId: "484079628970",
    appId: "1:484079628970:web:04911d7f2a445593add6d3",
    measurementId: "G-VBNGHDFH9M"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserProfile> => {
    const result: UserCredential = await signInWithPopup(auth, provider);
    const googleUser = result.user;

    const fullName = googleUser.displayName?.split(' ') || [];
    const userProfile: UserProfile = {
        uid: googleUser.uid,
        userName: fullName[0] || '',
        userLastName: fullName.slice(1).join(' ') || '',
        userEmail: googleUser.email || '',
        userPhotoURL: googleUser.photoURL || '',
        userRole: 'client', // Default: 'client'
        createdAt: new Date(),
    };

    const userDocRef = doc(db, 'users', userProfile.uid);
    const existingUser = await getDoc(userDocRef);

    if (!existingUser.exists()) {
        await setDoc(userDocRef, userProfile);
        console.log('✅ Usuario nuevo creado en Firestore');
    } else {
        console.log('🔁 Usuario ya existente');
    }

    return userProfile;
};