import { useEffect, useState } from "react";
import "./../styles/vuelos.css";
import { searchFlights } from "../services/flightService";
import { useLocation } from "react-router-dom";
import Layout from "../components/common/layout";
import '../styles/resultadoVuelos.css';

function FlightCard({ vuelo }) {
    return (
        <div className="card">
            <div className="info">
                <span><strong>{vuelo.airlineName}</strong></span>
                <div className="horarios">
                    <div className="hora-bloque">
                        <div className="hora">{new Date(vuelo.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        <div className="ciudad">{`${vuelo.departureAirport.city} (${vuelo.departureAirport.code})`}</div>
                    </div>
                    <div className="duracion">
                        {/* Puedes añadir aquí el icono ✈ o info de directo si lo deseas */}
                    </div>
                    <div className="hora-bloque">
                        <div className="hora">{new Date(vuelo.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        <div className="ciudad">{`${vuelo.arrivalAirport.city} (${vuelo.arrivalAirport.code})`}</div>
                    </div>
                </div>
                <div className="duracion-texto">
                    Duración: {Math.floor(vuelo.durationMinutes / 60)} h {vuelo.durationMinutes % 60} min
                </div>
            </div>
            <div className="precio">
                <div className="monto">{vuelo.price} €</div>
                {/* <button className="btn">Reservar</button> Si quieres el botón */}
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
