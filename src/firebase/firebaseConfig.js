// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHjO7NeaxQ6yg5wPt-VppLy2jYXIh__Vw",
  authDomain: "food-saver1.firebaseapp.com",
  projectId: "food-saver1",
  storageBucket: "food-saver1.appspot.com",
  messagingSenderId: "906352666374",
  appId: "1:906352666374:web:56653853ab8fe400206087"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializar Firestore
const db = getFirestore(app);

export { db }; // Asegúrate de que esta línea esté presente