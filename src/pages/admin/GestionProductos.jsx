import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import NavbarAdmin from '../../components/navbaradmin'; // Suponiendo que tienes un navbar para admin
import '../../styles/GestionUsuarios.css';

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [selectedProducto, setSelectedProducto] = useState(null); // Estado para el producto seleccionado

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

        if (filtered.length === 0) {
            setMessage('Registro no existente.');
        } else {
            setMessage('');
        }

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
        setSelectedProducto(producto); // Establecer el producto seleccionado
    };

    const closeDetails = () => {
        setSelectedProducto(null); // Cerrar el detalle del producto
    };

    return (
        <div>
            <NavbarAdmin />
            <h1>Gestión de Productos</h1>
            {message && <p>{message}</p>}
            <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            <div className="producto-cards">
                {filteredProductos.map(producto => (
                    <div key={producto.id} className="producto-card">
                        <h3>{producto.name}</h3>
                        <p>Caducidad: {producto.expiryDate}</p>
                        <p>Creado por: {producto.createdBy}</p>
                        <button onClick={() => handleViewMore(producto)}>Ver Más</button>
                        <button onClick={() => handleDelete(producto.id)}>Eliminar Producto</button>
                    </div>
                ))}
                {filteredProductos.length === 0 && <p>No se encontraron productos.</p>}
            </div>

            {/* Detalles del producto seleccionado */}
            {selectedProducto && (
                <div className="producto-details">
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
            )}
        </div>
    );
};

export default GestionProductos;
