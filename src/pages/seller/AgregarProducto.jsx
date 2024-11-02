import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarSeller from '../../components/NavbarSeller'; // Asegúrate de que la ruta sea correcta

const AgregarProducto = () => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [customBrand, setCustomBrand] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    
    const brands = ['Marca1', 'Marca2', 'Otros'];
    const categories = ['Categoría1', 'Categoría2'];

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setMessage('Error: No hay usuario registrado.');
            return;
        }

        const productData = {
            name,
            brand: brand === 'Otros' ? customBrand : brand,
            category,
            price,
            stock,
            expiryDate,
            createdAt: new Date(),
            createdBy: user.email,
        };

        try {
            const docRef = await addDoc(collection(db, 'productos'), productData);
            setMessage(`Producto agregado con ID: ${docRef.id}`);
            setName('');
            setBrand('');
            setCustomBrand('');
            setCategory('');
            setPrice(0);
            setStock(0);
            setExpiryDate('');
            setImage(null);
        } catch (error) {
            setMessage(`Error al agregar producto: ${error.message}`);
        }
    };

    return (
        <div>
            <NavbarSeller />
            <h1>Agregar Nuevo Producto</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="product-name">Nombre del Producto:</label>
                <input 
                    type="text" 
                    id="product-name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />

                <label htmlFor="product-brand">Marca del Producto:</label>
                <select 
                    id="product-brand"
                    value={brand}
                    onChange={(e) => {
                        const selectedBrand = e.target.value;
                        setBrand(selectedBrand);
                        if (selectedBrand === 'Otros') {
                            setCustomBrand('');
                        }
                    }} 
                    required 
                >
                    <option value="">Selecciona una marca</option>
                    {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>

                {brand === 'Otros' && (
                    <>
                        <label htmlFor="custom-brand">Escribe la marca:</label>
                        <input 
                            type="text"
                            id="custom-brand"
                            value={customBrand}
                            onChange={(e) => setCustomBrand(e.target.value)} 
                            placeholder="Marca del Producto" 
                            required 
                        />
                    </>
                )}

                <label htmlFor="product-category">Categoría:</label>
                <select 
                    id="product-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)} 
                    required 
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                
                <label htmlFor="product-price">Precio (MXN):</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '5px' }}>$</span>
                    <input 
                        type="number" 
                        id="product-price"
                        value={price} 
                        onChange={(e) => setPrice(Number(e.target.value))} 
                        required 
                        style={{ flex: '1' }} 
                    />
                </div>
                
                <label htmlFor="product-stock">Stock:</label>
                <input 
                    type="number" 
                    id="product-stock"
                    value={stock} 
                    onChange={(e) => setStock(Number(e.target.value))} 
                    required 
                />
                
                <label htmlFor="expiry-date">Fecha de Caducación:</label>
                <input 
                    type="date" 
                    id="expiry-date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)} 
                    required 
                />
                
                <label htmlFor="product-image">Imagen del Producto:</label>
                <input 
                    type="file"
                    id="product-image"
                    accept="image/*" 
                    onChange={handleImageChange} 
                    required 
                />
                <button type="submit" className="btn-primary">Agregar Producto</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AgregarProducto;