    import React, { useEffect, useState } from "react";
    import { useLocation } from "react-router-dom";
    import { useTranslation } from 'react-i18next';
    import { searchFlights } from "../services/flightService";
    import Layout from "../components/common/layout";
    import "../styles/ResultadoVuelos.css";
    import "../styles/cloud.css"; 

    const ResultadoVuelos = () => {
    const location = useLocation();
    const { t } = useTranslation('resultadoVuelos');

    const [loading, setLoading] = useState(true);
    const [outFlights, setOutFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchData = {
        Origin: params.get("from"),
        Destination: params.get("to"),
        DepartureDate: params.get("departureDate"),
        ReturnDate: params.get("returnDate") || null,
        Passengers: parseInt(params.get("passengers") || "1"),
        CabinClass: params.get("cabinClass") || "economy"
        };

        searchFlights(searchData)
        .then(data => {
            setOutFlights(data.outFlights || []);
            setReturnFlights(data.returnFlights || []);
            setLoading(false);
        })
        .catch(() => {
            setOutFlights([]);
            setReturnFlights([]);
            setLoading(false);
        });
    }, [location.search]);

    const formatDate = (datetime) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(datetime).toLocaleDateString(undefined, options);
    };


    const renderFlightCard = (vuelo) => (
    <div className="card" key={vuelo.flightId || Math.random()}>
        <div className="info">
        <strong>{vuelo.airlineName}</strong>
        <div className="fecha-vuelo" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
            {formatDate(vuelo.departureTime)}
        </div>
        <div className="horarios">
            <div className="hora-bloque">
            <div className="hora">
                {new Date(vuelo.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="ciudad">
                {`${vuelo.departureAirport.city} (${vuelo.departureAirport.code})`}
            </div>
            </div>
            <div className="duracion">
            ✈ <span className="directo">{t('direct')}</span>
            </div>
            <div className="hora-bloque">
            <div className="hora">
                {new Date(vuelo.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="ciudad">
                {`${vuelo.arrivalAirport.city} (${vuelo.arrivalAirport.code})`}
            </div>
            </div>
        </div>
        <div className="duracion-texto">
            {t('duration')}: {Math.floor(vuelo.durationMinutes / 60)} h {vuelo.durationMinutes % 60} min
        </div>
        </div>
        <div className="precio">
        <div className="monto">{vuelo.price/100} €</div>
        <button className="btn">{t('book')}</button>
        </div>
    </div>
    );


    return (
        <Layout>
        {/* Fondo de nubes */}
        <div id="clouds">
            {[...Array(7)].map((_, i) => (
            <div key={i} className={`cloud x${i + 1}`}></div>
            ))}
        </div>
        <div className="contenido-visible">
            
        <div className="resultado-vuelos-container">
            <h1>{t('title')}</h1>

            {loading ? (
            <p className="cargando" data-text="Cargando vuelos...">{t('loading')}</p>
            ) : (
            <>
                <section>
                <h2>
                    {t('outbound')}
                </h2>
                <div className="resultado-vuelos">
                    {outFlights.length === 0 ? <p>{t('noOutbound')}</p> : outFlights.map(renderFlightCard)}
                </div>
                </section>

                <section style={{ marginTop: '2rem' }}>
                    <h2>
                    {t('return')}
                    </h2>
                    <div className="resultado-vuelos">
                    {returnFlights.length === 0 ? <p>{t('noReturn')}</p> : returnFlights.map(renderFlightCard)}
                    </div>
                </section>
            </>
            )}
        </div>
        </div>  
        </Layout>
    );
    };

    export default ResultadoVuelos;
