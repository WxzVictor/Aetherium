import React, { useState, useEffect } from 'react';
import { auth } from '../../services/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../../styles/vuelos.css';
import logo from '../../assets/images/logo.png';

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate) {
      alert("❌ Por favor completa origen, destino y fecha de ida");
      return;
    }
    try {
      const fromCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
      const toCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;
      navigate(`/resultadoVuelos/${fromCode}/${toCode}/${departureDate}/${returnDate || departureDate}`);
    } catch (error) {
      alert("🚨 Error al buscar vuelos");
      console.error("Error en la búsqueda de vuelos:", error);
    }
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

  return (
    <div>
      <h1>Millones de vuelos baratos. Una sencilla búsqueda.</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="input-group">
          <div className="small-label">Desde</div>
          <input
            type="text"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              handleAutocomplete(e.target.value, setSuggestionsFrom);
            }}
            placeholder="País, ciudad o aeropuerto"
            autoComplete="off"
          />
          <div className="dropdown-suggestions">
            {suggestionsFrom.map((s, i) => (
              <div key={i} className="suggestion" onClick={() => setFrom(`${s.city}, ${s.country} (${s.code})`)}>
                {s.city}, {s.country} ({s.code})
              </div>
            ))}
          </div>
        </div>

        <div className="swap-icon" onClick={handleSwap}>↔️</div>

        <div className="input-group">
          <div className="small-label">A</div>
          <input
            type="text"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              handleAutocomplete(e.target.value, setSuggestionsTo);
            }}
            placeholder="País, ciudad o aeropuerto"
            autoComplete="off"
          />
          <div className="dropdown-suggestions">
            {suggestionsTo.map((s, i) => (
              <div key={i} className="suggestion" onClick={() => setTo(`${s.city}, ${s.country} (${s.code})`)}>
                {s.city}, {s.country} ({s.code})
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <div className="small-label">Ida</div>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
        </div>

        <div className="input-group">
          <div className="small-label">Vuelta</div>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
        </div>

        <div className="input-group" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="small-label">Viajeros y clase de cabina</div>
          <input type="text" value={`${passengers.adults + passengers.children} Viajero${passengers.adults + passengers.children > 1 ? 's' : ''}, Turista`} readOnly />
        </div>

        {showDropdown && (
          <div className="dropdown-passengers">
            <h4>Clase de cabina</h4>
            <p><strong>Solo podemos mostrar precios en clase turista para esta búsqueda.</strong></p>
            <p style={{ fontSize: '0.85rem', color: '#444' }}>Indica las fechas y el destino del viaje para ver las opciones de clase business, turista prémium y primera clase.</p>
            <div className="row-passenger">
              <div><strong>Adultos</strong><br/><small>18 años o más</small></div>
              <div className="controls">
                <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}>−</button>
                <span>{passengers.adults}</span>
                <button type="button" onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}>+</button>
              </div>
            </div>
            <div className="row-passenger">
              <div><strong>Niños</strong><br/><small>Menores de 18 años</small></div>
              <div className="controls">
                <button type="button" onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}>−</button>
                <span>{passengers.children}</span>
                <button type="button" onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}>+</button>
              </div>
            </div>
            <button type="button" onClick={() => setShowDropdown(false)}>Aplicar</button>
          </div>
        )}

        <div className="input-group checkbox-group">
          <input type="checkbox" id="searchHotel" />
          <label htmlFor="searchHotel">¿Buscar hotel también?</label>
        </div>

        <button className="search-button" type="submit">Buscar</button>
      </form>
    </div>
  );
};

export default Flights;