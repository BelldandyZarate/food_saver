import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css';
import logoImage from '../assets/Logotipo.png'

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-columns">
        <div className="footer-logo-column">
          
          <img 
            src={logoImage} // Usar la imagen importada
            alt="Logo de FoodSaver" 
            style={{ width: '130px', height: '130px', objectFit: 'contain' }}  
          />
        </div>
        <div className="footer-column">
          <h2>Enlaces</h2>
          <ul className="footer-links">
            <li><Link to="/aboutus">Acerca de Nosotros</Link></li>
            <li><Link to="/privacypolicy">Política de Privacidad</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h2>Contáctanos</h2>
          <ul className="footer-contact">
            <li>Email: <a href="mailto:info@foodSaver.com">info@foodSaver.com</a></li>
            <li>Teléfono: <a href="tel:+1234567890">+123 456 7890</a></li>
            <li><Link to="/contactform">Formulario de Contacto</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h2>Redes Sociales</h2>
          <ul className="footer-social-links">
            <li><Link to="#">Facebook</Link></li>
            <li><Link to="#">Twitter</Link></li>
            <li><Link to="#">Instagram</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-info" style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>&copy; 2024 FoodSaver. Todos los derechos reservados.</p>
        <p>Conectando a las personas para reducir el desperdicio de alimentos.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
