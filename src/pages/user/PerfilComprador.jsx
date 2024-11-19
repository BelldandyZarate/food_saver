import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavbarUser from '../../components/navbaruser';
import '../../styles/PerfilUsuario.css';

const cpData = {
    "55740": [
        { district: "Pueblo Tecámac de Felipe Villanueva Centro", state: "México", city: "Tecámac" },
        { district: "Barrio El Calvario", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Galaxias el Llano", state: "México", city: "Tecámac" }
    ],
    "55743": [
        { district: "Fraccionamiento Real Granada", state: "México", city: "Tecámac" },
        { district: "Colonia Isidro Fabela", state: "México", city: "Tecámac" },
        { district: "Condominio Rancho la Luz", state: "México", city: "Tecámac" },
        { district: "Colonia La Palma", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Hacienda del Bosque", state: "México", city: "Tecámac" }
    ],
    "55744": [
        { district: "Pueblo San Pedro Potzohuacan", state: "México", city: "Tecámac" }
    ],
    "55745": [
        { district: "Fraccionamiento Real Granada IV", state: "México", city: "Tecámac" },
        { district: "Pueblo San Jerónimo Xonacahuacan", state: "México", city: "Tecámac" },
        { district: "Colonia Ampliación San Jerónimo", state: "México", city: "Tecámac" },
        { district: "Colonia Nuevo México", state: "México", city: "Tecámac" },
        { district: "Colonia Jardines de Xonacahuacan", state: "México", city: "Tecámac" }
    ],
    "55746": [
        { district: "Ranchería Ex Hacienda San Miguel Tenopala", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Rancho la Capilla", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Santa Cruz Tecámac", state: "México", city: "Tecámac" }
    ],
    "55747": [
        { district: "Pueblo San Pablo Tecalco", state: "México", city: "Tecámac" },
        { district: "Colonia San Isidro Citlalcóatl", state: "México", city: "Tecámac" },
        { district: "Colonia Nueva Santa María (De San Pablo Tecalco)", state: "México", city: "Tecámac" },
        { district: "Colonia San Antonio de San Pablo Tecalco", state: "México", city: "Tecámac" }
    ],
    "55748": [
        { district: "Fraccionamiento Jema", state: "México", city: "Tecámac" },
        { district: "Colonia San José", state: "México", city: "Tecámac" },
        { district: "Colonia San Martín Azcatepec", state: "México", city: "Tecámac" },
        { district: "Colonia San Mateo Tecalco", state: "México", city: "Tecámac" },
        { district: "Colonia Ejido de Tecámac", state: "México", city: "Tecámac" },
        { district: "Colonia Primero de Marzo", state: "México", city: "Tecámac" },
        { district: "Colonia Los Olivos", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Los Olivos", state: "México", city: "Tecámac" },
        { district: "Colonia Ampliación Ejido de Tecámac", state: "México", city: "Tecámac" }
    ],
    "55749": [
        { district: "Fraccionamiento Montecarlo", state: "México", city: "Tecámac" },
        { district: "Colonia 5 de Mayo", state: "México", city: "Tecámac" },
        { district: "Colonia Hueyotenco", state: "México", city: "Tecámac" },
        { district: "Colonia Nueva Santa María", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Villa del Real", state: "México", city: "Tecámac" },
        { district: "Colonia Ampliación 5 de Mayo", state: "México", city: "Tecámac" },
        { district: "Colonia La Nopalera", state: "México", city: "Tecámac" },
        { district: "Colonia Electricistas", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Sierra Hermosa", state: "México", city: "Tecámac" },
        { district: "Colonia Texcaltitla", state: "México", city: "Tecámac" },
        { district: "Colonia Ixotitla", state: "México", city: "Tecámac" },
        { district: "Ranchería Azul", state: "México", city: "Tecámac" },
        { district: "Colonia Vista Hermosa", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Del Catillo", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Jardines de Tecámac", state: "México", city: "Tecámac" }
    ],
    "55750": [
        { district: "Colonia El Tanque", state: "México", city: "Tecámac" },
        { district: "Pueblo Santa María Ajoloapan", state: "México", city: "Tecámac" }
    ],
    "55752": [
        { district: "Pueblo San Juan Pueblo Nuevo", state: "México", city: "Tecámac" }
    ],
    "55754": [
        { district: "Pueblo Santo Domingo Ajoloapan", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Paseos de Tecámac", state: "México", city: "Tecámac" },
        { district: "Colonia Loma de San Jerónimo (Ampliación Santo Domingo)", state: "México", city: "Tecámac" }
    ],
    "55755": [
        { district: "Pueblo Los Reyes Acozac", state: "México", city: "Tecámac" },
        { district: "Colonia La Campiña", state: "México", city: "Tecámac" },
        { district: "Colonia Buenavista", state: "México", city: "Tecámac" },
        { district: "Barrio Guadalupe de Reyes Acozac", state: "México", city: "Tecámac" },
        { district: "Colonia La Michapa", state: "México", city: "Tecámac" },
        { district: "Colonia La Palma de Reyes", state: "México", city: "Tecámac" },
        { district: "Colonia Progreso", state: "México", city: "Tecámac" },
        { district: "Barrio El Calvario de Reyes Acozac", state: "México", city: "Tecámac" },
        { district: "Colonia San Miguel", state: "México", city: "Tecámac" }
    ],
    "55757": [
        { district: "Pueblo San Lucas Xolox", state: "México", city: "Tecámac" },
        { district: "Colonia Ejidal", state: "México", city: "Tecámac" }
    ],
    "55758": [
        { district: "Zona industrial Ampliación la Palma", state: "México", city: "Tecámac" }
    ],
    "55760": [
        { district: "Pueblo San Francisco Cuautliquixca", state: "México", city: "Tecámac" },
        { district: "Pueblo Santa María Ozumbilla", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Mexicanos Unidos", state: "México", city: "Tecámac" },
        { district: "Colonia Magisterial", state: "México", city: "Tecámac" },
        { district: "Colonia Atlautenco", state: "México", city: "Tecámac" },
        { district: "Barrio El Calvario de Ozumbilla", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Portal Ojo de Agua", state: "México", city: "Tecámac" }
    ],
    "55763": [
        { district: "Fraccionamiento Vitalia", state: "México", city: "Tecámac" },
        { district: "Unidad habitacional Los Héroes Tecámac", state: "México", city: "Tecámac" }
    ],
    "55764": [
        { district: "Colonia Margarito F. Ayala", state: "México", city: "Tecámac" },
        { district: "Unidad habitacional Los Héroes Tecámac II", state: "México", city: "Tecámac" },
        { district: "Unidad habitacional Los Héroes Ozumbilla", state: "México", city: "Tecámac" },
        { district: "Colonia Nuevo Paraíso", state: "México", city: "Tecámac" }
    ],
    "55765": [
        { district: "Fraccionamiento Los Héroes San Pablo", state: "México", city: "Tecámac" },
        { district: "Colonia Nueva Tlalnepantla", state: "México", city: "Tecámac" },
        { district: "Colonia Esmeralda", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Lomas de Tecámac", state: "México", city: "Tecámac" },
        { district: "Colonia La Cañada", state: "México", city: "Tecámac" },
        { district: "Colonia Jesús Romero Flores", state: "México", city: "Tecámac" },
        { district: "Colonia Granjas Valle de Guadalupe", state: "México", city: "Tecámac" },
        { district: "Colonia México Independiente", state: "México", city: "Tecámac" },
        { district: "Colonia 21 de Agosto", state: "México", city: "Tecámac" },
        { district: "Colonia 10 de Junio", state: "México", city: "Tecámac" },
        { district: "Colonia Soto y Gama", state: "México", city: "Tecámac" }
    ],
    "55766": [
        { district: "Colonia Ampliación Ozumbilla", state: "México", city: "Tecámac" }
    ],
    "55767": [
        { district: "Fraccionamiento Conjunto urbano Real Verona", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real Toscana", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Punta Palermo", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Bosques de los Héroes", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Paseos del Bosque", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real Carrara", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real Alcalá", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Alcázar", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Quinta Versalles", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real Vizcaya", state: "México", city: "Tecámac" },
        { district: "Colonia Loma Bonita", state: "México", city: "Tecámac" },
        { district: "Colonia Santa Cruz", state: "México", city: "Tecámac" },
        { district: "Colonia Los Arcos", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real del Sol", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real del Cid", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real Castell", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Real Firenze", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Valle San Pedro Urbi Villa del Campo", state: "México", city: "Tecámac" }
    ],
    "55768": [
        { district: "Colonia Cuauhtémoc", state: "México", city: "Tecámac" },
        { district: "Colonia Lomas de Ozumbilla", state: "México", city: "Tecámac" },
        { district: "Colonia San Antonio (de San Francisco Cuautliquixca)", state: "México", city: "Tecámac" },
        { district: "Colonia La Azteca", state: "México", city: "Tecámac" },
        { district: "Colonia Vista Hermosa (De Ozumbilla)", state: "México", city: "Tecámac" },
        { district: "Colonia Tezontla", state: "México", city: "Tecámac" }
    ],
    "55769": [
        { district: "Colonia Norchuca", state: "México", city: "Tecámac" }
    ],
    "55770": [
        { district: "Colonia San Pedro (El Terremoto)", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Rinconada San Pedro", state: "México", city: "Tecámac" },
        { district: "Fraccionamiento Ojo de Agua", state: "México", city: "Tecámac" },
        { district: "Pueblo San Pedro Atzompa", state: "México", city: "Tecámac" }
    ],
    "55773": [
        { district: "Conjunto habitacional Hacienda Provenzal", state: "México", city: "Tecámac" }
    ],
    "55776": [
        { district: "Colonia Lomas de San Pedro Atzompa", state: "México", city: "Tecámac" }
    ],
    "55778": [
        { district: "Colonia Ampliación de la Concepción", state: "México", city: "Tecámac" }
    ]
};


const PerfilComprador = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        homePhone: '',
        address: '',
        postalCode: '',
        state: '',
        city: '',
        district: '',
        birthDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [districtOptions, setDistrictOptions] = useState([]);

    const auth = getAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        setMessage('No se encontraron datos de usuario.');
                    }
                } catch (error) {
                    setMessage('Error al obtener los datos del usuario: ' + error.message);
                }
            } else {
                setMessage('No hay usuario registrado.');
            }
            setLoading(false);
        };

        fetchUserData();
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));

        if (name === 'postalCode') {
            const locationInfo = cpData[value];
            if (locationInfo) {
                setDistrictOptions(locationInfo);
                setUserData(prev => ({
                    ...prev,
                    state: locationInfo[0].state, // Por defecto, selecciona el primer distrito
                    city: locationInfo[0].city,
                    district: locationInfo[0].district
                }));
                setMessage('Ubicación encontrada.');
            } else {
                setMessage('Código postal no encontrado.');
                setUserData(prev => ({
                    ...prev,
                    state: '',
                    city: '',
                    district: ''
                }));
                setDistrictOptions([]);
            }
        }
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setUserData(prev => ({ ...prev, district: selectedDistrict }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), userData);
                setMessage('Datos actualizados con éxito.');
                setIsEditing(false);
            } catch (error) {
                setMessage('Error al actualizar los datos: ' + error.message);
            }
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="background-div">
            <NavbarUser />
            <center><h1 className="title-box">Perfil de Comprador</h1></center>
            {message && <p>{message}</p>}
            <div className="form-container">
                <form onSubmit={handleUpdate} className="two-column-form">
                    <div className="form-group">
                        <label>
                            Correo Electrónico:
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                readOnly
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Nombre:
                            <input
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Apellido:
                            <input
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Teléfono Móvil:
                            <input
                                type="tel"
                                name="mobile"
                                value={userData.mobile}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Teléfono de Casa:
                            <input
                                type="tel"
                                name="homePhone"
                                value={userData.homePhone}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Dirección:
                            <input
                                type="text"
                                name="address"
                                value={userData.address}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Código Postal:
                            <input
                                type="text"
                                name="postalCode"
                                value={userData.postalCode}
                                onChange={handleChange}
                                readOnly={!isEditing}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Estado:
                            <input
                                type="text"
                                name="state"
                                value={userData.state}
                                readOnly
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Ciudad:
                            <input
                                type="text"
                                name="city"
                                value={userData.city}
                                readOnly
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Distrito:
                            {districtOptions.length > 1 ? (
                                <select
                                    name="district"
                                    value={userData.district}
                                    onChange={handleDistrictChange}
                                    disabled={!isEditing}
                                >
                                    {districtOptions.map((option, index) => (
                                        <option key={index} value={option.district}>
                                            {option.district}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="district"
                                    value={userData.district}
                                    readOnly
                                />
                            )}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Fecha de Nacimiento:
                            <input
                                type="date"
                                name="birthDate"
                                value={userData.birthDate}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                        {isEditing && <button type="submit">Actualizar Datos</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PerfilComprador;
