import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/selectSeat.css";
import Layout from "../components/common/layout";

const SelectSeatCombo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vuelos = location.state?.vuelos || [];
  const pasajeros = location.state?.pasajeros || 1;
  const clase = location.state?.clase || "economy";
  const totalBaseOriginal = parseFloat(location.state?.totalPrecio || "0");
  const hotel = location.state?.hotel;

  useEffect(() => {
    if (!location.state?.vuelos || !location.state?.pasajeros || !hotel) {
      navigate('/');
    }
  }, []);
  const userId = localStorage.getItem("userId");

  const [asientosIda, setAsientosIda] = useState([]);
  const [asientosVuelta, setAsientosVuelta] = useState([]);
  const [selectedSeatsIda, setSelectedSeatsIda] = useState([]);
  const [selectedSeatsVuelta, setSelectedSeatsVuelta] = useState([]);

  useEffect(() => {
    if (vuelos.length === 0) return;

    // Ida
    fetch(`/api/Flight/${vuelos[0].flightId}/available-seats`)
      .then(res => res.json())
      .then(data => {
        const unicos = Array.from(new Map((data.availableSeats || []).map(seat => [seat.seatNumber, seat])).values());
        setAsientosIda(unicos);
      });

    // Vuelta si existe
    if (vuelos[1]) {
      fetch(`/api/Flight/${vuelos[1].flightId}/available-seats`)
        .then(res => res.json())
        .then(data => {
          const unicos = Array.from(new Map((data.availableSeats || []).map(seat => [seat.seatNumber, seat])).values());
          setAsientosVuelta(unicos);
        });
    }
  }, [vuelos]);

  const handleSeatClick = (seatNumber, setSelectedSeats) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : prev.length < pasajeros
          ? [...prev, seatNumber]
          : prev
    );
  };

  const renderSeatGrid = (seats, selectedSeats, setSelectedSeats, flightIndex) => {
    if (!seats || seats.length === 0) return <div>Cargando asientos...</div>;

    const seatMap = {};
    seats.forEach(seat => {
      const row = seat.seatNumber[0];
      seatMap[row] = seatMap[row] || [];
      seatMap[row].push(seat);
    });

    const sortedRows = Object.keys(seatMap).sort();

    return (
      <div className="seat-grid">
        {sortedRows.map(row => (
          <div className="seat-row" key={`${flightIndex}-${row}`}>
            <span className="row-label">{row}</span>
            {seatMap[row]
              .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)))
              .map(seat => {
                const isSelected = selectedSeats.includes(seat.seatNumber);
                const isUnavailable = seat.seatStatus === true;

                return (
                  <button
                    key={`${flightIndex}-${seat.seatNumber}`}
                    className={`seat ${isSelected ? "selected" : ""} ${isUnavailable ? "disabled" : ""}`}
                    onClick={() => !isUnavailable && handleSeatClick(seat.seatNumber, setSelectedSeats, selectedSeats)}
                    disabled={isUnavailable}
                    title={isUnavailable ? "Ocupado" : "Disponible"}
                  >
                    {isUnavailable ? "❌" : seat.seatNumber}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    );
  };

  const obtenerPrecioExtra = (seatNumber) => {
    const num = seatNumber.slice(1);
    if (num === "1" || num === "3") return 15; // Ventanilla
    if (num === "2") return 10;                // Pasillo
    return 0;
  };

  const calcularSuplementoTotal = (selectedSeats) => {
    return selectedSeats.reduce((total, seat) => total + obtenerPrecioExtra(seat), 0);
  };

  // Precio base total por todos los pasajeros
  const precioBase = vuelos.reduce((total, vuelo) => total + vuelo.price, 0);
  const totalBase = totalBaseOriginal;

  const suplementoTotal = calcularSuplementoTotal(selectedSeatsIda) + calcularSuplementoTotal(selectedSeatsVuelta);
  const precioFinal = totalBase + suplementoTotal;

  return (
    <Layout>
      <div className="login-page">
        <div id="clouds">
          {[...Array(7)].map((_, i) => (
            <div className={`cloud x${i + 1}`} key={i}></div>
          ))}
        </div>

        <div className="contenedor-visible-sS">
          <div className="seat-picker">
            <h2>Selecciona tu asiento de ida</h2>
            {renderSeatGrid(asientosIda, selectedSeatsIda, setSelectedSeatsIda, 0)}
            {selectedSeatsIda.length > 0 && (
              <div className="selection-info">
                Asientos seleccionados de ida: {selectedSeatsIda.join(", ")}
              </div>
            )}

            {vuelos[1] && (
              <>
                <h2 style={{ marginTop: "2rem" }}>Selecciona tu asiento de vuelta</h2>
                {renderSeatGrid(asientosVuelta, selectedSeatsVuelta, setSelectedSeatsVuelta, 1)}
                {selectedSeatsVuelta.length > 0 && (
                  <div className="selection-info">
                    Asientos seleccionados de vuelta: {selectedSeatsVuelta.join(", ")}
                  </div>
                )}
              </>
            )}

            <div className="legend-seat-prices">
              <strong>Suplemento por tipo de asiento:</strong>
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                <li><strong>Ventanilla:</strong> 15 €</li>
                <li><strong>Pasillo:</strong> 10 €</li>
              </ul>
            </div>

            <div className="total-precio">
              Precio total actualizado: {precioFinal.toFixed(2)} €
            </div>

            <button
              className="btn"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                if (selectedSeatsIda.length !== pasajeros) {
                  alert(`Selecciona ${pasajeros} asiento(s) para el vuelo de ida.`);
                  return;
                }

                if (vuelos[1] && selectedSeatsVuelta.length !== pasajeros) {
                  alert(`Selecciona ${pasajeros} asiento(s) para el vuelo de vuelta.`);
                  return;
                }

                navigate("/confirmReservationCombo", {
                  state: {
                    vuelos,
                    selectedSeatsIda,
                    selectedSeatsVuelta,
                    totalPrecio: precioFinal,
                    asientosIda,
                    asientosVuelta,
                    userId,
                    clase,
                    hotel
                  }
                });
              }}
            >
              Confirmar asientos
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectSeatCombo;