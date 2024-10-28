import React, { useState } from 'react';
import '../Styles/contactform.css'; // Asegúrate de tener estilos para el formulario
import NavbarInicio from '../components/navbar';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Aquí puedes agregar la lógica para enviar el formulario
    alert('Mensaje enviado con éxito');
    setName('');
    setEmail('');
    setMessage('');
    setError('');
  };

  return (
    <div className='body'>
      <NavbarInicio />
      <br />
      <div className="contact-form-container">
        <h2>Contacto</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Mensaje:</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <button type="submit" className="btn-primary">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
