import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import NavbarAdmin from '../../components/navbaradmin'; // Suponiendo que tienes un navbar para admin
import '../../styles/GestionUsuarios.css';

const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('role', '==', 'comprador'));
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
            setFilteredUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleSearch = async () => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filtered.length === 0) {
            setMessage('Registro no existente.');
        } else {
            setMessage('');
        }

        setFilteredUsers(filtered);
    };

    const handleDelete = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
            setMessage('Usuario eliminado con éxito.');
            setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            setMessage('Error al eliminar el usuario: ' + error.message);
        }
    };

    const handleViewMore = (user) => {
        setSelectedUser(user); // Establecer el usuario seleccionado
    };

    const closeDetails = () => {
        setSelectedUser(null); // Cerrar el detalle del usuario
    };

    return (
        <div>
            <NavbarAdmin />
            <h1>Gestión de Usuarios Compradores</h1>
            {message && <p>{message}</p>}
            <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            <div className="user-cards">
                {filteredUsers.map(user => (
                    <div key={user.id} className="user-card">
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <button onClick={() => handleViewMore(user)}>Ver Más</button>
                        <button onClick={() => handleDelete(user.id)}>Eliminar Usuario</button>
                    </div>
                ))}
                {filteredUsers.length === 0 && <p>No se encontraron usuarios.</p>}
            </div>

            {/* Detalles del usuario seleccionado */}
            {selectedUser && (
                <div className="user-details">
                    <h2>Detalles de {selectedUser.name}</h2>
                    <p>Email: {selectedUser.email}</p>
                    <p>Teléfono Móvil: {selectedUser.mobile}</p>
                    <p>Teléfono del Local: {selectedUser.storePhone}</p>
                    <p>Nombre del Local: {selectedUser.storeName}</p>
                    <p>Dirección: {selectedUser.address}</p>
                    <p>Fecha de Nacimiento: {selectedUser.birthDate}</p>
                    <button onClick={closeDetails}>Cerrar</button>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;
