import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Dashboard from '../../components/Dashboard';
import NavbarUser from '../../components/navbaruser'; // Asegúrate de que la ruta sea correcta
import '../../styles/CompradorDashboard.css'; // Asegúrate de tener este archivo para estilos

const CompradorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showQuantityDialog, setShowQuantityDialog] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'productos');
            const productDocs = await getDocs(productsCollection);
            const productList = productDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productList);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setShowQuantityDialog(true);
    };

    const handleConfirmPurchase = async () => {
        if (selectedProduct && quantity > 0) {
            const user = auth.currentUser;
            if (user) {
                try {
                    // Registrar la compra en la colección "compras"
                    await addDoc(collection(db, 'compras'), {
                        productId: selectedProduct.id,
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        quantity: quantity,
                        userId: user.uid,
                        createdAt: new Date()
                    });

                    // Actualizar el stock en la colección "productos"
                    const productRef = doc(db, 'productos', selectedProduct.id);
                    await updateDoc(productRef, {
                        stock: selectedProduct.stock - quantity
                    });

                    alert('Producto agregado al carrito!');
                } catch (error) {
                    console.error('Error al agregar al carrito:', error);
                }
            } else {
                alert('Por favor, inicia sesión para agregar productos al carrito.');
            }
        }
        setShowQuantityDialog(false);
        setQuantity(1); // Reiniciar la cantidad
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    return (
        <div>
            <NavbarUser />
            <Dashboard title="Dashboard Comprador">
                <p>Bienvenido al panel de comprador.</p>
                <button className="btn-primary">Ver Productos</button>
                <button className="btn-primary">Mis Pedidos</button>
                
                <h2>Productos Disponibles</h2>
                <div className="product-list">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p><strong>Marca:</strong> {product.brand}</p>
                            <p><strong>Categoría:</strong> {product.category}</p>
                            <p><strong>Fecha de Expiración:</strong> {product.expiryDate}</p>
                            <p><strong>Precio:</strong> ${product.price}</p>
                            <p><strong>Stock:</strong> {product.stock}</p>
                            <button className="btn-primary" onClick={() => handleAddToCart(product)}>
                                Agregar al carrito
                            </button>
                        </div>
                    ))}
                </div>

                {showQuantityDialog && (
                    <div className="quantity-dialog">
                        <h4>Cantidad a adquirir</h4>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleConfirmPurchase}>
                            Confirmar Compra
                        </button>
                        <button className="btn-secondary" onClick={() => setShowQuantityDialog(false)}>
                            Cancelar
                        </button>
                    </div>
                )}
            </Dashboard>
        </div>
    );
};

export default CompradorDashboard;
