import { useEffect, useState } from "react";
import Layout from "../components/common/layout";
import "./../styles/hoteles.css";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMG = "https://via.placeholder.com/400x250?text=Sin+Imagen";
const BATCH_SIZE = 10;
const PIXABAY_KEY = "50804104-c7373eb6bd823c989f770888c";

export default function Hoteles() {
    const [search, setSearch] = useState("");
    const [estrellas, setEstrellas] = useState(0);
    const [hoteles, setHoteles] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5120/api/hotel")
            .then(res => res.json())
            .then(data => {
                const hotelesBase = data.hotels.map(h => ({
                    id: h.hotelId,
                    nombre: h.hotelName,
                    ciudad: h.city,
                    estrellas: Math.min(5, Math.floor(h.rating / 10)),
                    precio: h.pricePerNight / 100,
                    imagen: null
                }));

                const peticionesImagenes = hotelesBase.map(hotel =>
                    fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(hotel.ciudad)}&image_type=photo&per_page=3`)
                        .then(res => res.json())
                        .then(result => {
                            hotel.imagen = result.hits?.[0]?.webformatURL || DEFAULT_IMG;
                            return hotel;
                        })
                        .catch(() => {
                            hotel.imagen = DEFAULT_IMG;
                            return hotel;
                        })
                );

                Promise.all(peticionesImagenes).then(hotelesConImagen => {
                    setHoteles(hotelesConImagen);
                    setFiltered(hotelesConImagen);
                });
            })
            .catch(err => console.error("Error al obtener hoteles:", err));
    }, []);

    useEffect(() => {
        const term = search.toLowerCase().trim();

        const filtrado = hoteles.filter(h => {
            const ciudadOk = h.ciudad.toLowerCase().includes(term);
            const estrellasOk = estrellas === 0 || h.estrellas === estrellas;
            return ciudadOk && estrellasOk;
        });

        setFiltered(filtrado);
        setVisibleCount(BATCH_SIZE);
    }, [search, estrellas, hoteles]);

    const visibleHoteles = filtered.slice(0, visibleCount);
    const hayMas = visibleCount < filtered.length;

    return (
        <Layout>
            <div className="login-page">
                <div id="clouds">
                    {[...Array(7)].map((_, i) => (
                        <div className={`cloud x${i + 1}`} key={i}></div>
                    ))}
                </div>

                <button
                    type="button"
                    className="boton-vuelos-h"
                    onClick={() => navigate("/flights")}>
                    🛩️ Buscar Vuelos
                </button>

                <div>
                    <h1>Hoteles</h1>

                    <div className="contenedor-formulario hoteles-container">
                        <div className="filtros-container">
                            <input
                                type="text"
                                placeholder="Buscar un hotel por ciudad..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="buscador-hotel"
                            />

                            <select
                                value={estrellas}
                                onChange={e => setEstrellas(Number(e.target.value))}
                                className="selector-estrellas"
                            >
                                <option value={0}>Todas las estrellas</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} ★</option>
                                ))}
                            </select>
                        </div>

                        {visibleHoteles.map(hotel => (
                            <div key={hotel.id} className="hotel-card">
                                <img
                                    src={hotel.imagen || DEFAULT_IMG}
                                    alt={`Imagen de ${hotel.nombre}`}
                                    className="hotel-img"
                                />
                                <h3>{hotel.nombre}</h3>
                                <p>Ciudad: {hotel.ciudad}</p>
                                <p><strong>Estrellas:</strong> {"★".repeat(hotel.estrellas).padEnd(5, "☆")}</p>
                                <p>Precio: {hotel.precio.toFixed(2)} € / noche</p>
                            </div>
                        ))}

                        <div className="ver-mas-container">
                            {hayMas && filtered.length > 0 ? (
                                <button
                                    className="ver-mas-btn"
                                    onClick={() => setVisibleCount(c => c + BATCH_SIZE)}
                                >
                                    Ver más
                                </button>
                            ) : null}
                        </div>

                        {filtered.length === 0 && (
                            <p className="fin-lista">No se encontraron hoteles que coincidan.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}