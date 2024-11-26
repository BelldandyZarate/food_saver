import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import NavbarSeller from '../../components/NavbarSeller'; // Ajusta la ruta según tu estructura
import '../../styles/HistorialPedidos.css';

const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                // Referencia a la colección 'pedidos'
                const pedidosCollection = collection(db, 'pedidos');
                
                // Obtener todos los documentos de la colección
                const pedidosDocs = await getDocs(pedidosCollection);

                // Mapea los documentos a una lista de pedidos
                const pedidosList = pedidosDocs.docs.map(doc => ({
                    id: doc.id, // ID único del documento
                    ...doc.data() // Resto de la información del pedido
                }));

                setPedidos(pedidosList);
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
            setLoading(false);
        };

        fetchPedidos();
    }, []);

    const handleUpdateStatus = async (pedidoId, newStatus) => {
        try {
            const pedidoRef = doc(db, 'pedidos', pedidoId); // Referencia al documento en Firestore
            await updateDoc(pedidoRef, { status: newStatus });

            // Actualizar el estado local para reflejar el cambio
            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id === pedidoId ? { ...pedido, status: newStatus } : pedido
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
        }
    };

    if (loading) {
        return <p>Cargando historial de pedidos...</p>;
    }

    return (
        <div className="background-div">
            <NavbarSeller />
            <div className="historial-container">
                <center><h2 className="title-box">Historial de Pedidos</h2></center>
                {pedidos.length === 0 ? (
                    <p>No hay pedidos registrados.</p>
                ) : (
                    <div className="compras-list">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="compra-card-new">
                                <h3 className="pedido-item-title">Pedido #{pedido.id}</h3>
                                <p><strong>Status:</strong> {pedido.status}</p>
                                <p><strong>ID Cliente:</strong> {pedido.userId}</p>
                                <h4>Items:</h4>
                                <ul>
                                    {pedido.items && pedido.items.length > 0 ? (
                                        pedido.items.map((item, index) => (
                                            <li key={index}>{item.name} (Cantidad: {item.quantity})</li>
                                        ))
                                    ) : (
                                        <p>No hay productos en este pedido.</p>
                                    )}
                                </ul>
                                <div className="pedido-buttons-container">
                                    {pedido.status !== 'Finalizado' && (
                                        <>
                                            {pedido.status !== 'Recogido' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(pedido.id, 'Recogido')}
                                                    className="btn-pedido"
                                                >
                                                    Recoger en tienda
                                                </button>
                                            )}
                                            {pedido.status !== 'Empaquetado' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(pedido.id, 'Empaquetado')}
                                                    className="btn-pedido"
                                                >
                                                    Empaquetado enviado
                                                </button>
                                            )}
                                            {pedido.status !== 'Entregado' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(pedido.id, 'Entregado')}
                                                    className="btn-pedido"
                                                >
                                                    Entregado
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {pedido.status !== 'Finalizado' && (
                                        <button
                                            onClick={() => handleUpdateStatus(pedido.id, 'Finalizado')}
                                            className="btn-pedido-finalizado"
                                            disabled={pedido.status === 'Finalizado'}
                                        >
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

export default HistorialPedidos;
