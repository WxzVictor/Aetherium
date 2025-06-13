import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/layout";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
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

const ConfirmReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vuelos = location.state?.vuelos || [];
  const pasajeros = location.state?.pasajeros || 1;
  const selectedSeatsIda = location.state?.selectedSeatsIda || [];
  const selectedSeatsVuelta = location.state?.selectedSeatsVuelta || [];
  const totalPrecio = location.state?.totalPrecio || 0;
  const asientosIda = location.state?.asientosIda || [];
  const asientosVuelta = location.state?.asientosVuelta || [];
  const clase = location.state?.clase || "economy";

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const buscarSeatId = (seatNumber, asientos) => {
    const match = asientos.find(s => s.seatNumber === seatNumber);
    return match?.seatId || null;
  };

  const confirmarReserva = async () => {
    if (!user || !user.uid) {
      alert("Debes iniciar sesión para confirmar la reserva.");
      return;
    }

    try {
      const reservas = [];

      for (const seat of selectedSeatsIda) {
        const seatId = buscarSeatId(seat, asientosIda);
        if (seatId) {
          reservas.push({
            UserId: parseInt(user.uid),
            FlightId: vuelos[0].flightId,
            SeatId: seatId
          });
        }
      }

      if (vuelos[1]) {
        for (const seat of selectedSeatsVuelta) {
          const seatId = buscarSeatId(seat, asientosVuelta);
          if (seatId) {
            reservas.push({
              UserId: parseInt(user.uid),
              FlightId: vuelos[1].flightId,
              SeatId: seatId
            });
          }
        }
      }

      for (const reserva of reservas) {
        await fetch("/api/Reservation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(reserva)
        });
      }

      alert("Reserva confirmada. Los asientos han sido bloqueados.");
      navigate("/perfilUsuario");

    } catch (err) {
      console.error("Error al confirmar reserva:", err);
      alert("Ocurrió un error al guardar tu reserva.");
    }
  };

  const multiplicador = CLASS_MULTIPLIERS[clase.toLowerCase()] || 1.0;
  const precioBaseTotalSinClase = vuelos.reduce(
    (sum, vuelo) => sum + (vuelo.price / multiplicador),
    0
  ) * pasajeros;
  const suplementoClase = ((totalPrecio * 100 - precioBaseTotalSinClase) / 100).toFixed(2);

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
            <h1>Confirmar Reserva</h1>

            {vuelos[0] && renderVueloInfo(vuelos[0], "Vuelo de ida")}
            {vuelos[1] && renderVueloInfo(vuelos[1], "Vuelo de vuelta")}

            {renderAsientos(selectedSeatsIda, "Asientos de ida")}
            {vuelos[1] && renderAsientos(selectedSeatsVuelta, "Asientos de vuelta")}

            <div className="total-precio" style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Total final: {totalPrecio.toFixed(2)} €
            </div>

            <button className="btn" onClick={confirmarReserva}>
              Confirmar Reserva
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmReservation;