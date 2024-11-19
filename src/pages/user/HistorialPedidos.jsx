import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarUser from '../../components/navbaruser'; 
import '../../styles/HistorialPedidos.css';

const HistorialCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const fetchCompras = async () => {
            const user = auth.currentUser;
            if (user) {
                const comprasCollection = collection(db, 'compras_realizadas');
                const q = query(comprasCollection, where('userId', '==', user.uid));
                const comprasDocs = await getDocs(q);
                const comprasList = comprasDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCompras(comprasList);
            } else {
                alert('Por favor, inicia sesión para ver tu historial de compras.');
            }
            setLoading(false);
        };

        fetchCompras();
    }, [auth]);

    if (loading) {
        return <p>Cargando historial de compras...</p>;
    }

    return (
        <div className="background-div">
            <NavbarUser />
            <div className="historial-container">
                <h2 className="title-box">Historial de Compras</h2>
                {compras.length === 0 ? (
                    <p>No hay compras registradas.</p>
                ) : (
                    <div className="compras-list">
                        {compras.map(compra => (
                            <div key={compra.id} className="compra-item">
                                <h3>Compra #{compra.id}</h3>
                                <p><strong>Total:</strong> ${compra.total}</p>
                                <p><strong>Fecha:</strong> {new Date(compra.createdAt).toLocaleString()}</p>
                                <h4>Items:</h4>
                                <ul>
                                    {compra.items.map(item => (
                                        <li key={item.id}>{item.name} (Cantidad: {item.quantity})</li>
                                    ))}
                                </ul>
                                <p><strong>Status:</strong> {compra.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialCompras;
