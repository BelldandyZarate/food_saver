import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Navbar.css'; // Asegúrate de tener los estilos

const NavbarVendedor = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        if (isMobile) {
            setIsOpen(false); // Cierra el menú si es móvil
        }
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768); // Cambia según el breakpoint que desees
    };

    useEffect(() => {
        handleResize(); // Inicializa el estado
        window.addEventListener('resize', handleResize); // Escucha cambios de tamaño
        return () => window.removeEventListener('resize', handleResize); // Limpieza
    }, []);

    return (
        <nav className="navbar">
            <h1 className="logo">FoodSaver</h1>
            {isMobile && (
                <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    &#9776; {/* Icono de hamburguesa */}
                </div>
            )}
            <ul className={`nav-links ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
                <li><Link to="/dashboard/vendedor" onClick={handleLinkClick}>Inicio</Link></li>
                <li><Link to="/seller/gestionar-productos" onClick={handleLinkClick}>Gestionar Productos</Link></li>
                <li><Link to="/seller/agregar-producto" onClick={handleLinkClick}>Agregar Producto</Link></li>
                <li><Link to="/seller/orders" onClick={handleLinkClick}>Gestionar Pedidos</Link></li>
                <li>
                    <Link to="/vendedor/perfil" className="profile-link" onClick={handleLinkClick}>
                        <FontAwesomeIcon icon={faUser} size="lg" style={{ color: '#4CAF50' }} /> {/* Ícono de usuario */}
                        Perfil
                    </Link>
                </li>
                <li><Link to="/" onClick={onLogout}>Salir</Link></li>
            </ul>
        </nav>
    );
};

export default NavbarVendedor;