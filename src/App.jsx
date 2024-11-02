import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home'; // Importa el componente Home
import Aboutus from './pages/aboutus'
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactForm from './pages/contactform';
import Register from './pages/register';
import Login from './pages/login';
import './App.css';


//admin
import AdminDashboard from './pages/admin/AdminDashboard';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionVendedores from './pages/admin/GestionVendedores';


//seller
import VendedorDashboard from './pages/seller/VendedorDashboard';
import AgregarProducto from './pages/seller/AgregarProducto';
import GestionarProductos from './pages/seller/GestionarProductos';
import PerfilV from './pages/seller/PerfilUsuario';
import GestionarPedidosVendedor from './pages/seller/GestionarPedidosVendedor';

//user
import CompradorDashboard from './pages/user/CompradorDashboard';
import GestionProductos from './pages/admin/GestionProductos';
import GestionEmpleados from './pages/admin/GestionEmpleados';
import PerfilComprador from './pages/user/PerfilComprador';
import CarritoCompras from './pages/user/CarritoCompras';
import HistorialPedidos from './pages/user/HistorialPedidos';









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
        
        <Route path="/dashboard/vendedor" element={<VendedorDashboard />} />
      
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        <Route path="/seller/agregar-producto" element={<AgregarProducto />} /> {/* Ruta para agregar producto */}
        <Route path="/seller/gestionar-productos" element={<GestionarProductos/>} />
        <Route path="/vendedor/perfil" element={<PerfilV/>} />
        <Route path="/seller/orders" element={<GestionarPedidosVendedor/>} />
        

        <Route path="/admin/manage-users" element={<GestionUsuarios/>} />
        <Route path="/admin/manage-pages" element={<GestionVendedores/>} />
        <Route path="/admin/manage-product-pages" element={<GestionProductos/>} />
        <Route path="/admin/manage-employees" element={<GestionEmpleados/>} />

        <Route path="/dashboard/comprador" element={<CompradorDashboard />} />
        <Route path="/user/perfil" element={<PerfilComprador/>} ></Route>
        <Route path="/user/carrito" element={<CarritoCompras/>} ></Route>
        <Route path="/user/order-history" element={<HistorialPedidos/>} ></Route>
        

      </Routes>
    </Router>
  );
}

export default App;
