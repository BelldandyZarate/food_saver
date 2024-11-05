import React from 'react';
import '../Styles/aboutus.css';
import Footer from '../components/footer';
import NavbarInicio from '../components/navbar';

// Importar las imágenes
import alanAguilar from '../assets/alan-aguilar.jpeg';
import karenMartinez from '../assets/karen-martinez.jpeg';
import belldandyZarate from '../assets/belldandy-zarate.jpeg';
import fernandaCordero from '../assets/fernanda-cordero.jpeg';

const AboutUs = () => {
  return (
    <div>
      <NavbarInicio />
      <div className="about-container">
        <h1>Acerca de Nosotros</h1>

        <section className="mission">
          <h2>Nuestra Misión</h2>
          <p>
            Nuestra misión es reducir el desperdicio de alimentos conectando a tiendas, supermercados, restaurantes y personas, para que los alimentos cercanos a su fecha de vencimiento se puedan vender a precios reducidos.
          </p>
        </section>

        <section className="vision">
          <h2>Nuestra Visión</h2>
          <p>
            Aspiramos a crear un mundo donde el desperdicio de alimentos sea cosa del pasado, ayudando a las personas a acceder a alimentos de calidad mientras apoyamos a los negocios locales.
          </p>
        </section>

        <section className="team">
          <h2>Nuestro Equipo</h2>
          <p>
            Contamos con un equipo apasionado por la sostenibilidad y la tecnología. Juntos trabajamos para crear soluciones innovadoras que generen un impacto positivo en nuestra comunidad.
          </p>
          <div className="team-members">
            <div className="team-member">
              <img src={alanAguilar} alt="Alan Aguilar" />
              <h3>Alan Aguilar</h3>
              <p>Fundador & CEO</p>
            </div>
            <div className="team-member">
              <img src={karenMartinez} alt="Karen Martinez" />
              <h3>Karen Martinez</h3>
              <p>Directora de Operaciones</p>
            </div>
            <div className="team-member">
              <img src={belldandyZarate} alt="Belldandy Zarate" />
              <h3>Belldandy Zarate</h3>
              <p>Jefe de Desarrollo</p>
            </div>
            <div className="team-member">
              <img src={fernandaCordero} alt="Fernanda Cordero" />
              <h3>Fernanda Cordero</h3>
              <p>Especialista en Marketing</p>
            </div>
          </div>
        </section>
        
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
