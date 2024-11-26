import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarSeller from '../../components/NavbarSeller'; // Asegúrate de que la ruta sea correcta
import '../../styles/AgregarProducto.css';

const AgregarProducto = () => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [customBrand, setCustomBrand] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState('');
    

    const brands = [
        "Nestlé",
        "Kellogg's",
        "Campbell's",
        "San Marcos",
        "FUD",
        "La Morena",
        "Dolores",
        "La Fina",
        "PepsiCo",
        "Bimbo",
        "Danone",
        "Grupo Lala",
        "La Costeña",
        "Sabritas",
        "Herdez",
        "Gamesa",
        "Barcel",
        "Del Monte",
        "Maseca",
        "Carnation Clavel",
        "Chata",
        "McCormick",
        "Corona",
        "Santa Clara",
        "Nescafé",
        "Nature's Heart",
        "Quaker",
        "Capullo",
        "Carbonell",
        "Tres Estrellas",
        "Alpura",
        "San Rafael",
        "Cristal",
        "Santa Fe",
        "Great Value",
        "Tuny",
        "Pescador",
        "Valle Verde",
        "La Moderna",
        "Del Valle",
        "Jumex",
        "Bonafont",
        "Coca-Cola",
        "Zwan",
        "Liconsa",
        "Lala 100",
        "Maruchan",
        "Nutrisa",
        "Don Julio",
        "Don Pancho",
        "Sabormex",
        "Doña María",
        "Abuelita",
        "Mazola",
        "Avilés",
        "Ricolino",
        "Marinela",
        "Emperador",
        "Chedraui",
        "Soriana",
        "Selecto Brand",
        "Sam's Choice",
        "Hill Country Fare",
        "Aurrera",
        "Kikkoman",
        "Tabasco",
        "Knorr",
        "Maggi",
        "Old El Paso",
        "Goya",
        "Philadelphia",
        "Pringles",
        "Lays",
        "Fritos",
        "Totis",
        "Doritos",
        "Cheetos",
        "Ruffles",
        "Starkist",
        "Barilla",
        "Kinder",
        "Ferrero",
        "Nutella",
        "Oreo",
        "Toblerone",
        "Häagen-Dazs",
        "Ben & Jerry's",
        "Yoplait",
        "Act II",
        "Pop Secret",
        "La Costeñita",
        "El Mexicano",
        "Tío Nacho",
        "Vips",
        "La Villita",
        "Flor de Alfalfa",
        "La Huerta",
        "Granja San José",
        "De la Rosa",
        "Coronel",
        "La Abuelita",
        "Los Volcanes",
        "Sanísimo",
        "Vero",
        "Mexsana",
        "El Rey del Taco",
        "Otros"
    ];
    

    const categories = {
        "Cereales y Tubérculos": [
            "Avena", "Arroz", "Pan", "Pasta", "Tortillas", 
            "Maíz", "Papas", "Camote", "Yuca", "Harina"
        ],
        "Verduras y Hortalizas": [
            "Zanahoria", "Calabaza", "Espinaca", "Brócoli", 
            "Coliflor", "Lechuga", "Tomate", "Pepino", 
            "Pimiento", "Elote", "Chícharos"
        ],
        "Frutas": [
            "Naranja", "Limón", "Toronja", "Manzana", "Pera", 
            "Plátano", "Fresas", "Arándanos", "Uvas", 
            "Piña", "Mango", "Papaya"
        ],
        "Legumbres": [
            "Frijoles", "Lentejas", "Garbanzos", "Soya"
        ],
        "Origen Animal": [
            "Carne (res, pollo, cerdo, pescado)", 
            "Huevos", 
            "Leche y derivados (queso, yogurt, crema)"
        ],
        "Grasas Saludables": [
            "Aguacate", "Aceite de oliva", "Aceite de canola", 
            "Aceite de girasol", "Almendras", "Nueces", 
            "Chía", "Linaza"
        ],
        "Azúcares y Ultraprocesados": [
            "Azúcar", "Miel", "Jarabes", "Galletas", 
            "Pasteles", "Refrescos", "Jugos procesados", 
            "Dulces", "Snacks empaquetados"
        ],
        "Bebidas": [
            "Agua natural", "Infusiones", "Té", 
            "Jugos naturales", "Leche"
        ],
        "Enlatados": [
            "Duraznos en almíbar", "Leche condensada", "Maíz dulce enlatado", 
            "Atún en aceite o agua", "Sardinas en salsa de tomate", 
            "Pollo enlatado", "Espinacas en conserva", 
            "Zanahorias en conserva", "Champiñones en conserva", 
            "Puré de tomate", "Tomates pelados enlatados", 
            "Chícharos en lata", "Sopas instantáneas enlatadas", 
            "Guisos preparados (ravioles, chiles rellenos)", 
            "Frijoles refritos en lata"
        ]
    };
    

    // Manejo de la imagen cargada
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Manejo del formulario
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
            subcategory,
            price,
            stock,
            expiryDate,
            imagePreview,
            createdAt: new Date(),
            createdBy: user.email,
            sellerId: user.uid, // Aquí guardamos el sellerId
        };

        try {
            const docRef = await addDoc(collection(db, 'productos'), productData);
            
            // Crear un historial de pedido para el vendedor
            const historialData = {
                productId: docRef.id,
                productName: name,
                productPrice: price,
                stock,
                sellerId: user.uid,
                createdAt: new Date(),
                action: 'Producto agregado',
            };

            await addDoc(collection(db, 'historialPedidos'), historialData);

            setMessage(`Producto agregado con ID: ${docRef.id}`);
            // Reiniciar el formulario
            setName('');
            setBrand('');
            setCustomBrand('');
            setCategory('');
            setSubcategory('');
            setPrice(0);
            setStock(0);
            setExpiryDate('');
            setImagePreview(null);
        } catch (error) {
            setMessage(`Error al agregar producto: ${error.message}`);
        }
    };

    // Obtener la fecha de hoy en formato yyyy-mm-dd
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="background-div">
            <NavbarSeller />
            <div className="form-container">
                <center><h1>Agregar Nuevo Producto</h1></center>
                <br />
                <form onSubmit={handleSubmit} className="product-form">
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
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setSubcategory(''); // Resetear subcategoría al cambiar categoría
                        }} 
                        required 
                    >
                        <option value="">Selecciona una categoría</option>
                        {Object.keys(categories).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {category && (
                        <>
                            <label htmlFor="product-subcategory">Subcategoría:</label>
                            <select 
                                id="product-subcategory"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)} 
                                required 
                            >
                                <option value="">Selecciona una subcategoría</option>
                                {categories[category].map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </>
                    )}

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
                        min={today}  // Establece la fecha mínima
                    />
                    
                    <label htmlFor="product-image">Imagen del Producto:</label>
                    <input 
                        type="file"
                        id="product-image"
                        accept="image/*" 
                        onChange={handleImageChange} 
                        required 
                    />
                    {imagePreview && (
                        <div>
                            <p>Vista previa de la imagen:</p>
                            <img 
                                src={imagePreview} 
                                alt="Vista previa" 
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                            />
                        </div>
                    )}
                    <button type="submit" className="btn-primaryV">Agregar Producto</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default AgregarProducto;
