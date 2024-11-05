import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../../components/navbaruser'; 
import '../../styles/CarritoCompras.css'; 

const CarritoCompras = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentData, setPaymentData] = useState({ cardNumber: '', expirationDate: '', cvv: '' });
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            const user = auth.currentUser;
            if (user) {
                const cartCollection = collection(db, 'compras');
                const q = query(cartCollection, where('userId', '==', user.uid));
                const cartDocs = await getDocs(q);
                const cartList = cartDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCartItems(cartList);
            } else {
                alert('Por favor, inicia sesión para ver tu carrito.');
            }
            setLoading(false);
        };

        fetchCartItems();
    }, [auth]);

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            const orderData = {
                userId: user.uid,
                sellerId: user.uid || '', // Mover el ID del vendedor aquí
                items: cartItems.map(item => ({
                    id: item.id, // Este es el ID del producto
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total: totalAmount,
                paymentData: {
                    cardNumber: paymentData.cardNumber,
                    expirationDate: paymentData.expirationDate,
                    cvv: paymentData.cvv
                },
                createdAt: new Date().toISOString() // Mantener 'createdAt' al final
            };

            // Validar campos
            if (!orderData.userId || !orderData.total || !orderData.items.length ||
                !orderData.paymentData.cardNumber || !orderData.paymentData.expirationDate || !orderData.paymentData.cvv) {
                alert('Error: datos de pedido incompletos. Por favor, verifica los datos.');
                return;
            }

            try {
                await addDoc(collection(db, 'pedidos'), orderData);
                alert('Pago exitoso. Estamos procesando tu pedido.');

                // Limpiar el carrito en la base de datos
                const deletePromises = cartItems.map(async item => {
                    await deleteDoc(doc(db, 'compras', item.id));
                    await updateStock(item.id, item.quantity); // Devolver el stock según la cantidad comprada
                });
                await Promise.all(deletePromises);

                setCartItems([]); // Limpiar el carrito localmente
                setShowPaymentForm(false);
                setPaymentSuccess(true);
            } catch (error) {
                alert('Error al realizar el pedido: ' + error.message);
            }
        }
    };

    const handleNewPurchase = () => {
        setPaymentData({ cardNumber: '', expirationDate: '', cvv: '' });
        setPaymentSuccess(false);
        navigate('/dashboard/comprador');
    };

    const updateStock = async (itemId, change) => {
        const itemRef = doc(db, 'productos', itemId);
        const itemSnapshot = await getDoc(itemRef);
        if (itemSnapshot.exists()) {
            const itemData = itemSnapshot.data();
            const newStock = itemData.stock + change; // Ajustar stock
            await updateDoc(itemRef, { stock: newStock });
        }
    };

    const handleDeleteItem = async (itemId) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const itemDocRef = doc(db, 'compras', itemId);
                const itemSnapshot = await getDoc(itemDocRef);
                
                if (itemSnapshot.exists()) {
                    const itemData = itemSnapshot.data();

                    await deleteDoc(itemDocRef);
                    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
                    await updateStock(itemData.id, itemData.quantity); // Sumar al stock al eliminar
                    alert('Producto eliminado del carrito.');
                } else {
                    alert('El producto no existe en el carrito.');
                }
            } catch (error) {
                alert('Error al eliminar el producto: ' + error.message);
            }
        }
    };

    const handleQuantityChange = async (itemId, change) => {
        const user = auth.currentUser;
        const item = cartItems.find(i => i.id === itemId);

        if (user && item) {
            const itemRef = doc(db, 'productos', item.id);
            const itemSnapshot = await getDoc(itemRef);

            if (itemSnapshot.exists()) {
                const itemData = itemSnapshot.data();
                const newQuantity = item.quantity + change;

                if (change < 0) { // Decrementar
                    if (newQuantity < 1) {
                        await handleDeleteItem(itemId);
                    } else {
                        await updateDoc(doc(db, 'compras', itemId), { quantity: newQuantity });
                        setCartItems(prevItems => prevItems.map(i => (i.id === itemId ? { ...i, quantity: newQuantity } : i)));
                        await updateStock(item.id, 1); // Aumentar stock
                        alert('Cantidad actualizada.');
                    }
                } else { // Incrementar
                    if (newQuantity > itemData.stock) {
                        alert('No hay suficiente stock disponible.');
                        return;
                    }

                    await updateDoc(doc(db, 'compras', itemId), { quantity: newQuantity });
                    setCartItems(prevItems => prevItems.map(i => (i.id === itemId ? { ...i, quantity: newQuantity } : i)));
                    await updateStock(item.id, -1); // Restar del stock
                    alert('Cantidad actualizada.');
                }
            }
        }
    };

    if (loading) {
        return <p>Cargando carrito...</p>;
    }

    return (
        <div className="background-div">
            <NavbarUser />
            <center><h1 className="title-box">Carrito de Compras</h1></center>
            {cartItems.length === 0 ? (
                <p>No hay productos en tu carrito.</p>
            ) : (
                <div>
                    <ul className="cart-list">
                        {cartItems.map(item => (
                            <li key={item.id} className="cart-item">
                                <h3>{item.name}</h3>
                                <p><strong>Precio:</strong> ${item.price}</p>
                                <p><strong>Cantidad:</strong>
                                    <button onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                                    <span>{item.quantity}</span> {/* Mostrar la cantidad actual aquí */}
                                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                </p>
                                <p><strong>Total:</strong> ${item.price * item.quantity}</p>
                                <button onClick={() => handleDeleteItem(item.id)}>Borrar</button>
                                {item.stock <= 0 && <p style={{ color: 'red' }}>No hay disponibilidad</p>}
                            </li>
                        ))}
                    </ul>
                    <center><h2 className="title-box">Total a Pagar: ${totalAmount}</h2></center>
                    <center><button onClick={() => setShowPaymentForm(true)}>Pagar</button></center>

                    {showPaymentForm && (
                        <div className="modal">
                            <div className="modal-content">
                                <form onSubmit={handlePaymentSubmit}>
                                    <h3>Formulario de Pago</h3>
                                    <label>
                                        Número de Tarjeta:
                                        <input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} required />
                                    </label>
                                    <label>
                                        Fecha de Expiración:
                                        <input type="text" name="expirationDate" value={paymentData.expirationDate} onChange={handlePaymentChange} placeholder="MM/AA" required />
                                    </label>
                                    <label>
                                        CVV:
                                        <input type="text" name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} required />
                                    </label>
                                    <div className="button-container">
                                        <button type="submit" className="primary-button">Hacer Pedido</button>
                                        <button onClick={() => setShowPaymentForm(false)} className="close-button">Cerrar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {paymentSuccess && (
                        <div>
                            <p>¿Quieres hacer otra compra?</p>
                            <button onClick={handleNewPurchase}>Volver al Dashboard</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CarritoCompras;
