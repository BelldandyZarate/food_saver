import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Para autenticación
import { getFirestore } from "firebase/firestore"; // Para Firestore

const firebaseConfig = {
    apiKey: "AIzaSyCyHEebOgZwBAxwgQHAd4cyXnuAOvKaTwY",
    authDomain: "foodsaverapp-6b8a1.firebaseapp.com",
    projectId: "foodsaverapp-6b8a1",
    storageBucket: "foodsaverapp-6b8a1.appspot.com",
    messagingSenderId: "845189476967",
    appId: "1:845189476967:web:8e34fbc9cb660d9aaf1ac2",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
