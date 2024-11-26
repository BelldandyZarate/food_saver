import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import NavbarAdmin from '../../components/navbaradmin';
import '../../styles/GestionUsuarios.css'; // Asegúrate de que los estilos estén disponibles

const GestionVendedores = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('role', '==', 'vendedor'));
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
            setFilteredUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleSearch = () => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setMessage(filtered.length === 0 ? 'Registro no existente.' : '');
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
        setSelectedUser(user);
    };

    const closeDetails = () => {
        setSelectedUser(null);
    };

    return (
        <div className="background-div">
            <NavbarAdmin />
            <center><h1 className="title-box">Gestión de Usuarios Vendedores</h1></center>
            {message && <p className="message">{message}</p>}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <div className="user-cards"> 
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <h3>{user.name}</h3>
                                <p>Email: {user.email}</p>
                                <p>Nombre del Local: {user.storeName}</p> {/* Añadido el nombre del local */}
                            </div>
                            <div className="button-group">
                                <button onClick={() => handleViewMore(user)}>Ver Más</button>
                                <button onClick={() => handleDelete(user.id)}>Eliminar Usuario</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron usuarios.</p>
                )}
            </div>


            {selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeDetails}>&times;</span>
                        <h2>Detalles de {selectedUser.name}</h2>
                        <p>Email: {selectedUser.email}</p>
                        <p>Teléfono Móvil: {selectedUser.mobile}</p>
                        <p>Teléfono del Local: {selectedUser.storePhone}</p>
                        <p>Nombre del Local: {selectedUser.storeName}</p>
                        <p>Dirección: {selectedUser.address}</p>
                        <p>Fecha de Nacimiento: {selectedUser.birthDate}</p>
                        <button onClick={closeDetails}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionVendedores;
