import React, { useState } from 'react';
import { autocompleteAirports } from '../services/flightService';
import { searchFlights } from '../services/flightService';
import { getAvailableSeats } from '../services/flightService';
//import { useNavigate } from 'react-router-dom';
import '../styles/vuelos.css';
import '../styles/cloud.css';
import Layout from '../components/common/layout';

const Flights = () => {
  const { t } = useTranslation('flights');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [cabinClass, setCabinClass] = useState('turista');
  const [searchResults, setSearchResults] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  //const navigate = useNavigate();

  const classLabels = {
    turista: t('class.turista'),
    business: t('class.business'),
    first: t('class.first'),
  };

  const handleSwap = () => {
    setFrom((prev) => {
      const temp = to;
      setTo(prev);
      return temp;
    });
  };

  const handleAutocomplete = async (query, setResults) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    try {
      const data = await autocompleteAirports(query);
      console.log("Resultados de autocompletado:", data);
      setResults(data.slice(0, 5));
    } catch (error) {
      console.error(t('error.autocomplete'), error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate) {
      alert(t('error.completeFields'));
      return;
    }
    try {
      const fromCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
      const toCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;
      const searchData = {
        Origin: fromCode,
        Destination: toCode,
        DepartureDate: departureDate,
        ReturnDate: returnDate || null,
        Passengers: passengers.adults + passengers.children,
        CabinClass: cabinClass,
      };
      const data = await searchFlights(searchData);
      setSearchResults(data);
    } catch (error) {
      console.error(t('error.searchError'), error);
      alert(t('error.searchError'));
    }
  };

  const handleShowSeats = async (flightId) => {
    try {
      setSelectedFlight(flightId);
      const data = await getAvailableSeats(flightId);
      setAvailableSeats(data);
    } catch (error) {
      console.error("🚨 Error al obtener asientos disponibles:", error);
      alert("🚨 Error al obtener asientos disponibles");
      setAvailableSeats(null);
    }
  }

  return (
    <Layout>
      <div className="login-page">
        <div id="clouds">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`cloud x${i + 1}`}></div>
          ))}
        </div>

        <div>
          <h1>{t('title')}</h1>
          <div className="contenedor-formulario">
            <div className="grupo-input">
              <div className="etiqueta-pequeña">{t('labels.from')}</div>
              <input
                type="text"
                id="origen"
                placeholder={t('labels.city')}
                autoComplete="off"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  handleAutocomplete(e.target.value, setSuggestionsFrom);
                }}
              />
              <div className="dropdown-sugerencias" id="sugerenciasOrigen">
                {suggestionsFrom.map((s, i) => (
                  <div key={i} className="sugerencia" onClick={() => setFrom(`${s.city}, ${s.airportName} (${s.code})`)}>
                    {s.city}, {s.airportName} ({s.code})
                  </div>
                ))}
              </div>
            </div>

            <div className="icono-intercambiar" id="botonIntercambiar" onClick={handleSwap}>
              ↔️
            </div>

            <div className="grupo-input">
              <div className="etiqueta-pequeña">{t('labels.to')}</div>
              <input
                type="text"
                id="destino"
                placeholder={t('labels.city')}
                autoComplete="off"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  handleAutocomplete(e.target.value, setSuggestionsTo);
                }}
              />
              <div className="dropdown-sugerencias" id="sugerenciasDestino">
                {suggestionsTo.map((s, i) => (
                  <div key={i} className="sugerencia" onClick={() => setTo(`${s.city}, ${s.airportName} (${s.code})`)}>
                    {s.city}, {s.airportName} ({s.code})
                  </div>
                ))}
              </div>
            </div>

            <div className="grupo-input">
              <div className="etiqueta-pequeña">{t('labels.departure')}</div>
              <input
                type="date"
                id="fechaIda"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>

            <div className="grupo-input">
              <div className="etiqueta-pequeña">{t('labels.return')}</div>
              <input
                type="date"
                id="fechaVuelta"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div
              className="grupo-input"
              id="abrirDesplegable"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="etiqueta-pequeña">{t('labels.passengersAndClass')}</div>
              <input
                type="text"
                id="infoViajeros"
                value={`${passengers.adults + passengers.children} ${passengers.adults + passengers.children === 1 ? 'Adulto' : 'Viajeros'
                  }, ${classLabels[cabinClass]}`}
                readOnly
              />
            </div>

            {showDropdown && (
              <div className="desplegable-viajeros" id="desplegableViajeros">
                <h4>{t('labels.cabinClass')}</h4>
                <div className="fila-viajero">
                  <label>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="turista"
                      checked={cabinClass === 'turista'}
                      onChange={() => setCabinClass('turista')}
                    />{' '}
                    {t('class.turista')}
                  </label>
                  <label style={{ marginLeft: '1rem' }}>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="business"
                      checked={cabinClass === 'business'}
                      onChange={() => setCabinClass('business')}
                    />{' '}
                    {t('class.business')}
                  </label>
                  <label style={{ marginLeft: '1rem' }}>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="first"
                      checked={cabinClass === 'first'}
                      onChange={() => setCabinClass('first')}
                    />{' '}
                    {t('class.first')}
                  </label>
                </div>

                <br />

                <div className="fila-viajero">
                  <div>
                    <strong>{t('labels.adults')}</strong>
                    <br />
                    <small>{t('labels.adultsDesc')}</small>
                  </div>
                  <div className="controles">
                    <button
                      type="button"
                      onClick={() =>
                        setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))
                      }
                    >
                      −
                    </button>
                    <span id="contadorAdultos">{passengers.adults}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="fila-viajero">
                  <div>
                    <strong>{t('labels.children')}</strong>
                    <br />
                    <small>{t('labels.childrenDesc')}</small>
                  </div>
                  <div className="controles">
                    <button
                      type="button"
                      onClick={() =>
                        setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))
                      }
                    >
                      −
                    </button>
                    <span id="contadorNiños">{passengers.children}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="boton-aplicar"
                  id="botonAplicar"
                  type="button"
                  onClick={() => setShowDropdown(false)}
                >
                  {t('buttons.apply')}
                </button>
              </div>
            )}

            <div className="grupo-input grupo-checkbox">
              <input type="checkbox" id="buscarHotel" />
              <label htmlFor="buscarHotel">{t('labels.searchHotel')}</label>
            </div>

            <button className="boton-buscar" type="submit" onClick={handleSearch}>
              {t('buttons.search')}
            </button>
          </div>

          {searchResults && (
            <div>
              <h2>Vuelos encontrados</h2>
              <ul>
                {searchResults.outFlights.map(f => (
                  <li
                    key={f.flightId}
                    onClick={() => handleShowSeats(f.flightId)}
                    style={{ cursor: 'pointer' }}
                  >
                    {f.airlineName} - {f.flightCode} - {f.departureTime}
                    {/*Mostrar asientos si el vuelo esta seleccionado*/}
                    {selectedFlight === f.flightId && availableSeats && (
                      <div>
                        <strong>Asientos disponibles:</strong>
                        <ul>
                          {availableSeats.availableSeats.map(seat => (
                            <li key={seat.seatId}>
                              {seat.seatNumber} ({seat.seatClass}, {seat.seatType})
                            </li>
                          ))}
                        </ul>
                        <div>Total: {availableSeats.totalSeats}</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Flights;
