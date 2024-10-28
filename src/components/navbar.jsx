import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css'; // Asegúrate de importar el CSS

const Navbar = () => {
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
            <div className="logo">Food Saver</div>
            {isMobile && (
                <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    &#9776; {/* Icono de hamburguesa */}
                </div>
            )}
            <ul className={`nav-links ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
                <li><a href="/" onClick={handleLinkClick}>Inicio</a></li>
                <li><a href="/aboutus" onClick={handleLinkClick}>Acerca de Nosotros</a></li>
                <li><a href="/login" onClick={handleLinkClick}>Iniciar Sesión</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
