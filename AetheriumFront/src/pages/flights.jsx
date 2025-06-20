import React, { useState } from 'react';
import { autocompleteAirports } from '../services/flightService';
import { useNavigate } from 'react-router-dom';
import '../styles/vuelos.css';
import '../styles/cloud.css';
import Layout from '../components/common/layout';
import { useTranslation } from 'react-i18next';

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
  const [buscarHotel, setBuscarHotel] = useState(false);
  const [cabinClass, setCabinClass] = useState('economy');
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minVuelta = tomorrow.toISOString().split("T")[0];

  const classLabels = {
    economy: 'Turista',
    business: 'Business',
    first: 'First',
  };

  const CLASS_MULTIPLIERS = {
    economy: 1.0,
    business: 1.5,
    first: 2.0
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
      setResults(data.slice(0, 5));
    } catch (error) {
      console.error(t('error.autocomplete'), error);
    }
  };

  function extractCity(string) {
    return string.split(',')[0].trim();
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !departureDate) {
      alert(t('error.completeFields'));
      return;
    }

    const fromCity = extractCity(from);
    const toCity = extractCity(to);
    const totalPassengers = passengers.adults + passengers.children;
    const multiplier = CLASS_MULTIPLIERS[cabinClass];

    if (buscarHotel) {
      navigate(
        `/resultadoVuelosHotel?from=${fromCity}&to=${toCity}` +
        `&departureDate=${departureDate}` +
        `&returnDate=${returnDate || ''}` +
        `&passengers=${totalPassengers}` +
        `&cabinClass=${cabinClass}` +
        `&classMultiplier=${multiplier}`
      );
    } else {
      navigate(
        `/resultadoVuelos?from=${fromCity}&to=${toCity}` +
        `&departureDate=${departureDate}` +
        `&returnDate=${returnDate || ''}` +
        `&passengers=${totalPassengers}` +
        `&cabinClass=${cabinClass}` +
        `&classMultiplier=${multiplier}`
      );
    }
  };

  const handleKeyDownFrom = (e) => {
    if (e.key === 'Enter' && suggestionsFrom.length > 0) {
      setFrom(`${suggestionsFrom[0].city}, ${suggestionsFrom[0].airportName} (${suggestionsFrom[0].code})`);
      setSuggestionsFrom([]);
      e.preventDefault();
    }
  };
  const handleKeyDownTo = (e) => {
    if (e.key === 'Enter' && suggestionsTo.length > 0) {
      setTo(`${suggestionsTo[0].city}, ${suggestionsTo[0].airportName} (${suggestionsTo[0].code})`);
      setSuggestionsTo([]);
      e.preventDefault();
    }
  };

  return (
    <Layout>
      <div className="login-page">
        <div id="clouds">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`cloud x${i + 1}`}></div>
          ))}
        </div>
        <div>
          <button
            type="button"
            className="boton-hotel-f"
            onClick={() => navigate("/hoteles")}>
            🏨 Buscar Hoteles
          </button>
          <h1>{t('title')}</h1>
          <form className="contenedor-formulario" onSubmit={handleSearch}>
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
                onBlur={() => setTimeout(() => setSuggestionsFrom([]), 100)}
                onKeyDown={handleKeyDownFrom}
              />
              <div className="dropdown-sugerencias" id="sugerenciasOrigen">
                {suggestionsFrom.map((s, i) => (
                  <div
                    key={i}
                    className="sugerencia"
                    onClick={() => {
                      setFrom(`${s.city}, ${s.airportName} (${s.code})`);
                      setSuggestionsFrom([]);
                    }}
                  >
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
                onBlur={() => setTimeout(() => setSuggestionsTo([]), 100)}
                onKeyDown={handleKeyDownTo}
              />
              <div className="dropdown-sugerencias" id="sugerenciasDestino">
                {suggestionsTo.map((s, i) => (
                  <div
                    key={i}
                    className="sugerencia"
                    onClick={() => {
                      setTo(`${s.city}, ${s.airportName} (${s.code})`);
                      setSuggestionsTo([]);
                    }}
                  >
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
                max="2028-12-30"
                min={today}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>

            <div className="grupo-input">
              <div className="etiqueta-pequeña">{t('labels.return')} (opcional)</div>
              <input
                type="date"
                id="fechaVuelta"
                min={minVuelta}
                max="2028-12-31"
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
                value={`${passengers.adults + passengers.children} ${passengers.adults + passengers.children === 1 ? 'Adulto' : 'Viajeros'}, ${classLabels[cabinClass]}`}
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
                    /> {t('class.business')}
                  </label>
                  <label style={{ marginLeft: '1rem' }}>
                    <input
                      type="radio"
                      name="cabinClass"
                      value="first"
                      checked={cabinClass === 'first'}
                      onChange={() => setCabinClass('first')}
                    /> {t('class.first')}
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
                    >−</button>
                    <span id="contadorAdultos">{passengers.adults}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
                    >+</button>
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
                    >−</button>
                    <span id="contadorNiños">{passengers.children}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
                    >+</button>
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
              <input
                type="checkbox"
                id="buscarHotel"
                checked={buscarHotel}
                onChange={e => setBuscarHotel(e.target.checked)}
              />
              <label htmlFor="buscarHotel">{t('labels.searchHotel')}</label>
            </div>

            <button className="boton-buscar" type="submit">
              {t('buttons.search')}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Flights;