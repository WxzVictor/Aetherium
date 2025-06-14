import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { searchFlights } from "../services/flightService";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "../components/common/layout";
import "../styles/ResultadoVuelos.css";
import "../styles/cloud.css";

const ResultadoVuelos = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation('resultadoVuelos');

    const params = new URLSearchParams(location.search);
    const passengerCount = Math.max(1, parseInt(params.get("passengers") || "1"));
    const classMultiplier = parseFloat(params.get("classMultiplier") || "1.0");
    const cabinClass = params.get("cabinClass") || "economy";

    const [loading, setLoading] = useState(true);
    const [outFlights, setOutFlights] = useState([]);
    const [user, setUser] = useState(null);
    const [combinedResults, setCombinedResults] = useState([]);
    const [hasReturn, setHasReturn] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const passengerCount = Math.max(1, parseInt(params.get("passengers") || "1"));
        const returnDate = params.get("returnDate");
        const classMultiplier = parseFloat(params.get("classMultiplier") || "1.0");

        const searchData = {
            Origin: params.get("from"),
            Destination: params.get("to"),
            DepartureDate: params.get("departureDate"),
            ReturnDate: returnDate || null,
            Passengers: passengerCount,
            CabinClass: params.get("cabinClass") || "economy"
        };

        setHasReturn(returnDate !== null);

        searchFlights(searchData)
            .then(data => {
                const out = (data.outFlights || []).map(f => ({
                    ...f,
                    price: Math.round(f.price * classMultiplier)
                }));
                setOutFlights(out);

                if (returnDate && data.returnFlights?.length) {
                    const ret = data.returnFlights.map(f => ({
                        ...f,
                        price: Math.round(f.price * classMultiplier)
                    }));
                    const combinados = [];
                    out.forEach(ida => {
                        ret.forEach(vuelta => {
                            combinados.push({ ida, vuelta });
                        });
                    });
                    setCombinedResults(combinados);
                } else {
                    setCombinedResults([]);
                }

                setLoading(false);
            })
            .catch(() => {
                setOutFlights([]);
                setCombinedResults([]);
                setLoading(false);
            });
    }, [location.search]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && currentUser.emailVerified) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (datetime) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(datetime).toLocaleDateString(undefined, options);
    };

    const handleReserve = (vuelo) => {
        const state = {
            vuelos: vuelo.vuelta ? [vuelo, vuelo.vuelta] : [vuelo],
            pasajeros: passengerCount,
            clase: cabinClass
        };
        if (!user) {
            sessionStorage.setItem('vueloPendiente', JSON.stringify(vuelo));
            navigate('/login', { state: { from: '/seleccionAsientos', ...state } });
        } else {
            navigate('/seleccionAsientos', { state });
        }
    };

    const renderFlightCard = (vuelo, mostrarPrecioIndividual = true) => (
        <div className="card" key={vuelo.flightId || Math.random()}>
            <div className="info">
                <strong>{vuelo.airlineName}</strong>
                <div className="fecha-vuelo">
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

            {mostrarPrecioIndividual && (
                <div className="precio">
                    <div className="monto">{(vuelo.price / 100).toFixed(2)} €</div>
                    <button className="btn-rV" onClick={() => handleReserve(vuelo)}>{t('book')}</button>
                </div>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="login-page">
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
                                {hasReturn && combinedResults.length > 0 ? (
                                    <div className="resultado-vuelos">
                                        {combinedResults.map((par, i) => (
                                            <div key={i} className="combo-card">
                                                <p className="claseParrafo">{t('oneWay')}</p>
                                                <div className="combo-vuelo">
                                                    {renderFlightCard(par.ida, false)}
                                                    <div className="separador">⬇</div>
                                                    <p className="claseParrafo">{t('roundTrip')}</p>
                                                    {renderFlightCard(par.vuelta, false)}
                                                </div>
                                                <div className="combo-precio precio">
                                                    <div className="monto">
                                                        {t('pricePerPerson')}: {((par.ida.price + par.vuelta.price) / 100).toFixed(2)} €
                                                    </div>
                                                    <div className="monto">
                                                        {t('totalFor')} {passengerCount} {passengerCount > 1 ? t('people') : t('person')}: {(((par.ida.price + par.vuelta.price) / 100) * passengerCount).toFixed(2)} €
                                                    </div>
                                                    <button className="btn-rV" onClick={() => handleReserve({ ...par.ida, vuelta: par.vuelta })}>
                                                        {t('book')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <section>
                                        <h2>{t('outbound')}</h2>
                                        {outFlights.length === 0 ? (
                                            <p>{t('noOutbound')}</p>
                                        ) : (
                                            outFlights.map((vuelo, i) => (
                                                <div key={i} className="combo-card">
                                                    <p className="claseParrafo">{t('oneWay')}</p>
                                                    <div className="combo-vuelo">
                                                        {renderFlightCard(vuelo, false)}
                                                    </div>
                                                    <div className="combo-precio precio">
                                                        <div className="monto">
                                                            {t('pricePerPerson')}: {(vuelo.price / 100).toFixed(2)} €
                                                        </div>
                                                        <div className="monto">
                                                            {t('totalFor')} {passengerCount} {passengerCount > 1 ? t('people') : t('person')}: {((vuelo.price / 100) * passengerCount).toFixed(2)} €
                                                        </div>
                                                        <button className="btn-rV" onClick={() => handleReserve(vuelo)}>
                                                            {t('book')}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </section>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ResultadoVuelos;
