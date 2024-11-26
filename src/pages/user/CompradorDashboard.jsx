import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import NavbarUser from '../../components/navbaruser'; 
import '../../styles/CompradorDashboard.css'; 

// Importar imágenes
import verProductosIcon from '../../assets/ver-productos-icon.png';
import misPedidosIcon from '../../assets/mis-pedidos-icon.png';

const CompradorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showQuantityDialog, setShowQuantityDialog] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    // Cargar productos desde Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'productos');
            const productDocs = await getDocs(productsCollection);
            const productList = productDocs.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(product => {
                    // Filtrar los productos que no están caducados
                    const expiryDate = new Date(product.expiryDate);
                    const today = new Date();

                    // Solo mostrar productos cuya fecha de caducidad sea posterior al día de hoy
                    return expiryDate > today;
                });

            setProducts(productList);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Función para agregar un producto al carrito
    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setShowQuantityDialog(true);
    };

    // Función para confirmar la compra
    const handleConfirmPurchase = async () => {
        if (selectedProduct && quantity > 0) {
            const user = auth.currentUser;
            if (user) {
                try {
                    // Agregar la compra al carrito (colección de compras)
                    await addDoc(collection(db, 'compras'), {
                        productId: selectedProduct.id,
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        quantity: quantity,
                        userId: user.uid,
                        createdAt: new Date()
                    });

                    // Actualizar el stock del producto en Firestore
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
        setShowQuantityDialog(false); // Cerrar el diálogo de cantidad
        setQuantity(1); // Restablecer la cantidad
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    return (
        <div className="background-div">
            <NavbarUser />
            <Dashboard title="Dashboard Comprador">
                <div className="dashboard-content">
                    <div className="title-box"><center>Bienvenido al panel de comprador.</center></div>
                    <div className="btn-container">
                        <button className="btn-standard" onClick={() => navigate('/dashboard/comprador')}>
                            <img src={verProductosIcon} alt="Ver Productos" className="icon-inside-button" />
                            Ver Productos
                        </button>
                        <button className="btn-standard" onClick={() => navigate('/user/historial-pedidos')}>
                        <img src={misPedidosIcon} alt="Mis Pedidos" className="icon-inside-button" />
                            Mis Pedidos
                        </button>
                    </div>
                </div>
                
                <div>
                    <center><h2 className="title-box">Productos Disponibles</h2></center>
                </div>
                <div className="product-list">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            {/* Mostrar la imagen del producto si está disponible */}
                            {product.imagePreview ? (
                                <center><img src={product.imagePreview} alt={product.name} className="product-image" /></center>
                            ) : (
                                <p>No disponible</p>
                            )}
                            <h3>{product.name}</h3>
                            <p><strong>Marca:</strong> {product.brand}</p>
                            <p><strong>Categoría:</strong> {product.category}</p>
                            <p><strong>Fecha de Expiración:</strong> {product.expiryDate}</p>
                            <p><strong>Precio:</strong> ${product.price}</p>
                            <p><strong>Stock:</strong> {product.stock}</p>
                            
                            {product.stock > 0 ? (
                                <button className="btn-primaryC" onClick={() => handleAddToCart(product)}>
                                    Agregar al carrito
                                </button>
                            ) : (
                                <p style={{ color: 'red', fontWeight: 'bold' }}>No disponible</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Dialogo para seleccionar la cantidad */}
                {showQuantityDialog && (
                    <div className="quantity-dialog">
                        <h4>Cantidad a adquirir</h4>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <button className="btn-primary0" onClick={handleConfirmPurchase}>
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
