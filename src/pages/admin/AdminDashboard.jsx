import React from 'react';
import Dashboard from '../../components/Dashboard';
import NavbarAdmin from '../../components/NavbarAdmin'; // Asegúrate de que la ruta sea correcta

const AdminDashboard = () => {
    return (
        <div>
            <NavbarAdmin />
            <Dashboard title="Dashboard Administrador">
                <p>Bienvenido al panel de administrador.</p>
                {/* Aquí puedes agregar más funcionalidades, como gestionar usuarios, ver reportes, etc. */}
                <button className="btn-primary">Gestionar Usuarios</button>
                <button className="btn-primary">Ver Reportes</button>
            </Dashboard>
        </div>
    );
};

export default AdminDashboard;
