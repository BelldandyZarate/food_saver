// GestionarProductos.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import NavbarSeller from '../../components/navbarseller';
import '../../styles/GestionarProductos.css';

const GestionarProductos = () => {
    const [productos, setProductos] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'productos'), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProductos(productsData);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'productos', id));
            alert('Producto eliminado con éxito.');
        } catch (error) {
            alert('Error al eliminar el producto: ' + error.message);
        }
    };

    const handleEdit = (producto) => {
        setEditingProduct(producto.id);
        setFormData(producto);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { id, ...updatedData } = formData;

        try {
            await updateDoc(doc(db, 'productos', id), updatedData);
            alert('Producto actualizado con éxito.');
            setEditingProduct(null); // Cerrar el modal
            setFormData({}); // Limpiar el formulario
        } catch (error) {
            alert('Error al actualizar el producto: ' + error.message);
        }
    };

    return (
        <div className="background-div">
            <NavbarSeller />
            <br></br>
            <center><h1 className="welcome-box">Gestionar Productos</h1></center>
            <div className="product-cards">
                {productos.map(producto => (
                    <div key={producto.id} className="product-card">
                        <h2>{producto.name}</h2>
                        <p>Marca: {producto.brand}</p>
                        <p>Categoría: {producto.category}</p>
                        <p>Precio: ${producto.price}</p>
                        <p>Stock: {producto.stock}</p>
                        <p>Fecha de Caducación: {producto.expiryDate}</p>
                        <button onClick={() => handleEdit(producto)}>Editar</button>
                        <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
                    </div>
                ))}
            </div>

            {editingProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Producto</h2>
                        <form onSubmit={handleUpdate}>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Marca:
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Categoría:
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Precio:
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Stock:
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Fecha de Caducación:
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <button type="submit">Actualizar Producto</button>
                            <button type="button" onClick={() => setEditingProduct(null)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionarProductos;
