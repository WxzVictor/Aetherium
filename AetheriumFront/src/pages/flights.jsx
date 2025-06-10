import React, { useState } from 'react';
import { autocompleteAirports } from '../services/flightService';
import { useNavigate } from 'react-router-dom';
import '../styles/vuelos.css';
import '../styles/cloud.css';
import Layout from '../components/common/layout';

const Flights = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [cabinClass, setCabinClass] = useState('economy');
  const navigate = useNavigate();

  const classLabels = {
    economy: 'Turista',
    business: 'Business',
    first: 'First',
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
      console.error("Error en el autocompletado:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate) {
      alert("❌ Completa origen, destino y fecha de ida");
      return;
    }
      const fromCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
      const toCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;
      navigate(`/resultadoVuelos?from=${fromCode}&to=${toCode}&departureDate=${departureDate}&returnDate=${returnDate || ''}&passengers=${passengers.adults + passengers.children}&cabinClass=${cabinClass}`);
  };

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

        <div>
          <h1>No hacen falta alas para volar, ¡solo una buena oferta!</h1>
          <div className="contenedor-formulario">
            <div className="grupo-input">
              <div className="etiqueta-pequeña">Desde</div>
              <input
                type="text"
                id="origen"
                placeholder="País, ciudad o aeropuerto"
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

            <div className="icono-intercambiar" id="botonIntercambiar" onClick={handleSwap}>↔️</div>

            <div className="grupo-input">
              <div className="etiqueta-pequeña">A</div>
              <input
                type="text"
                id="destino"
                placeholder="País, ciudad o aeropuerto"
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
              <div className="etiqueta-pequeña">Ida</div>
              <input type="date" id="fechaIda" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>

            <div className="grupo-input">
              <div className="etiqueta-pequeña">Vuelta</div>
              <input type="date" id="fechaVuelta" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </div>

            <div className="grupo-input" id="abrirDesplegable" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="etiqueta-pequeña">Viajeros y clase de cabina</div>
              <input
                type="text"
                id="infoViajeros"
                value={`${passengers.adults + passengers.children} ${passengers.adults + passengers.children === 1 ? 'Adulto' : 'Viajeros'}, ${classLabels[cabinClass]}`}
                readOnly
              />
            </div>

            {showDropdown && (
              <div className="desplegable-viajeros" id="desplegableViajeros">
                <h4>Clase de cabina</h4>
                <div className="fila-viajero">
                  <label>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="economy"
                      checked={cabinClass === 'economy'}
                      onChange={() => setCabinClass('economy')}
                    /> Turista
                  </label>
                  <label style={{ marginLeft: '1rem' }}>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="business"
                      checked={cabinClass === 'business'}
                      onChange={() => setCabinClass('business')}
                    /> Business
                  </label>
                  <label style={{ marginLeft: '1rem' }}>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="first"
                      checked={cabinClass === 'first'}
                      onChange={() => setCabinClass('first')}
                    /> First
                  </label>
                </div>

                <br />

                <div className="fila-viajero">
                  <div>
                    <strong>Adultos</strong><br /><small>18 años o más</small>
                  </div>
                  <div className="controles">
                    <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}>−</button>
                    <span id="contadorAdultos">{passengers.adults}</span>
                    <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}>+</button>
                  </div>
                </div>

                <div className="fila-viajero">
                  <div>
                    <strong>Niños</strong><br /><small>De 0 a 17 años</small>
                  </div>
                  <div className="controles">
                    <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}>−</button>
                    <span id="contadorNiños">{passengers.children}</span>
                    <button type="button" onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}>+</button>
                  </div>
                </div>

                <button className="boton-aplicar" id="botonAplicar" type="button" onClick={() => setShowDropdown(false)}>Aplicar</button>
              </div>
            )}

            <div className="grupo-input grupo-checkbox">
              <input type="checkbox" id="buscarHotel" />
              <label htmlFor="buscarHotel">¿Buscar hotel también?</label>
            </div>

            <button className="boton-buscar" type="submit" onClick={handleSearch}>Buscar</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Flights;
