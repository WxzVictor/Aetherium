import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResultadoVuelosPrueba.css";
import Layout from '../components/common/layout';

const ResultadoVuelosPrueba = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { searchResults } = location.state || {};

  useEffect(() => {
    if (!searchResults) {
      navigate("/");
    } else {
      console.log("searchResults completos:", searchResults);
    }
  }, [searchResults, navigate]);

  if (!searchResults) return null;

  // Función auxiliar para formatear fecha (día y mes)
  const formatDate = (datetime) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(datetime).toLocaleDateString(undefined, options);
  };

  // Calcular suma total de precios vuelos de ida
  const totalIda = searchResults.outFlights.reduce((acc, vuelo) => {
    const price = Number(vuelo.price);
    if (isNaN(price) || price <= 0) {
      console.warn("Precio inválido en vuelo ida:", vuelo);
      return acc;
    }
    console.log(`Precio vuelo ida: ${price} €`);
    return acc + price;
  }, 0);

  // Calcular suma total de precios vuelos de vuelta
  const totalVuelta = (searchResults.returnFlights || []).reduce((acc, vuelo) => {
    const price = Number(vuelo.price);
    if (isNaN(price) || price <= 0) {
      console.warn("Precio inválido en vuelo vuelta:", vuelo);
      return acc;
    }
    console.log(`Precio vuelo vuelta: ${price} €`);
    return acc + price;
  }, 0);

  // Renderizar un vuelo individual
  const renderFlightCard = (vuelo) => {
    return (
      <div className="card" key={vuelo.id || Math.random()}>
        <div className="info">
          <strong>{vuelo.airlineName}</strong>
          <div className="horarios">
            <div className="hora-bloque">
              <div className="hora">{new Date(vuelo.departureTime).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</div>
              <div className="ciudad">{`${vuelo.departureAirport.city} (${vuelo.departureAirport.code})`}</div>
            </div>
            <div className="duracion">
              ✈ <span className="directo">Directo</span>
            </div>
            <div className="hora-bloque">
              <div className="hora">{new Date(vuelo.arrivalTime).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</div>
              <div className="ciudad">{`${vuelo.arrivalAirport.city} (${vuelo.arrivalAirport.code})`}</div>
            </div>
          </div>
          <div className="duracion-texto">
            Duración: {Math.floor(vuelo.durationMinutes / 60)} h {vuelo.durationMinutes % 60} min
          </div>
        </div>
        <div className="precio">
          <div className="monto">{vuelo.price} €</div>
          <button className="btn">Reservar</button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="resultado-vuelos-container">
        <h1>Resultados de la búsqueda</h1>

        {/* Mostrar totales para depuración */}
        <div style={{marginBottom: '1rem', fontWeight: 'bold'}}>
          Precio total vuelos de ida: {totalIda} € <br />
          Precio total vuelos de vuelta: {totalVuelta} €
        </div>

        {/* Vuelos de ida */}
        <section>
          <h2>Vuelos de ida - {searchResults.outFlights.length > 0 ? formatDate(searchResults.outFlights[0].departureTime) : 'No hay vuelos'}</h2>
          <div className="resultado-vuelos">
            {searchResults.outFlights.length === 0 && <p>No se encontraron vuelos de ida.</p>}
            {searchResults.outFlights.map(renderFlightCard)}
          </div>
        </section>

        {/* Vuelos de vuelta */}
        {searchResults.returnFlights && (
          <section style={{marginTop: '2rem'}}>
            <h2>Vuelos de vuelta - {searchResults.returnFlights.length > 0 ? formatDate(searchResults.returnFlights[0].departureTime) : 'No hay vuelos'}</h2>
            <div className="resultado-vuelos">
              {searchResults.returnFlights.length === 0 && <p>No se encontraron vuelos de vuelta.</p>}
              {searchResults.returnFlights.map(renderFlightCard)}
            </div>
          </section>
        )}

        {/* Debug: precios individuales en pantalla */}
        <section style={{marginTop: '2rem'}}>
          <h3>Precios individuales vuelos de ida</h3>
          <ul>
            {searchResults.outFlights.map((v, i) => (
              <li key={i}>{v.airlineName} - Precio: {v.price} €</li>
            ))}
          </ul>

          {searchResults.returnFlights && (
            <>
              <h3>Precios individuales vuelos de vuelta</h3>
              <ul>
                {searchResults.returnFlights.map((v, i) => (
                  <li key={i}>{v.airlineName} - Precio: {v.price} €</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ResultadoVuelosPrueba;
