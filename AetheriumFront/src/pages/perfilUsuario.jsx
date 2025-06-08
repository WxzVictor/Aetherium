import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/perfilUsuario.css';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showReservations, setShowReservations] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [flightStats, setFlightStats] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation('userProfile'); // Namespace


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        try {
          const token = await getIdToken(currentUser);
          if (!token) navigate('/login');
          else {
            setUser(currentUser);
            setFlightStats([
              {
                origen: 'Madrid',
                destino: 'Barcelona',
                fecha: '2025-04-12',
                horaSalida: '17:00',
                horaLlegada: '18:00',
                compania: 'AirEuropa',
              },
              {
                origen: 'Barcelona',
                destino: 'Madrid',
                fecha: '2025-04-15',
                horaSalida: '19:00',
                horaLlegada: '20:30',
                compania: 'Vueling',
              },
              {
                origen: 'Madrid',
                destino: 'Barcelona',
                fecha: '2025-05-02',
                horaSalida: '10:00',
                horaLlegada: '11:15',
                compania: 'Vueling',
              },
            ]);
          }
        } catch {
          navigate('/login');
        }
      } else navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  const calcularHorasTotales = () => {
    let total = 0;
    flightStats.forEach((f) => {
      const salida = new Date(`1970-01-01T${f.horaSalida}`);
      const llegada = new Date(`1970-01-01T${f.horaLlegada}`);
      const diff = (llegada - salida) / (1000 * 60 * 60);
      total += diff;
    });
    return total.toFixed(1);
  };

  const companiaMasUsada = () => {
    const count = {};
    flightStats.forEach(f => {
      count[f.compania] = (count[f.compania] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const destinoFavorito = () => {
    const count = {};
    flightStats.forEach(f => {
      count[f.destino] = (count[f.destino] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  return (
    <Layout>
      <div className="login-page">
        <div id="clouds">
          {[...Array(7)].map((_, i) => (
            <div className={`cloud x${i + 1}`} key={i}></div>
          ))}
        </div>

        <div>
          <h1>{t('title')}</h1>

          <div className="contenedor-formulario">
            <div className="perfilUsuario-form-container">
              {user && (
                <div style={{ marginBottom: '20px' }}>
                  <p><strong>{t('name')}:</strong> {user.displayName || 'Usuario'}</p>
                  <p><strong>{t('email')}:</strong> {user.email}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setShowReservations(!showReservations)}>
                  {showReservations ? t('hideReservations') : t('showReservations')}
                </button>
                <button onClick={() => setShowStats(!showStats)}>
                  {showStats ? t('hideStats') : t('showStats')}
                </button>
              </div>

              {showReservations && (
                <div>
                  <h2>{t('reservationsTitle')}</h2>
                  {flightStats.length > 0 ? (
                    <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                          <th>{t('table.origen')}</th>
                          <th>{t('table.destino')}</th>
                          <th>{t('table.fecha')}</th>
                          <th>{t('table.salida')}</th>
                          <th>{t('table.llegada')}</th>
                          <th>{t('table.compania')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightStats.map((reserva, i) => (
                          <tr key={i}>
                            <td>{reserva.origen}</td>
                            <td>{reserva.destino}</td>
                            <td>{reserva.fecha}</td>
                            <td>{reserva.horaSalida}</td>
                            <td>{reserva.horaLlegada}</td>
                            <td>{reserva.compania}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>{t('noReservations')}</p>
                  )}
                </div>
              )}

              {showStats && (
                <div style={{ marginTop: '30px' }}>
                  <h2>{t('statsTitle')}</h2>
                  <p><strong>{t('totalFlights')}:</strong> {flightStats.length}</p>
                  <p><strong>{t('totalHours')}:</strong> {calcularHorasTotales()}h</p>
                  <p><strong>{t('mostUsedAirline')}:</strong> {companiaMasUsada()}</p>
                  <p><strong>{t('favoriteDestination')}:</strong> {destinoFavorito()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
