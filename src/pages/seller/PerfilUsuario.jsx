import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarSeller from '../../components/navbarseller';
import '../../styles/PerfilUsuario.css';

const PerfilUsuario = () => {
    const [userData, setUserData] = useState({
        name: '',
        birthDate: '',
        storeName: '',
        address: '',
        mobile: '',
        storePhone: '',
        email: '', // Campo para almacenar el correo
        role: ''   // Campo para almacenar el rol
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                // Cambia aquí a la colección 'users'
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    setMessage('No se encontraron datos de usuario.');
                }
            } else {
                setMessage('No hay usuario registrado.');
            }
            setLoading(false);
        };

        fetchUserData();
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            try {
                // Asegúrate de que los datos se actualicen en la colección correcta
                await updateDoc(doc(db, 'users', user.uid), userData);
                setMessage('Datos actualizados con éxito.');
                setIsEditing(false); // Cierra el modo de edición
            } catch (error) {
                setMessage('Error al actualizar los datos: ' + error.message);
            }
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <NavbarSeller />
            <h1>Perfil de Usuario</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleUpdate}>
                <label>
                    Correo Electrónico:
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        readOnly
                    />
                </label>
                <label>
                    Rol:
                    <input
                        type="text"
                        name="role"
                        value={userData.role}
                        readOnly
                    />
                </label>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <label>
                    Fecha de Nacimiento:
                    <input
                        type="date"
                        name="birthDate"
                        value={userData.birthDate}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <label>
                    Nombre del Local:
                    <input
                        type="text"
                        name="storeName"
                        value={userData.storeName}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <label>
                    Dirección:
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <label>
                    Teléfono Móvil:
                    <input
                        type="tel"
                        name="mobile"
                        value={userData.mobile}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <label>
                    Teléfono del Local:
                    <input
                        type="tel"
                        name="storePhone"
                        value={userData.storePhone}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <button type="button" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancelar' : 'Editar'}
                </button>
                {isEditing && <button type="submit">Actualizar Datos</button>}
            </form>
        </div>
    );
};

export default PerfilUsuario;
