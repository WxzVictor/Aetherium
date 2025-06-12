import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/selectSeat.css";
import Layout from "../components/common/layout";

const SelectSeat = () => {
  const location = useLocation();
  const vuelo = location.state?.vuelo;
  const [asientosIda, setAsientosIda] = useState([]);
  const [asientosVuelta, setAsientosVuelta] = useState([]);
  const [selectedSeatIda, setSelectedSeatIda] = useState(null);
  const [selectedSeatVuelta, setSelectedSeatVuelta] = useState(null);

  useEffect(() => {
    if (!vuelo)
      return;

    //Asientos de ida
    fetch(`/api/Flight/${vuelo.flightId}/available-seats`)
      .then(res => res.json())
      .then(data => setAsientosIda(data));

    //Asientos de vuelta si existe
    if (vuelo.vuelta) {
      fetch(`/api/Flight/${vuelo.vuelta.flightId}/available-seats`)
        .then(res => res.json())
        .then(data => setAsientosVuelta(data));
    }
  }, [vuelo]);

  const renderSeat = (seats, selectedSeat, setSelectedSeat) => {
    if (!seats || seats.length === 0) 
      return <div>Cargando asientos...</div>

    const seatMap = {};
    seats.forEach((seat) => {
      const row = seat.seatNumber[0];
      seatMap[row] = seatMap[row] || [];
      seatMap[row].push(seat);
    });

    const sortedRows = Object.keys(seatMap).sort();

    return (
      <div className="seat-grid">
        {sortedRows.map((row) => (
          <div className="seat-row" key={row}>
            <span className="row-label">{row}</span>
            {seatMap[row]
              .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)))
              .map(seat => {
                const isSelected = selectedSeat === seat.seatNumber;
                const isUnavailable = seat.seatStatus === true;
                return (
                  <button
                    key={seat.seatNumber}
                    className={`seat ${isSelected ? "selected" : ""} ${isUnavailable ? "disabled" : ""}`}
                    onClick={() => !isUnavailable && setSelectedSeat(seat.seatNumber)}
                    disabled={isUnavailable}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="contenedor-visible">
        <div className="seat-picker">
          <h2>Selecciona tu asiento de ida</h2>
          {renderSeat(asientosIda, selectedSeatIda, setSelectedSeatIda)}
          {selectedSeatIda && (
            <div className="selection-info">Asiento de ida seleccionado: {selectedSeatIda}</div>
          )}

          {vuelo.vuelta && (
            <>
              <h2 style={{marginTop: '2rem'}}>Selecciona tu asiento de vuelta</h2>
              {renderSeat(asientosVuelta, selectedSeatVuelta, setSelectedSeatVuelta)}
              {selectedSeatVuelta && (
                <div className="selection-info">Asiento de vuelta seleccionado: {selectedSeatVuelta}</div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SelectSeat;