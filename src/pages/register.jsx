import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig'; 
import { setDoc, doc } from 'firebase/firestore';
import '../styles/auth.css';
import NavbarInicio from '../components/navbar';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // Rol por defecto como "user"
    const navigate = useNavigate();
    const auth = getAuth();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Crear usuario con email y contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar el rol del usuario en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email,
                role,
            });

            alert('Registro exitoso');
            navigate('/login'); // Redirigir a la página de inicio de sesión
        } catch (error) {
            alert('Error en el registro: ' + error.message);
        }
    };

    return (
        <div>
            <NavbarInicio />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Registrar Cuenta</h2>
                    <form onSubmit={handleRegister} className="auth-form">
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
                        <div className="form-group">
                            <label>Confirmar Contraseña:</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
                                <option value="user">Comprador</option>
                                <option value="seller">Vendedor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary">Registrarse</button>
                    </form>
                    <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
