import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Home.css';
import Footer from '../components/footer';
import NavbarInicio from '../components/navbar';

const Home = () => (
  <div className="App">
    <NavbarInicio />
    <HeroSection />
    <Features />
    <AdditionalFeatures />
    <CallToAction />
    <Footer />
  </div>
);

const HeroSection = () => (
  <section className="hero">
    <h2>Ahorra Comida, Ahorra Dinero</h2>
    <p>Únete a nosotros para reducir el desperdicio de alimentos y hacer del mundo un lugar más verde.</p>
    <Link to="/login" className="btn-primary1">Comienza a Ahorrar Ahora</Link>
  </section>
);

const Features = () => (
  <section id="features" className="features">
    <h3>¿Por qué Elegirnos?</h3>
    <div className="feature-cards">
      <div className="card">
        <h4>Ofertas</h4>
        <p>Encuentra tiendas cercanas que ofrecen alimentos con descuento.</p>
      </div>
      <div className="card">
        <h4>Pagos Fáciles</h4>
        <p>Pagos seguros con Stripe y PayPal.</p>
      </div>
      <div className="card">
        <h4>Rastrea Tu Impacto</h4>
        <p>Observa cuánto alimento has salvado y su impacto ambiental.</p>
      </div>
    </div>
  </section>
);

const AdditionalFeatures = () => (
  <section id="additional-features" className="features-container">
    <h1>Nuestras Características Principales</h1>
    <div className="features-grid">
      <FeatureItem 
        imgSrc="https://via.placeholder.com/100" 
        title="Publicación de Productos" 
        description="Permite a los usuarios publicar alimentos cercanos a su fecha de vencimiento, facilitando la compra a precios reducidos." 
      />
      <FeatureItem 
        imgSrc="https://via.placeholder.com/100" 
        title="Búsqueda Geolocalizada" 
        description="Utiliza la geolocalización para encontrar ofertas de alimentos cercanas a tu ubicación en tiempo real." 
      />
      <FeatureItem 
        imgSrc="https://via.placeholder.com/100" 
        title="Pagos Seguros" 
        description="Realiza transacciones seguras utilizando Stripe o PayPal para una experiencia sin complicaciones." 
      />
      <FeatureItem 
        imgSrc="https://via.placeholder.com/100" 
        title="Alertas Personalizadas" 
        description="Recibe notificaciones personalizadas sobre ofertas de alimentos basadas en tus preferencias." 
      />
      <FeatureItem 
        imgSrc="https://via.placeholder.com/100" 
        title="Impacto Ambiental" 
        description="Descubre el impacto positivo que has tenido al reducir el desperdicio de alimentos con estadísticas personalizadas." 
      />
      <FeatureItem 
        imgSrc="https://via.placeholder.com/100" 
        title="Educación sobre Desperdicio" 
        description="Aprende sobre el impacto del desperdicio alimentario y cómo puedes hacer la diferencia a través de nuestros recursos educativos." 
      />
    </div>
  </section>
);

const FeatureItem = ({ imgSrc, title, description }) => (
  <div className="feature-item">
    <img src={imgSrc} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const CallToAction = () => (
  <section id="cta" className="cta">
    <h3>¿Listo para Comenzar?</h3>
    <p>Regístrate ahora y ayuda a reducir el desperdicio de alimentos mientras ahorras dinero.</p>
    <Link to="/register" className="btn-secondary">Regístrate</Link>
  </section>
);

export default Home;
