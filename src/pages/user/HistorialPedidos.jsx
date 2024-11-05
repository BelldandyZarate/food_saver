import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarUser from '../../components/navbaruser'; 
import '../../styles/HistorialPedidos.css'; 

const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const fetchPedidos = async () => {
            const user = auth.currentUser;
            if (user) {
                const pedidosCollection = collection(db, 'pedidos');
                const q = query(pedidosCollection, where('userId', '==', user.uid));
                const pedidosDocs = await getDocs(q);
                const pedidosList = pedidosDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPedidos(pedidosList);
            } else {
                alert('Por favor, inicia sesión para ver tu historial de pedidos.');
            }
            setLoading(false);
        };

        fetchPedidos();
    }, [auth]);

    if (loading) {
        return <p>Cargando historial de pedidos...</p>;
    }

    return (
        <div className="background-div">
            <NavbarUser />
            <div className="historial-container">
                <h2 className="title-box">Historial de Pedidos</h2>
                {pedidos.length === 0 ? (
                    <p>No hay pedidos registrados.</p>
                ) : (
                    <div className="pedidos-list">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="pedido-item">
                                <h3>Pedido #{pedido.id}</h3>
                                <p><strong>Total:</strong> ${pedido.total}</p>
                                <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleString()}</p>
                                <h4>Items:</h4>
                                <ul>
                                    {pedido.items.map(item => (
                                        <li key={item.id}>{item.name} (Cantidad: {item.quantity})</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialPedidos;
