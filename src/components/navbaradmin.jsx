// src/Components/NavbarAdmin.js
import React from 'react';
import { Link } from 'react-router-dom';

const navbaradmin = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <h1 className="logo">FoodSaver</h1>
      <ul className="nav-links">
        <li><Link to="/dashboard/admin">Inicio</Link></li>
        <li><Link to="/admin/manage-users">Gestionar Usuarios</Link></li>
        <li><Link to="/admin/manage-pages">Gestionar Vendedores</Link></li> {/* Agrega el enlace a ManagePages */}
        <li><Link to="/admin/manage-product-pages">Gestionar Productos</Link></li> {/* Agrega el enlace a ManageProductPages */}
        <li><Link to= "/">Salir</Link></li>
      </ul>
    </nav>
  );
};

export default navbaradmin;
