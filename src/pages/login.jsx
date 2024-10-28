import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import '../styles/auth.css';
import NavbarInicio from '../components/navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reiniciar el mensaje de error

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRole = await getUserRole(user.uid); // Obtener el rol del usuario

            // Navegar según el rol
            switch (userRole) {
                case 'user':
                    navigate('/comprador');
                    break;
                case 'seller':
                    navigate('/vendedor');
                    break;
                case 'admin':
                    navigate('/administrador');
                    break;
                default:
                    alert('No se encontró un rol válido');
            }
        } catch (error) {
            setErrorMessage('Error al iniciar sesión: ' + error.message);
        }
    };

    const getUserRole = async (uid) => {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data().role; 
        }

        return null; 
    };

    return (
        <div>
            <NavbarInicio />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="form-group">
                            <label>Correo:</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="btn-primary">Iniciar Sesión</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                    <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
