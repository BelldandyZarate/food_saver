import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarSeller from '../../components/navbarseller';
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
          // Cambiamos la consulta para filtrar por vendedorId
          const pedidosRef = collection(db, 'pedidos');
          const pedidosQuery = query(pedidosRef, where('vendedorId', '==', user.uid));
          const querySnapshot = await getDocs(pedidosQuery);

          const pedidosList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              createdAt: data.createdAt,
              items: data.items,
              total: data.total,
              estado: data.estado,
              compradorNombre: data.compradorNombre, // Asumiendo que el nombre del comprador se almacena en los pedidos
            };
          });
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

  const updateEstado = async (pedidoId, nuevoEstado) => {
    try {
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, { estado: nuevoEstado });
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );
    } catch (error) {
      console.error("Error updating pedido estado: ", error);
    }
  };

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
                <p><strong>Comprador:</strong> {pedido.compradorNombre}</p>
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
                <div className="estado-buttons">
                  <button
                    onClick={() => updateEstado(pedido.id, 'Empaquetado')}
                    className="btn-estado empaquetado"
                  >
                    Empaquetado
                  </button>
                  <button
                    onClick={() => updateEstado(pedido.id, 'Enviado')}
                    className="btn-estado enviado"
                  >
                    Enviado
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GestionarPedidosVendedor;
