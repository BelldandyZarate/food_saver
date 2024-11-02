// src/Components/NavbarComprador.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "../Styles/Navbar.css";  // Asegúrate de tener los estilos

const navbaruser = ({ onLogout }) => {
  console.log("NavbarComprador renderizado"); // Para verificar que se renderiza
  
  return (
    <nav className="navbar">
      <h1 className="logo">FoodSaver</h1>
      <ul className="nav-links">
        <li><Link to="/dashboard/comprador">Inicio</Link></li>
        <li><Link to="/user/carrito">Carrito</Link></li>
        <li><Link to="/user/order-history">Historial de Pedidos</Link></li>
        <li>
          <Link to="/user/perfil" className="profile-link">
            <FontAwesomeIcon icon={faUser} size="lg" style={{ color: '#4CAF50' }} />
            <span className="profile-text">Perfil</span>
          </Link>
        </li>
        <li><Link to= "/">Salir</Link></li>
      </ul>
    </nav>
  );
};

export default navbaruser;
