import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/vuelos.css';
import Layout from '../components/common/layout';

const Flights = () => {
  const [user, setUser] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !currentUser.emailVerified) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
      const res = await fetch(`/api/aeropuertos?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.slice(0, 10));
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
    try {
      const fromCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
      const toCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;
      navigate(`/resultadoVuelos/${fromCode}/${toCode}/${departureDate}/${returnDate || departureDate}`);
    } catch (error) {
      console.error("🚨 Error al buscar vuelos:", error);
      alert("🚨 Error al buscar vuelos");
    }
  };

  return (
    <Layout>
      <div>
        <h1>Millones de vuelos baratos. Una sencilla búsqueda.</h1>
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
                <div key={i} className="sugerencia" onClick={() => setFrom(`${s.ciudad}, ${s.pais} (${s.codigo})`)}>
                  {s.ciudad}, {s.pais} ({s.codigo})
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
                <div key={i} className="sugerencia" onClick={() => setTo(`${s.ciudad}, ${s.pais} (${s.codigo})`)}>
                  {s.ciudad}, {s.pais} ({s.codigo})
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
              value={`${passengers.adults + passengers.children} ${passengers.adults + passengers.children === 1 ? 'Adulto' : 'Viajeros'}, Turista`}
              readOnly
            />
          </div>

          {showDropdown && (
            <div className="desplegable-viajeros" id="desplegableViajeros">
              <h4>Clase de cabina</h4>
              <p><strong>Solo podemos mostrar precios en clase turista para esta búsqueda.</strong></p>
              <p style={{ fontSize: '0.85rem', color: '#444' }}>
                Indica las fechas y el destino del viaje para ver las opciones de clase business, turista prémium y primera clase.
              </p>

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
    </Layout>
  );
};

export default Flights;
