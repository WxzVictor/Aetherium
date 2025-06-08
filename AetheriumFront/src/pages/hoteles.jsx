import { useEffect, useState, useRef } from "react";
import Layout from "../components/common/layout";
import "./../styles/hoteles.css";

const allHoteles = [
    {
        id: 1,
        nombre: "Hotel Barcelona Palace",
        ciudad: "Barcelona",
        estrellas: 4,
        precio: 95,
        imagen: "https://media.cntraveler.com/photos/5a7b25a20bb24c1f0b5dc18c/16:9/w_2560,c_limit/El-Palace-Hotel-__2018_Hotel-Facade.jpg"
    },
    {
        id: 2,
        nombre: "Lisboa Central",
        ciudad: "Lisboa",
        estrellas: 3,
        precio: 70,
        imagen: "https://th.bing.com/th/id/OIP.p62xNIHfdwCSKxUjU7a5FgHaFj?rs=1&pid=ImgDetMain"
    },
    {
        id: 3,
        nombre: "Roma Bella Vita",
        ciudad: "Roma",
        estrellas: 5,
        precio: 140,
        imagen: "https://www.hotelbellavita.com/wp-content/uploads/2014/01/QP9A8994-58.jpg"
    },
    {
        id: 4,
        nombre: "Madrid Suites",
        ciudad: "Madrid",
        estrellas: 4,
        precio: 110,
        imagen: "https://source.unsplash.com/400x250/?hotel,madrid"
    },
    {
        id: 5,
        nombre: "Porto Garden",
        ciudad: "Porto",
        estrellas: 3,
        precio: 80,
        imagen: "https://source.unsplash.com/400x250/?hotel,porto"
    },
    {
        id: 6,
        nombre: "Málaga Mar",
        ciudad: "Málaga",
        estrellas: 5,
        precio: 130,
        imagen: "https://source.unsplash.com/400x250/?hotel,malaga"
    },
    {
        id: 7,
        nombre: "Sevilla Sol Hotel",
        ciudad: "Sevilla",
        estrellas: 4,
        precio: 105,
        imagen: "https://source.unsplash.com/400x250/?hotel,sevilla"
    },
    {
        id: 8,
        nombre: "Granada Palace Inn",
        ciudad: "Granada",
        estrellas: 5,
        precio: 125,
        imagen: "https://source.unsplash.com/400x250/?hotel,granada"
    },
    {
        id: 9,
        nombre: "Bilbao Vista",
        ciudad: "Bilbao",
        estrellas: 3,
        precio: 85,
        imagen: "https://source.unsplash.com/400x250/?hotel,bilbao"
    },
    {
        id: 10,
        nombre: "Valencia Garden",
        ciudad: "Valencia",
        estrellas: 4,
        precio: 98,
        imagen: "https://source.unsplash.com/400x250/?hotel,valencia"
    }
];

export default function Hoteles() {
    const [visibleHoteles, setVisibleHoteles] = useState([]);
    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);
    const batchSize = 4;

    // Carga inicial
    useEffect(() => {
        const initial = allHoteles.slice(0, batchSize);
        setVisibleHoteles(initial);
        setIndex(batchSize);
    }, []);

    // Observer para carga adicional
    useEffect(() => {
        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading) {
                    setIsLoading(true);

                    const next = allHoteles.slice(index, index + batchSize);
                    if (next.length > 0) {
                        setVisibleHoteles(prev => {
                            const nuevos = next.filter(hotel => !prev.some(h => h.id === hotel.id));
                            return [...prev, ...nuevos];
                        });

                        setIndex(prev => prev + batchSize);
                        if (index + batchSize >= allHoteles.length) {
                            setHasMore(false);
                        }
                    } else {
                        setHasMore(false);
                    }

                    setIsLoading(false);
                }
            },
            { threshold: 1 }
        );

        const currentRef = containerRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [index, hasMore, isLoading]);

    return (
        <Layout>
            <div className="login-page">
                <div id="clouds">
                    {[...Array(7)].map((_, i) => (
                        <div className={`cloud x${i + 1}`} key={i}></div>
                    ))}
                </div>

                <div>
                    <h1>Hoteles Disponibles</h1>
                    <div className="contenedor-formulario hoteles-container">
                        {visibleHoteles.map(hotel => (
                            <div key={hotel.id} className="hotel-card">
                                <img
                                    src={hotel.imagen}
                                    alt={`Imagen de ${hotel.nombre}`}
                                    className="hotel-img"
                                />
                                <h3>{hotel.nombre}</h3>
                                <p>Ciudad: {hotel.ciudad}</p>
                                <p>Estrellas: {hotel.estrellas} ★</p>
                                <p>Precio: {hotel.precio} € / noche</p>
                            </div>
                        ))}
                        {hasMore && (
                            <div
                                ref={containerRef}
                                style={{ height: "1px", marginTop: "2rem" }}
                            ></div>
                        )}
                        {!hasMore && (
                            <p className="fin-lista">No hay más hoteles para mostrar.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}