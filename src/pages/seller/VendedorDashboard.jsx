import React from 'react';
import Dashboard from '../../components/Dashboard';
import NavbarSeller from '../../components/NavbarSeller'; // Asegúrate de que la ruta sea correcta

const VendedorDashboard = () => {
    return (
        <div>
            <NavbarSeller />
            <Dashboard title="Dashboard Vendedor">
                <p>Bienvenido al panel de vendedor.</p>
                {/* Aquí puedes agregar más funcionalidades, como gestionar productos, ver ventas, etc. */}
                <button className="btn-primary">Gestionar Productos</button>
                <button className="btn-primary">Ver Ventas</button>
            </Dashboard>
        </div>
    );
};

export default VendedorDashboard;
