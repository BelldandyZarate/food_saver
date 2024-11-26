import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/privacypolicy.css'; // Asegúrate de tener un archivo CSS para estilos

const PrivacyPolicy = () => {
  return (
    <div className='body'>
      <div className="privacy-policy-container">
        <h1>Políticas de Privacidad</h1>
        <p>
          En FoodSaver, valoramos su privacidad y estamos comprometidos a proteger su información personal. 
          Esta política explica qué información recopilamos, cómo la usamos y sus derechos en relación con sus datos.
        </p>

        <h2>Información que Recopilamos</h2>
        <p>
          Recopilamos información personal cuando se registra en nuestra plataforma, realiza un pedido o se pone en contacto con nosotros. 
          La información puede incluir su nombre, correo electrónico, dirección y detalles de pago.
        </p>

        <h2>Uso de la Información</h2>
        <ul className="no-bullets">
        <p>Utilizamos la información recopilada para:</p>
          <li>Procesar transacciones y gestionar su cuenta.</li>
          <li>Enviar confirmaciones de pedidos y actualizaciones.</li>
          <li>Mejorar nuestros servicios y la experiencia del usuario.</li>
          <li>Enviarle información y promociones relacionadas con nuestros servicios.</li>
        </ul>

        <h2>Protección de la Información</h2>
        <p>
          Implementamos medidas de seguridad para proteger su información personal. Sin embargo, no podemos garantizar la seguridad de sus datos transmitidos a través de Internet.
        </p>

        <h2>Derechos del Usuario</h2>
        <ul className="no-bullets">
        <p>Usted tiene derecho a:</p>
          <li>Acceder a su información personal.</li>
          <li>Solicitar la corrección de su información.</li>
          <li>Solicitar la eliminación de su información.</li>
          <li>Oponerse al tratamiento de sus datos en ciertas circunstancias.</li>
        </ul>

        <h2>Contacto</h2>
        <p>
          Si tiene preguntas sobre nuestras políticas de privacidad, contáctenos a través de 
          <a href="mailto:support@foodSaver.com"> support@foodSaver.com</a>.
        </p>

        <Link to="/" className="btn-primaryA">Volver a Inicio</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
