import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Cambia useHistory por useNavigate
import NavbarUser from '../../components/navbaruser'; 
import '../../styles/CarritoCompras.css'; 

const CarritoCompras = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: ''
    });
    const [message, setMessage] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate(); // Cambia useHistory por useNavigate

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
                items: cartItems.map(item => ({
                    ...item,
                    sellerId: item.sellerId // Asegúrate que `sellerId` esté presente en cada item
                })),
                total: totalAmount,
                paymentData: paymentData,
                createdAt: new Date().toISOString()
            };

            try {
                await addDoc(collection(db, 'pedidos'), orderData);
                setMessage('Pago exitoso. Estamos procesando tu pedido.');
                setCartItems([]); // Limpiar el carrito después de realizar el pedido
                setShowPaymentForm(false); // Cerrar el formulario de pago
                setPaymentSuccess(true); // Cambiar estado a pago exitoso
            } catch (error) {
                setMessage('Error al realizar el pedido: ' + error.message);
            }
        }
    };

    const handleNewPurchase = () => {
        setCartItems([]); // Limpiar los artículos del carrito
        setMessage(''); // Limpiar el mensaje
        setPaymentData({ cardNumber: '', expirationDate: '', cvv: '' }); // Reiniciar datos de pago
        setPaymentSuccess(false); // Reiniciar el estado para una nueva compra
        navigate('/dashboard/comprador'); // Redirigir al dashboard del comprador
    };

    if (loading) {
        return <p>Cargando carrito...</p>;
    }

    return (
        <div>
            <NavbarUser />
            <h1>Carrito de Compras</h1>
            {message && <p>{message}</p>}
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
                            </li>
                        ))}
                    </ul>
                    <h2>Total a Pagar: ${totalAmount}</h2>
                    <button onClick={() => setShowPaymentForm(true)}>Pagar</button>
                    {showPaymentForm && (
                        <form onSubmit={handlePaymentSubmit}>
                            <h3>Formulario de Pago</h3>
                            <label>
                                Número de Tarjeta:
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={paymentData.cardNumber}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </label>
                            <label>
                                Fecha de Expiración:
                                <input
                                    type="text"
                                    name="expirationDate"
                                    value={paymentData.expirationDate}
                                    onChange={handlePaymentChange}
                                    placeholder="MM/AA"
                                    required
                                />
                            </label>
                            <label>
                                CVV:
                                <input
                                    type="text"
                                    name="cvv"
                                    value={paymentData.cvv}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </label>
                            <button type="submit">Hacer Pedido</button>
                        </form>
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
