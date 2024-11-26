import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import NavbarSeller from '../../components/NavbarSeller'; // Asegúrate de que la ruta sea correcta
import '../../styles/NewGestionarProductos.css';

const GestionarProductos = () => {
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
    

    // Estructura de categorías y subcategorías
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
    
    

    const [productos, setProductos] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        subcategory: '',
        price: '',
        stock: '',
        expiryDate: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'productos'), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProductos(productsData);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'productos', id));
            alert('Producto eliminado con éxito.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto.');
        }
    };

    const handleEdit = (producto) => {
        setEditingProduct(producto.id);
        setFormData({
            name: producto.name,
            brand: producto.brand,
            category: producto.category,
            subcategory: producto.subcategory || '',
            price: producto.price,
            stock: producto.stock,
            expiryDate: producto.expiryDate,
            image: null
        });
        setImagePreview(producto.imagePreview || '');
        setSubcategories(categories[producto.category] || []);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };
            if (name === 'category') {
                setSubcategories(categories[value] || []);
                updatedData.subcategory = '';
            }
            return updatedData;
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const base64Image = await convertToBase64(file);
            setFormData(prev => ({ ...prev, image: base64Image }));
            setImagePreview(base64Image);
        } else {
            alert("Por favor selecciona un archivo de imagen.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const imageBase64 = formData.image || imagePreview;
        try {
            const updatedData = { ...formData, imagePreview: imageBase64 };
            await updateDoc(doc(db, 'productos', editingProduct), updatedData);
            alert('Producto actualizado con éxito.');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Error al actualizar el producto.');
        }
        setEditingProduct(null);
        setFormData({
            name: '',
            brand: '',
            category: '',
            subcategory: '',
            price: '',
            stock: '',
            expiryDate: '',
            image: null
        });
        setImagePreview('');
    };

    const isExpired = (expiryDate) => {
        const today = new Date();
        const expirationDate = new Date(expiryDate);
        return expirationDate < today;
    };

    return (
        <div className="background-div">
            <NavbarSeller />
            <div className="product-container">
                <center><h1 className="title-box">Gestionar Productos</h1></center>
                <div className="products-list">
                    {productos.map(producto => (
                        <div
                            key={producto.id}
                            className={`product-item ${isExpired(producto.expiryDate) ? 'expired-product' : ''}`}
                        >
                            <center><img
                                src={producto.imagePreview || '/default-image.jpg'}
                                alt={`Imagen de ${producto.name}`}
                                className="product-image"
                            /></center>
                            <h2 className="product-name">{producto.name}</h2>
                            <p className="product-brand">Marca: {producto.brand}</p>
                            <p className="product-category">Categoría: {producto.category}</p>
                            <p className="product-price">Precio: ${producto.price}</p>
                            <p className="product-stock">Stock: {producto.stock}</p>
                            <p className="product-expiry">Fecha de Caducación: {producto.expiryDate}</p>
                            {!isExpired(producto.expiryDate) && (
                                <>
                                    <button onClick={() => handleEdit(producto)} className="btn-edit">Editar</button>
                                    <button onClick={() => handleDelete(producto.id)} className="btn-delete">Eliminar</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {editingProduct && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <h2>Editar Producto</h2>
                            <form onSubmit={handleUpdate} className="product-form">
                                <label>
                                    Nombre:
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Marca:
                                    <select
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        required
                                    >
                                        {brands.map((brand, index) => (
                                            <option key={index} value={brand}>
                                                {brand}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Categoría:
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        {Object.keys(categories).map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Subcategoría:
                                    <select
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleChange}
                                        required
                                    >
                                        {subcategories.map((subcategory, index) => (
                                            <option key={index} value={subcategory}>
                                                {subcategory}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Precio:
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Stock:
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Fecha de caducación:
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Imagen:
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                                </label>
                                <button type="submit" className="btn-submit">Actualizar Producto</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionarProductos;
