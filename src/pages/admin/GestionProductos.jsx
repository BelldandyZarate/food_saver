import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import NavbarAdmin from '../../components/navbaradmin';
import '../../styles/GestionUsuarios.css'; // Asegúrate de que los estilos estén disponibles

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [selectedProducto, setSelectedProducto] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            const productosRef = collection(db, 'productos');
            const querySnapshot = await getDocs(productosRef);
            const productosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(productosList);
            setFilteredProductos(productosList);
        };

        fetchProductos();
    }, []);

    const handleSearch = () => {
        const filtered = productos.filter(producto =>
            producto.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setMessage(filtered.length === 0 ? 'Registro no existente.' : '');
        setFilteredProductos(filtered);
    };

    const handleDelete = async (productoId) => {
        try {
            await deleteDoc(doc(db, 'productos', productoId));
            setMessage('Producto eliminado con éxito.');
            setFilteredProductos(filteredProductos.filter(producto => producto.id !== productoId));
            setProductos(productos.filter(producto => producto.id !== productoId));
        } catch (error) {
            setMessage('Error al eliminar el producto: ' + error.message);
        }
    };

    const handleViewMore = (producto) => {
        setSelectedProducto(producto);
    };

    const closeDetails = () => {
        setSelectedProducto(null);
    };

    const isExpired = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return expiry < today;
    };

    return (
        <div className="background-div">
            <NavbarAdmin />
            <center><h1 className="title-box">Gestión de Productos</h1></center>
            {message && <p className="message">{message}</p>}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <div className="producto-cards">
                {filteredProductos.length > 0 ? (
                    filteredProductos.map(producto => (
                        <div key={producto.id} className={`user-card ${isExpired(producto.expiryDate) ? 'expired' : ''}`}>
                            <div className="user-info">
                                <h3>{producto.name}</h3>
                                <p>Caducidad: {producto.expiryDate}</p>
                                <p>Creado por: {producto.createdBy}</p>
                            </div>
                            <div className="button-group">
                                <button onClick={() => handleViewMore(producto)}>Ver Más</button>
                                <button onClick={() => handleDelete(producto.id)}>Eliminar Producto</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>

            {/* Detalles del producto seleccionado */}
            {selectedProducto && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeDetails}>&times;</span>
                        <h2>Detalles de {selectedProducto.name}</h2>
                        <p><strong>Marca:</strong> {selectedProducto.brand}</p>
                        <p><strong>Categoría:</strong> {selectedProducto.category}</p>
                        <p><strong>Creado el:</strong> {new Date(selectedProducto.createdAt.seconds * 1000).toLocaleString()}</p>
                        <p><strong>Creado por:</strong> {selectedProducto.createdBy}</p>
                        <p><strong>Caducidad:</strong> {selectedProducto.expiryDate}</p>
                        <p><strong>Precio:</strong> {selectedProducto.price}</p>
                        <p><strong>Stock:</strong> {selectedProducto.stock}</p>
                        <button onClick={closeDetails}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionProductos;
