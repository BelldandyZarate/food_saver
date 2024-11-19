import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import NavbarSeller from '../../components/NavbarSeller'; // Asegúrate de que la ruta sea correcta
import '../../styles/AdminDashboard.css'; // Asegúrate de importar tu archivo CSS
import productIcon from '../../assets/ver-productos-icon.png'; // Asegúrate de tener la ruta correcta
import salesIcon from '../../assets/venta.png'; // Asegúrate de tener la ruta correcta

const VendedorDashboard = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="background-div">
            <NavbarSeller />
            <Dashboard title="Dashboard Vendedor">
                <div className="welcome-container">
                    <p className="welcome-box">Bienvenido al panel de vendedor.</p>
                </div>
                <div className="button-container">
                    <button className="btn-primary" onClick={() => handleNavigate('/seller/gestionar-productos')}>
                        <div className="button-content">
                            <img src={productIcon} alt="Gestionar Productos" className="button-icon" />
                            <span>Gestionar Productos</span>
                        </div>
                    </button>
                    <button className="btn-primary" onClick={() => handleNavigate('/seller/orders')}>
                        <div className="button-content">
                            <img src={salesIcon} alt="Ver Ventas" className="button-icon" />
                            <span>Ver Ventas</span>
                        </div>
                    </button>
                </div>
            </Dashboard>
        </div>
    );
};

export default VendedorDashboard;
