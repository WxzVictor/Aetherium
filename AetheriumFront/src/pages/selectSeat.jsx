import React, { useEffect, useState } from "react";
import "../styles/selectSeat.css";
import Layout from "../components/common/layout";

const fakeSeatData = [
  { seatNumber: "A1", seatClass: "economy", seatType: "window", seatStatus: false },
  { seatNumber: "A2", seatClass: "first", seatType: "middle", seatStatus: true },
  { seatNumber: "A3", seatClass: "economy", seatType: "aisle", seatStatus: false },
  { seatNumber: "B1", seatClass: "economy", seatType: "window", seatStatus: false },
  { seatNumber: "B2", seatClass: "economy", seatType: "middle", seatStatus: false },
  { seatNumber: "B3", seatClass: "economy", seatType: "aisle", seatStatus: true },
  { seatNumber: "C1", seatClass: "economy", seatType: "window", seatStatus: false },
  { seatNumber: "C2", seatClass: "economy", seatType: "middle", seatStatus: false },
  { seatNumber: "C3", seatClass: "economy", seatType: "aisle", seatStatus: false },
];

const SelectSeat = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    // Simular llamada a API
    setTimeout(() => {
      setSeats(fakeSeatData);
    }, 500);
  }, []);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeat(seatNumber);
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeat === seat.seatNumber;
    const isUnavailable = seat.seatStatus === true;

    return (
      <button
        key={seat.seatNumber}
        className={`seat ${isSelected ? "selected" : ""} ${isUnavailable ? "disabled" : ""}`}
        onClick={() => !isUnavailable && handleSeatClick(seat.seatNumber)}
        disabled={isUnavailable}
      >
        {seat.seatNumber}
      </button>
    );
  };

  const seatMap = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber[0];
    seatMap[row] = seatMap[row] || [];
    seatMap[row].push(seat);
  });

  const sortedRows = Object.keys(seatMap).sort();

  return (
    <Layout>
        
    <div className="contenedor-visible">
    <div className="seat-picker">
      <h2>Selecciona tu asiento</h2>
      <div className="seat-grid">
        {sortedRows.map((row) => (
          <div className="seat-row" key={row}>
            <span className="row-label">{row}</span>
            {seatMap[row]
              .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)))
              .map(renderSeat)}
          </div>
        ))}
      </div>
      {selectedSeat && (
        <div className="selection-info">Asiento seleccionado: {selectedSeat}</div>
      )}
    </div>
    </div>
    
    </Layout>
  );
};

export default SelectSeat;
