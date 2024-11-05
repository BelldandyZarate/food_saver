import React from 'react';
import Dashboard from '../../components/Dashboard';
import NavbarAdmin from '../../components/NavbarAdmin'; // Asegúrate de que la ruta sea correcta
import '../../styles/AdminDashboard.css'; // Asegúrate de importar tu archivo CSS
import userIcon from '../../assets/usuarios.png'; // Asegúrate de tener la ruta correcta
import reportIcon from '../../assets/reportes.png'; // Asegúrate de tener la ruta correcta

const AdminDashboard = () => {
    return (
        <div className="background-div">
            <NavbarAdmin />
            <Dashboard title="Dashboard Administrador">
                <div className="welcome-container">
                    <p className="welcome-box">Bienvenido al panel de administrador.</p>
                </div>
                <div className="button-container">
                    <button className="btn-primary">
                        <div className="button-content">
                            <img src={userIcon} alt="Gestionar Usuarios" className="button-icon" />
                            <span>Gestionar Usuarios</span>
                        </div>
                    </button>
                    <button className="btn-primary">
                        <div className="button-content">
                            <img src={reportIcon} alt="Ver Reportes" className="button-icon" />
                            <span>Ver Reportes</span>
                        </div>
                    </button>
                </div>
            </Dashboard>
        </div>
    );
};

export default AdminDashboard;
