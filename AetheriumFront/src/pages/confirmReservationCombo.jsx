import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/layout";
import "../styles/confirmReservation.css";

const CLASS_MULTIPLIERS = {
    economy: 1.0,
    business: 1.5,
    first: 2.0
};

const obtenerTipoYPrecio = (seat) => {
    const col = seat.slice(1);
    if (col === "1" || col === "3") return { tipo: "Ventanilla", precio: 15 };
    if (col === "2") return { tipo: "Pasillo", precio: 10 };
    return { tipo: "Estándar", precio: 0 };
};

const ConfirmReservationCombo = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const vuelos = location.state?.vuelos || [];
    const pasajeros = location.state?.pasajeros || 1;
    const selectedSeatsIda = location.state?.selectedSeatsIda || [];
    const selectedSeatsVuelta = location.state?.selectedSeatsVuelta || [];
    const asientosIda = location.state?.asientosIda || [];
    const asientosVuelta = location.state?.asientosVuelta || [];
    const userId = location.state?.userId;
    const clase = location.state?.clase || "economy";
    const hotel = location.state?.hotel;
    const precioVuelos = vuelos.reduce((sum, vuelo) => sum + vuelo.price, 0) / 100;
    const precioHotel = hotel ? hotel.pricePerNight / 100 : 0;
    const totalFinal = location.state?.totalPrecio;

    const buscarSeatId = (seatNumber, asientos) => {
        const match = asientos.find(s => s.seatNumber === seatNumber);
        return match?.seatId || null;
    };

    const confirmarReserva = async () => {
        if (!userId) {
            alert("Debes iniciar sesión para confirmar la reserva.");
            return;
        }

        try {
            // Reservar asientos de ida
            for (const seatNumber of selectedSeatsIda) {
                const seatId = buscarSeatId(seatNumber, asientosIda);
                await fetch("http://localhost:5120/api/reservation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        UserId: userId,
                        FlightId: vuelos[0].flightId,
                        SeatId: seatId,
                        DateTimeOffset: new Date().toISOString()
                    })
                });
            }

            // Reservar asientos de vuelta (si hay)
            if (vuelos[1]) {
                for (const seatNumber of selectedSeatsVuelta) {
                    const seatId = buscarSeatId(seatNumber, asientosVuelta);
                    await fetch("http://localhost:5120/api/reservation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            UserId: userId,
                            FlightId: vuelos[1].flightId,
                            SeatId: seatId,
                            DateTimeOffset: new Date().toISOString()
                        })
                    });
                }
            }

            alert("Reserva de vuelo y hotel confirmada.");
            navigate("/perfilUsuario");
        } catch {
            alert("Ocurrió un error al confirmar la reserva.");
        }
    };

    const multiplicador = CLASS_MULTIPLIERS[clase.toLowerCase()] || 1.0;
    const precioBasePorPasajero = vuelos.reduce(
        (sum, vuelo) => sum + (vuelo.price / 100),
        0
    );

    const precioBaseTotal = precioBasePorPasajero * pasajeros;

    const suplementoAsientos = [
        ...selectedSeatsIda,
        ...selectedSeatsVuelta
    ].reduce((sum, seat) => sum + obtenerTipoYPrecio(seat).precio, 0);

    const suplementoClase = (
        parseFloat(totalFinal) - precioBaseTotal - suplementoAsientos - precioHotel
    ).toFixed(2);


    const renderVueloInfo = (vuelo, titulo) => (
        <div className="card" style={{ marginBottom: "1rem" }}>
            <h3>{titulo}</h3>
            <div className="info">
                <strong>{vuelo.airlineName}</strong>
                <div>{vuelo.departureAirport.city} ({vuelo.departureAirport.code}) → {vuelo.arrivalAirport.city} ({vuelo.arrivalAirport.code})</div>
                <div>Salida: {new Date(vuelo.departureTime).toLocaleString()}</div>
                <div>Llegada: {new Date(vuelo.arrivalTime).toLocaleString()}</div>
                <div>
                    Clase: {clase.charAt(0).toUpperCase() + clase.slice(1)}
                    {multiplicador > 1 && <span> ({suplementoClase} €)</span>}
                </div>
                <div>Precio por persona: {(vuelo.price / 100).toFixed(2)} €</div>
            </div>
        </div>
    );

    const renderAsientos = (asientos, titulo) => {
        const detalles = asientos.map(asiento => obtenerTipoYPrecio(asiento));
        const subtotal = detalles.reduce((sum, d) => sum + d.precio, 0);

        return (
            <div className="card">
                <h3>{titulo}</h3>
                <div className="asientos-lista">
                    {detalles.map((d, i) => (
                        <div className="asiento-item" key={i}>
                            Asiento: {asientos[i]} &nbsp;–&nbsp; {d.tipo} <span>({d.precio} €)</span>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                    Suplemento total: {subtotal.toFixed(2)} €
                </div>
            </div>
        );
    };

    const renderHotelInfo = (hotel) => (
        <div className="card" style={{ marginBottom: "1rem" }}>
            <h3>Hotel</h3>
            <div className="info">
                <strong>{hotel.hotelName}</strong>
                <div>Ubicación: {hotel.city}, {hotel.country}</div>
                <div>Dirección: {hotel.address}</div>
                <div>
                    Estrellas: {"★".repeat(Math.min(5, Math.floor(hotel.rating / 10))).padEnd(5, "☆")}
                </div>
                <div>Precio por noche: {(hotel.pricePerNight / 100).toFixed(2)} €</div>
                <div>Check-in: {hotel.checkInTime && hotel.checkInTime.split('T')[0]}</div>
                <div>Check-out: {hotel.checkOutTime && hotel.checkOutTime.split('T')[0]}</div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="login-page">
                <div id="clouds">
                    {[...Array(7)].map((_, i) => (
                        <div className={`cloud x${i + 1}`} key={i}></div>
                    ))}
                </div>

                <div className="contenedor-visible-cR">
                    <div className="resultado-vuelos-container">
                        <h1>Confirmar reserva de vuelo + hotel</h1>

                        {vuelos[0] && renderVueloInfo(vuelos[0], "Vuelo de ida")}
                        {vuelos[1] && renderVueloInfo(vuelos[1], "Vuelo de vuelta")}

                        {renderAsientos(selectedSeatsIda, "Asientos de ida")}
                        {vuelos[1] && renderAsientos(selectedSeatsVuelta, "Asientos de vuelta")}

                        {hotel && renderHotelInfo(hotel)}

                        <div className="total-precio" style={{ marginTop: "1rem", fontWeight: "bold" }}>
                            Total final: {totalFinal} €
                        </div>

                        <button className="btn" onClick={confirmarReserva}>
                            Confirmar reserva vuelo + hotel
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ConfirmReservationCombo;