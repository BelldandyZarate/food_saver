import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminDashboard.css';
import userIcon from '../../assets/usuarios.png';
import reportIcon from '../../assets/reportes.png';

const AdminDashboard = () => {
    return (
        <div className="background-div">
            <NavbarAdmin />
            <Dashboard title="Dashboard Administrador">
                <div className="welcome-container">
                    <p className="welcome-box">Bienvenido al panel de administrador.</p>
                </div>
                <div className="button-container">
                    <Link to="/admin/manage-users" className="btn-primary">
                        <div className="button-content">
                            <img src={userIcon} alt="Gestionar Usuarios" className="button-icon" />
                            <span>Gestionar Usuarios</span>
                        </div>
                    </Link>
                    <Link to="/admin/manage-product-pages" className="btn-primary">
                        <div className="button-content">
                            <img src={reportIcon} alt="Ver Reportes" className="button-icon" />
                            <span>Ver Reportes</span>
                        </div>
                    </Link>
                </div>
            </Dashboard>
        </div>
    );
};

export default AdminDashboard;
