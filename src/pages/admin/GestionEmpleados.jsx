import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import NavbarAdmin from '../../components/navbaradmin'; // Suponiendo que tienes un navbar para admin
import '../../styles/GestionUsuarios.css';

const GestionAdministradores = () => {
    const [administradores, setAdministradores] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [numeroEmpleado, setNumeroEmpleado] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAdministradores = async () => {
            const adminRef = collection(db, 'administradores');
            const querySnapshot = await getDocs(adminRef);
            const adminList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAdministradores(adminList);
        };

        fetchAdministradores();
    }, []);

    const handleAddAdministrador = async (e) => {
        e.preventDefault();
        try {
            const newAdmin = { nombreCompleto, numeroEmpleado, email, role: 'administrador' };
            await addDoc(collection(db, 'administradores'), newAdmin);
            setAdministradores([...administradores, newAdmin]);
            setMessage('Administrador registrado con éxito.');
            resetForm();
        } catch (error) {
            setMessage('Error al registrar el administrador: ' + error.message);
        }
    };

    const handleDeleteAdministrador = async (adminId) => {
        try {
            await deleteDoc(doc(db, 'administradores', adminId));
            setAdministradores(administradores.filter(admin => admin.id !== adminId));
            setMessage('Administrador eliminado con éxito.');
        } catch (error) {
            setMessage('Error al eliminar el administrador: ' + error.message);
        }
    };

    const resetForm = () => {
        setNombreCompleto('');
        setNumeroEmpleado('');
        setEmail('');
    };

    return (
        <div>
            <NavbarAdmin />
            <h1>Gestión de Administradores</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleAddAdministrador}>
                <input
                    type="text"
                    placeholder="Nombre Completo"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Número de Empleado"
                    value={numeroEmpleado}
                    onChange={(e) => setNumeroEmpleado(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Registrar Administrador</button>
            </form>
            <div className="admin-list">
                {administradores.map(admin => (
                    <div key={admin.id} className="admin-card">
                        <h3>{admin.nombreCompleto}</h3>
                        <p>Número de Empleado: {admin.numeroEmpleado}</p>
                        <p>Email: {admin.email}</p>
                        <button onClick={() => handleDeleteAdministrador(admin.id)}>Eliminar</button>
                    </div>
                ))}
                {administradores.length === 0 && <p>No se encontraron administradores.</p>}
            </div>
        </div>
    );
};

export default GestionAdministradores;
