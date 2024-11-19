// src/authService.js

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Usuario autenticado:", userCredential.user);  // Asegúrate de que se muestre información del usuario
    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw error;
  }
};
