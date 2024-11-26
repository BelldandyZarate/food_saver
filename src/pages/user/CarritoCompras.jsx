import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../../components/navbaruser'; 
import '../../styles/CarritoCompras.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // Importar PayPal Buttons

const CarritoCompras = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false); // Estado para mostrar el formulario de pago
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        name: '',
    });
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

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteDoc(doc(db, 'compras', itemId));
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            alert('Producto eliminado del carrito.');
        } catch (error) {
            alert('Error al eliminar el producto: ' + error.message);
        }
    };

    const handleQuantityChange = async (itemId, change) => {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = cartItems[itemIndex];
        const productRef = doc(db, 'productos', item.productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
            const productData = productSnapshot.data();
            const maxStock = productData.stock;
            const newQuantity = item.quantity + change;

            if (newQuantity < 1) {
                handleDeleteItem(itemId);
                return;
            } else if (newQuantity > maxStock) {
                alert('No puedes añadir más de la cantidad disponible en stock.');
                return;
            }

            try {
                await updateDoc(doc(db, 'compras', itemId), { quantity: newQuantity });
                await updateDoc(productRef, { stock: maxStock - change });
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    )
                );
            } catch (error) {
                alert('Error al actualizar la cantidad: ' + error.message);
            }
        }
    };

    const handlePaymentInfoChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prevInfo => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handlePayment = async () => {
        if (!paymentInfo.cardNumber || !paymentInfo.expirationDate || !paymentInfo.cvv || !paymentInfo.name) {
            alert('Por favor, completa todos los campos de pago.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('Debes iniciar sesión primero.');
                return;
            }

            // Agrupar productos por storeId
            const groupedItems = cartItems.reduce((groups, item) => {
                if (!groups[item.storeId]) {
                    groups[item.storeId] = [];
                }
                groups[item.storeId].push(item);
                return groups;
            }, {});

            // Crear un pedido por cada tienda
            for (const storeId in groupedItems) {
                const itemsForStore = groupedItems[storeId];

                // Registrar la compra en la colección 'compras_realizadas'
                const purchaseCollection = collection(db, 'compras_realizadas');
                const purchaseDocRef = await addDoc(purchaseCollection, {
                    userId: user.uid,
                    items: itemsForStore,
                    total: itemsForStore.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    date: new Date(),
                    paymentInfo: paymentInfo.name, // Nombre del titular de la tarjeta
                    status: 'Pagado', // Estado de la compra
                });

                // Registrar el pedido en la colección 'pedidos'
                const orderCollection = collection(db, 'pedidos');
                const orderDocRef = await addDoc(orderCollection, {
                    purchaseId: purchaseDocRef.id,  // Referencia a la compra realizada
                    userId: user.uid,
                    storeId: storeId, // Usamos el storeId del grupo de productos
                    items: itemsForStore,
                    status: 'Pendiente',  // Estado inicial del pedido
                    date: new Date(),
                });

                // Registrar el idseller en el pedido (del producto)
                for (const item of itemsForStore) {
                    const productRef = doc(db, 'productos', item.productId);
                    const productSnapshot = await getDoc(productRef);
                    if (productSnapshot.exists()) {
                        const productData = productSnapshot.data();
                        const idseller = productData.sellerId; // Obtener el sellerId
                        await updateDoc(orderDocRef, { idseller }); // Guardar en el pedido
                    }

                    // Actualizar el stock de productos en la colección 'productos'
                    const productData = productSnapshot.data();
                    const newStock = productData.stock - item.quantity;
                    await updateDoc(productRef, { stock: newStock });
                }
            }

            // Eliminar los productos del carrito después del pago
            for (const item of cartItems) {
                await deleteDoc(doc(db, 'compras', item.id));
            }

            setCartItems([]);
            alert('Pago realizado con éxito.');
            setShowPaymentForm(false); // Cerrar el formulario después del pago
            navigate('/dashboard/comprador'); // Redirigir al comprador al panel
        } catch (error) {
            alert('Error al procesar el pago: ' + error.message);
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
                                <p><strong>Cantidad:</strong> {item.quantity}</p>
                                <p><strong>Total:</strong> ${item.price * item.quantity}</p>
                                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                <button onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                    <center>
                        <h2 className="title-box">Total a Pagar: ${totalAmount}</h2>
                        <div className="button-container">
                            <button className="pay-button" onClick={() => setShowPaymentForm(true)}>Pagar</button>
                        </div>
                    </center>

                    {/* PayPal Button Contenedor */}
                    <div className="paypal-container">
                        <PayPalScriptProvider options={{ "client-id": "AaWejlUGSgukS75AAxBqT7FNO6bYXB6mBeSNn8fMHQKK5pPoazqvl0LgQNGsMfhgTxM5x-o0-nBCXpNS" }}>
                            <PayPalButtons 
                                style={{ layout: 'vertical', height: 50, width: '100%' }}  // Estilo ajustado
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{
                                            amount: {
                                                value: totalAmount.toFixed(2)
                                            },
                                        }],
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        handlePaymentSuccess(details);
                                    });
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                </div>
            )}

            {showPaymentForm && (
                <div className="payment-modal">
                    <div className="payment-form">
                        <h3>Información de Pago</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre en la tarjeta"
                            value={paymentInfo.name}
                            onChange={handlePaymentInfoChange}
                        />
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="Número de tarjeta"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentInfoChange}
                        />
                        <input
                            type="text"
                            name="expirationDate"
                            placeholder="Fecha de expiración"
                            value={paymentInfo.expirationDate}
                            onChange={handlePaymentInfoChange}
                        />
                        <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentInfoChange}
                        />
                        <button onClick={handlePayment}>Realizar Pago</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarritoCompras;
