import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC7qqh_tY4nk2FZVpOa_3gQ8kF6Phh2qEQ",
    authDomain: "traiscore.firebaseapp.com",
    projectId: "traiscore",
    storageBucket: "traiscore.firebasestorage.app",
    messagingSenderId: "484079628970",
    appId: "1:484079628970:web:04911d7f2a445593add6d3",
    measurementId: "G-VBNGHDFH9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

