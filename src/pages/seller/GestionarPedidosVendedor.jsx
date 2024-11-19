import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarUser from '../../components/navbarseller'; 
import '../../styles/HistorialPedidos.css';

const HistorialPedidosVendedor = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const fetchPedidos = async () => {
            const user = auth.currentUser;
            if (user) {
                const pedidosCollection = collection(db, 'compras_realizadas');
                const q = query(pedidosCollection, where('userId', '==', user.uid));
                const pedidosDocs = await getDocs(q);
                const pedidosList = pedidosDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPedidos(pedidosList);
            } else {
                alert('Por favor, inicia sesión como vendedor para ver tu historial de pedidos.');
            }
            setLoading(false);
        };

        fetchPedidos();
    }, [auth]);

    const handleUpdateStatus = async (pedidoId, newStatus) => {
        const pedidoRef = doc(db, 'compras_realizadas', pedidoId);
        await updateDoc(pedidoRef, { status: newStatus });
        setPedidos(prevPedidos => 
            prevPedidos.map(pedido =>
                pedido.id === pedidoId ? { ...pedido, status: newStatus } : pedido
            )
        );
    };

    if (loading) {
        return <p>Cargando historial de pedidos...</p>;
    }

    return (
        <div className="background-div">
            <NavbarUser />
            <div className="historial-container">
                <h2 className="title-box">Historial de Pedidos</h2>
                {pedidos.length === 0 ? (
                    <p>No tienes pedidos registrados.</p>
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
                                <p><strong>Status:</strong> {pedido.status}</p>
                                <div className="botones-container">
                                    {pedido.status !== 'Finalizado' && (
                                        <>
                                            {pedido.status !== 'Recogido' && (
                                                <button onClick={() => handleUpdateStatus(pedido.id, 'Recogido')}>
                                                    Recoger en tienda
                                                </button>
                                            )}
                                            {pedido.status !== 'Empaquetado Enviado' && (
                                                <button onClick={() => handleUpdateStatus(pedido.id, 'Empaquetado Enviado')}>
                                                    Empaquetado enviado
                                                </button>
                                            )}
                                            {pedido.status !== 'Entregado' && (
                                                <button onClick={() => handleUpdateStatus(pedido.id, 'Entregado')}>
                                                    Entregado
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {pedido.status !== 'Finalizado' && (
                                        <button onClick={() => handleUpdateStatus(pedido.id, 'Finalizado')} disabled={pedido.status === 'Finalizado'}>
                                            Finalizado
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialPedidosVendedor;
