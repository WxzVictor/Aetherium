import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/layout";

const ConfirmReservation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [vuelo, setVuelo] = useState(location.state?.vuelo || null);
    const [checking, setChecking] = useState(!location.state?.vuelo);

    useEffect(() => {
        if (!vuelo && checking) {
            const vueloPendiente = sessionStorage.getItem('vueloPendiente');
            if (vueloPendiente) {
                setVuelo(JSON.parse(vueloPendiente));
                sessionStorage.removeItem('vueloPendiente');
            }
            setChecking(false);
        } else if (!vuelo && !checking) {
            navigate("/resultadoVuelos");
        }
    }, [vuelo, checking, navigate]);

    if (!vuelo || checking) return null;

    return (
        <Layout>
            <div className="login-page">
                <div id="clouds">
                    <div className="cloud x1"></div>
                    <div className="cloud x2"></div>
                    <div className="cloud x3"></div>
                    <div className="cloud x4"></div>
                    <div className="cloud x5"></div>
                    <div className="cloud x6"></div>
                    <div className="cloud x7"></div>
                </div>
                <div className="resultado-vuelos-container">
                    <h1>Confirmar Reserva</h1>
                    <div className="card">
                        <div className="info">
                            <strong>{vuelo.airlineName}</strong>
                            <div>
                                {vuelo.departureAirport.city} ({vuelo.departureAirport.code}) → {vuelo.arrivalAirport.city} ({vuelo.arrivalAirport.code})
                            </div>
                            <div>
                                Salida: {new Date(vuelo.departureTime).toLocaleString()}
                            </div>
                            <div>
                                Llegada: {new Date(vuelo.arrivalTime).toLocaleString()}
                            </div>
                            <div>
                                Precio: {vuelo.price / 100} €
                            </div>
                        </div>
                    </div>
                    <button className="btn" style={{ marginTop: "2rem" }}>Confirmar Reserva</button>
                </div>
            </div>
        </Layout>
    );
};

export default ConfirmReservation;