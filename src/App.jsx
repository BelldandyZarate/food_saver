import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home'; // Importa el componente Home
import Aboutus from './pages/aboutus'
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactForm from './pages/contactform';
import Register from './pages/register';
import Login from './pages/login';
import './App.css';




function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Define la ruta para Home */}
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/contactform" element={<ContactForm/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        {/* Puedes agregar más rutas aquí si es necesario */}
      </Routes>
    </Router>
  );
}

export default App;
