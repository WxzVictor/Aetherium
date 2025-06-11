import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Layout from '../components/common/layout';

const ResultadoVuelosPrueba = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('resultadoVuelos');

  const { searchResults } = location.state || {};

  useEffect(() => {
    if (!searchResults) {
      navigate("/");
    }
  }, [searchResults, navigate]);

  if (!searchResults) return null;

  const formatDate = (datetime) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(datetime).toLocaleDateString(undefined, options);
  };

  const totalIda = searchResults.outFlights.reduce((acc, vuelo) => {
    const price = Number(vuelo.price);
    return !isNaN(price) && price > 0 ? acc + price : acc;
  }, 0);

  const totalVuelta = (searchResults.returnFlights || []).reduce((acc, vuelo) => {
    const price = Number(vuelo.price);
    return !isNaN(price) && price > 0 ? acc + price : acc;
  }, 0);

  const renderFlightCard = (vuelo) => (
    <div className="card" key={vuelo.id || Math.random()}>
      <div className="info">
        <strong>{vuelo.airlineName}</strong>
        <div className="horarios">
          <div className="hora-bloque">
            <div className="hora">
              {new Date(vuelo.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="ciudad">
              {`${vuelo.departureAirport.city} (${vuelo.departureAirport.code})`}
            </div>
          </div>
          <div className="duracion">
            ✈ <span className="directo">{t('direct')}</span>
          </div>
          <div className="hora-bloque">
            <div className="hora">
              {new Date(vuelo.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="ciudad">
              {`${vuelo.arrivalAirport.city} (${vuelo.arrivalAirport.code})`}
            </div>
          </div>
        </div>
        <div className="duracion-texto">
          {t('duration')}: {Math.floor(vuelo.durationMinutes / 60)} h {vuelo.durationMinutes % 60} min
        </div>
      </div>
      <div className="precio">
        <div className="monto">{vuelo.price} €</div>
        <button className="btn">{t('book')}</button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="resultado-vuelos-container">
        <h1>{t('title')}</h1>

        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          {t('totalOut')}: {totalIda} € <br />
          {t('totalReturn')}: {totalVuelta} €
        </div>

        <section>
          <h2>{t('outbound')} - {searchResults.outFlights.length > 0 ? formatDate(searchResults.outFlights[0].departureTime) : t('noFlights')}</h2>
          <div className="resultado-vuelos">
            {searchResults.outFlights.length === 0 && <p>{t('noOutbound')}</p>}
            {searchResults.outFlights.map(renderFlightCard)}
          </div>
        </section>

        {searchResults.returnFlights && (
          <section style={{ marginTop: '2rem' }}>
            <h2>{t('return')} - {searchResults.returnFlights.length > 0 ? formatDate(searchResults.returnFlights[0].departureTime) : t('noFlights')}</h2>
            <div className="resultado-vuelos">
              {searchResults.returnFlights.length === 0 && <p>{t('noReturn')}</p>}
              {searchResults.returnFlights.map(renderFlightCard)}
            </div>
          </section>
        )}

        <section style={{ marginTop: '2rem' }}>
          <h3>{t('pricesOut')}</h3>
          <ul>
            {searchResults.outFlights.map((v, i) => (
              <li key={i}>{v.airlineName} - {t('price')}: {v.price} €</li>
            ))}
          </ul>

          {searchResults.returnFlights && (
            <>
              <h3>{t('pricesReturn')}</h3>
              <ul>
                {searchResults.returnFlights.map((v, i) => (
                  <li key={i}>{v.airlineName} - {t('price')}: {v.price} €</li>
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
