import React, { useEffect, useState } from "react";
import "../styles/selectSeat.css";
import Layout from "../components/common/layout";
import { useLocation } from "react-router-dom";

const SelectSeat = () => {
  const location = useLocation();
  const vuelos = location.state?.vuelos || [];
  const pasajeros = location.state?.pasajeros || 1;

  const [selectedSeats, setSelectedSeats] = useState({});
  const [asientosPorVuelo, setAsientosPorVuelo] = useState([]); // ✅ aquí sí va

  useEffect(() => {
    // Obtener asientos de cada vuelo
    Promise.all(
      vuelos.map((vuelo) =>
        fetch(`http://localhost:5120/api/flight/${vuelo.flightId}/available-seats`)
          .then((res) => res.json())
          .then((data) => data.availableSeats || [])
      )
    ).then(setAsientosPorVuelo)
     .catch((err) => console.error("Error al cargar asientos:", err));
  }, [vuelos]);

  if (!vuelos || vuelos.length === 0) {
    return (
      <Layout>
        <div className="contenedor-visible">
          <p>No se recibieron vuelos para seleccionar asiento.</p>
        </div>
      </Layout>
    );
  }

  const handleSeatClick = (flightIndex, seatNumber) => {
    setSelectedSeats((prev) => {
      const current = prev[flightIndex] || [];
      if (current.includes(seatNumber)) {
        return {
          ...prev,
          [flightIndex]: current.filter((s) => s !== seatNumber),
        };
      }
      if (current.length >= pasajeros) return prev;
      return {
        ...prev,
        [flightIndex]: [...current, seatNumber],
      };
    });
  };

  const renderSeat = (seat, flightIndex) => {
    const isSelected = (selectedSeats[flightIndex] || []).includes(seat.seatNumber);
    const isUnavailable = seat.seatStatus === true;

    return (
      <button
        key={seat.seatNumber}
        className={`seat ${isSelected ? "selected" : ""} ${isUnavailable ? "disabled" : ""}`}
        onClick={() => !isUnavailable && handleSeatClick(flightIndex, seat.seatNumber)}
        disabled={isUnavailable}
      >
        {seat.seatNumber}
      </button>
    );
  };

  return (
    <Layout>
      <div className="contenedor-visible">
        {vuelos.map((vuelo, index) => {
          const asientos = asientosPorVuelo[index] || [];
          const seatMap = {};
          asientos.forEach((seat) => {
            const row = seat.seatNumber[0];
            seatMap[row] = seatMap[row] || [];
            seatMap[row].push(seat);
          });
          const sortedRows = Object.keys(seatMap).sort();

          return (
            <div key={index} className="seat-picker">
              <h2>Selecciona tu asiento para el vuelo {index === 0 ? "de ida" : "de regreso"}</h2>
              {selectedSeats[index]?.length > 0 && (
                <div className="selection-info">
                  Asientos seleccionados: {selectedSeats[index].join(", ")}
                </div>
              )}
              <div className="seat-grid">
                {sortedRows.map((row) => (
                  <div className="seat-row" key={row}>
                    <span className="row-label">{row}</span>
                    {seatMap[row]
                      .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)))
                      .map((seat) => renderSeat(seat, index))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default SelectSeat;