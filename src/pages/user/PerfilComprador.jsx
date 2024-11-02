import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarUser from '../../components/navbaruser'; // Asegúrate de que la ruta sea correcta
import '../../styles/PerfilUsuario.css';

const PerfilComprador = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        homePhone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid)); // Cambia a 'buyers' si es necesario
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
                await updateDoc(doc(db, 'users', user.uid), userData); // Asegúrate de que esté en la colección correcta
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
            <NavbarUser />
            <h1>Perfil de Comprador</h1>
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
                    Nombre:
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                    />
                </label>
                <label>
                    Apellido:
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
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
                    Teléfono de Casa:
                    <input
                        type="tel"
                        name="homePhone"
                        value={userData.homePhone}
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
                <button type="button" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancelar' : 'Editar'}
                </button>
                {isEditing && <button type="submit">Actualizar Datos</button>}
            </form>
        </div>
    );
};

export default PerfilComprador;
