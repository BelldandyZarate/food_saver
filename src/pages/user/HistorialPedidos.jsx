import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarSeller from '../../components/navbarseller'; // Asegúrate de que la ruta sea correcta
import '../../styles/GestionarPedidosVendedor.css';

const GestionarPedidosVendedor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const pedidosRef = collection(db, 'pedidos');
          // Aquí filtramos los pedidos que tienen productos de este vendedor
          const pedidosQuery = query(pedidosRef, where('items.userId', '==', user.uid));
          const querySnapshot = await getDocs(pedidosQuery);
          
          const pedidosList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPedidos(pedidosList);
        }
      } catch (error) {
        console.error("Error fetching pedidos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [auth, db]);

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div>
      <NavbarSeller />
      <div className="gestionar-pedidos-container">
        <h2>Gestionar Pedidos</h2>
        {pedidos.length === 0 ? (
          <p>No hay pedidos para mostrar.</p>
        ) : (
          <ul className="pedidos-list">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="pedido-item">
                <h3>Pedido ID: {pedido.id}</h3>
                <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
                <ul className="productos-list">
                  {pedido.items.map((item, index) => (
                    <li key={index} className="producto-item">
                      {item.name} - ${item.price} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p><strong>Total:</strong> ${pedido.total}</p>
                <p><strong>Estado:</strong> {pedido.estado}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GestionarPedidosVendedor;
