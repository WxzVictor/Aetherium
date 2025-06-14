import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/layout";
import { buscarVuelosYHoteles } from "../services/searchService";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/ResultadoVuelos.css";
import "../styles/cloud.css";

const ResultadoVuelosHotel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const pasajeros = parseInt(params.get("passengers") || "1");
    const clase = params.get("cabinClass") || "economy";

    const [loading, setLoading] = useState(true);
    const [combos, setCombos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState(null);

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

    const combosPerPage = 3;
    const indexOfLastCombo = currentPage * combosPerPage;
    const indexOfFirstCombo = indexOfLastCombo - combosPerPage;
    const currentCombos = combos.slice(indexOfFirstCombo, indexOfLastCombo);
    const totalPages = Math.ceil(combos.length / combosPerPage);

    useEffect(() => {
        const departureDate = params.get("departureDate");
        const returnDate = params.get("returnDate");

        const origin = params.get("from");
        const destination = params.get("to");
        if (!origin || !destination || !departureDate) {
            setCombos([]);
            setLoading(false);
            return;
        }

        const searchData = {
            Origin: origin,
            Destination: destination,
            DepartureDate: new Date(departureDate).toISOString(),
            ReturnDate: returnDate ? new Date(returnDate).toISOString() : null,
            Passengers: pasajeros,
            CabinClass: clase,
            IncludeHotels: true,
        };

        buscarVuelosYHoteles(searchData)
            .then((data) => {
                const vuelosIda = data.flights?.outFlights || [];
                const vuelosVuelta = data.flights?.returnFlights || [];
                const hoteles = data.hotels?.hotels || [];
                const combosGenerados = [];

                if (vuelosVuelta.length > 0) {
                    vuelosIda.forEach((vueloIda) => {
                        vuelosVuelta.forEach((vueloVuelta) => {
                            hoteles.forEach((hotel) => {
                                combosGenerados.push({ vuelos: [vueloIda, vueloVuelta], hotel });
                            });
                        });
                    });
                } else {
                    vuelosIda.forEach((vuelo) => {
                        hoteles.forEach((hotel) => {
                            combosGenerados.push({ vuelos: [vuelo], hotel });
                        });
                    });
                }

                setCombos(combosGenerados);
                setLoading(false);
            })
            .catch(() => {
                setCombos([]);
                setLoading(false);
            });
    }, [location.search]);

    const CLASS_MULTIPLIERS = {
        economy: 1.0,
        business: 1.5,
        first: 2.0,
    };

    const multiplicador = Number(CLASS_MULTIPLIERS[clase.toLowerCase()] || 1.0);

    const formatDate = (datetime) => {
        if (!datetime) return "";
        return new Date(datetime).toLocaleDateString();
    };

    const renderComboCard = (combo, idx) => {
        const precioVuelosBase = combo.vuelos.reduce((acc, v) => acc + v.price, 0);
        const precioVuelosConClase = (precioVuelosBase * multiplicador) / 100;
        const precioHotel = combo.hotel.pricePerNight / 100;
        const totalCombo = (precioVuelosConClase + precioHotel).toFixed(2);

        return (
            <div className="combo-card" key={idx}>
                <div className="combo-vuelo">
                    <h3>Vuelo</h3>
                    {combo.vuelos.map((vuelo, i) => {
                        const suplemento = vuelo.price * (multiplicador - 1);
                        const suplementoEuro = (suplemento / 100).toFixed(2);

                        return (
                            <div className="card" key={i}>
                                <strong>{vuelo.airlineName}</strong>
                                <div>{vuelo.departureAirport.city} ({vuelo.departureAirport.code}) → {vuelo.arrivalAirport.city} ({vuelo.arrivalAirport.code})</div>
                                <div>Salida: {formatDate(vuelo.departureTime)} {new Date(vuelo.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                                <div>Llegada: {formatDate(vuelo.arrivalTime)} {new Date(vuelo.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                                <div>Precio vuelo: {(vuelo.price / 100).toFixed(2)} €</div>
                                {multiplicador > 1 && (
                                    <div>Clase {clase.charAt(0).toUpperCase() + clase.slice(1)}: +{suplementoEuro} €</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="combo-hotel">
                    <h3>Hotel</h3>
                    <div className="card hotel-card">
                        <strong>{combo.hotel.hotelName}</strong>
                        <div>
                            Ubicación: {combo.hotel.city}, {combo.hotel.country}
                        </div>
                        <div>Dirección: {combo.hotel.address}</div>
                        <div>
                            Estrellas:{" "}
                            {"★".repeat(Math.min(5, Math.floor(combo.hotel.rating / 10))).padEnd(5, "☆")}
                        </div>
                        <div>Precio por noche: {precioHotel.toFixed(2)} €</div>
                        <div>Check-in: {formatDate(combo.hotel.checkInTime)}</div>
                        <div>Check-out: {formatDate(combo.hotel.checkOutTime)}</div>
                    </div>
                </div>

                <div className="combo-precio precio">
                    <div className="monto">
                        Total vuelo + hotel (clase {clase}): {totalCombo} €
                    </div>

                    <button
                        className="btn-rV"
                        onClick={() => {
                            if (!user) {
                                navigate("/login", {
                                    state: {
                                        combo: {
                                            vuelos: combo.vuelos,
                                            pasajeros: pasajeros,
                                            hotel: combo.hotel,
                                            clase: clase,
                                            totalPrecio: totalCombo,
                                        },
                                    },
                                });
                                return;
                            }
                            navigate("/selectSeatCombo", {
                                state: {
                                    vuelos: combo.vuelos,
                                    pasajeros: pasajeros,
                                    hotel: combo.hotel,
                                    userId: user.uid,
                                    clase: clase,
                                    totalPrecio: totalCombo,
                                },
                            });
                        }}
                    >
                        Reservar vuelo + hotel
                    </button>
                </div>
            </div>
        );
    };

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
                        <h1>Resultados de vuelo + hotel</h1>
                        {loading ? (
                            <p className="cargando" data-text="Cargando resultados...">
                                Cargando resultados...
                            </p>
                        ) : (
                            <div className="resultado-vuelos">
                                {currentCombos.length === 0 ? (
                                    <p>No se encontraron combinaciones de vuelo + hotel.</p>
                                ) : (
                                    currentCombos.map((combo, idx) => renderComboCard(combo, indexOfFirstCombo + idx))
                                )}
                                {totalPages > 1 && (
                                    <div className="paginacion">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>
                                        <span>
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ResultadoVuelosHotel;