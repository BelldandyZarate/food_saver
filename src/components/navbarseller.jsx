// src/Components/NavbarVendedor.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "../Styles/Navbar.css";

const navbarseller = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <h1 className="logo">FoodSaver</h1>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard/vendedor">Inicio</Link> {/* Redirige al panel de control del vendedor */}
        </li>
        <li>
          <Link to="/seller/gestionar-productos">Gestionar Productos</Link> {/* Redirige a la lista de productos */}
        </li>
        <li>
          <Link to="/seller/agregar-producto">Agregar Producto</Link> {/* Redirige a la página de agregar productos */}
        </li>
        <li>
          <Link to="/seller/orders">Gestionar Pedidos</Link> {/* Redirige a la página de gestión de pedidos */}
        </li>
        <li>
          <Link to="/vendedor/perfil"> {/* Cambia aquí a la ruta correcta para el perfil */}
            <FontAwesomeIcon icon={faUser} size="lg" style={{ color: '#4CAF50' }} /> {/* Ícono de usuario */}
            Perfil
          </Link>
        </li>
        <li><Link to= "/">Salir</Link></li>
        
      </ul>
    </nav>
  );
};

export default navbarseller;
