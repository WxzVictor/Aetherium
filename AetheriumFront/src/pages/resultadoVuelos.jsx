import { useEffect, useState } from "react";
import "./../styles/vuelos.css";
import { searchFlights } from "../services/flightService";
import { useLocation } from "react-router-dom";
import Layout from "../components/common/layout";

function FlightCard({ vuelo }) {
    return (
        <div className="flight-card-horizontal">
            <div className="trayecto">
                {vuelo.departureAirport.city} ({vuelo.departureAirport.code}) → {vuelo.arrivalAirport.city} ({vuelo.arrivalAirport.code})
            </div>
            <div className="info">
                <span>Salida: {new Date(vuelo.departureTime).toLocaleString()}</span>
                <span>Llegada: {new Date(vuelo.arrivalTime).toLocaleString()}</span>
                <span>Duracion: {vuelo.durationMinutes} min</span>
                <span>Precio: {vuelo.price} €</span>
                <span>Aerolinea: {vuelo.airlineName}</span>
            </div>
        </div>
    );
}

export default function ResultadoVuelos() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchData = {
            Origin: params.get("from"),
            Destination: params.get("to"),
            DepartureDate: params.get("departureDate"),
            ReturnDate: params.get("returnDate") || null,
            Passengers: params.get("passengers") ? parseInt(params.get("passengers")) : 1,
            CabinClass: params.get("cabinClass") || "economy"
        };
        setLoading(true);
        searchFlights(searchData)
            .then(data => {
                setFlights(data.outFlights || []);
                setLoading(false);
            })
            .catch(() => {
                setFlights([]);
                setLoading(false);
            });
    }, [location.search]);

    return (
        <Layout>
            <div className="login-page">
                <div id="clouds">
                    {[...Array(7)].map((_, i) => (
                        <div className={`cloud x${i + 1}`} key={i}></div>
                    ))}
                </div>

                <div>
                    <h1>Resultados de Vuelos</h1>
                    <div className="contenedor-formulario">
                        <div className="resultado-vuelos">
                            {loading ? (
                                <p className="cargando" data-text="Cargando vuelos...">Cargando vuelos...</p>
                            ) : flights.length === 0 ? (
                                <p>No se han encontrado vuelos para tu búsqueda.</p>
                            ) : (
                                <div className="resultado-vuelos">
                                    {flights.map((vuelo) => (
                                        <FlightCard key={vuelo.flightId} vuelo={vuelo} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
