// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjNaEC5c_3tfNsT7mdCe_j1uUxqBUS1wg",
  authDomain: "food-2304d.firebaseapp.com",
  projectId: "food-2304d",
  storageBucket: "food-2304d.firebasestorage.app",
  messagingSenderId: "244100587391",
  appId: "1:244100587391:web:8d906ee75c7eada75a444a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializar Firestore
const db = getFirestore(app);

export { db }; // Asegúrate de que esta línea esté presente