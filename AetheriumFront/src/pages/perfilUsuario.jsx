import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken, sendPasswordResetEmail } from 'firebase/auth';
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
  const { t } = useTranslation('userProfile');

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

  const handleForgotPassword = async () => {
    const emailPrompt = prompt("Introduce tu correo electrónico para recuperar la contraseña:");
    if (emailPrompt) {
      try {
        await sendPasswordResetEmail(auth, emailPrompt.trim());
        alert("Si el correo está registrado, recibirás un mensaje para restablecer tu contraseña.");
      } catch (error) {
        alert("Error al enviar el correo de recuperación: " + error.message);
      }
    }
  };

  return (
    <Layout>
      
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
                <div className="perfil-info">
                  <p><strong>{t('name')}:</strong> {user.displayName || 'Usuario'}</p>
                  <p><strong>{t('email')}:</strong> {user.email}</p>
                  <p><strong><a href="#" onClick={handleForgotPassword} className="forgot">{t('contrasena')}</a></strong></p>
                </div>
              )}

              <div className="toggle-buttons">
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
                    <div className="reservas-cards-container">
                      {flightStats.map((reserva, i) => (
                        <div key={i} className="reserva-card">
                          <div className="reserva-header">
                            <span className="reserva-route">{reserva.origen} ➜ {reserva.destino}</span>
                            <span className="reserva-fecha">{reserva.fecha}</span>
                          </div>
                          <div className="reserva-detalles">
                            <div><strong>{t('table.salida')}:</strong> {reserva.horaSalida}</div>
                            <div><strong>{t('table.llegada')}:</strong> {reserva.horaLlegada}</div>
                            <div><strong>{t('table.compania')}:</strong> {reserva.compania}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{t('noReservations')}</p>
                  )}
                </div>
              )}

              {showStats && (
                <div className="stats-section">
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
      
    </Layout>
  );
};

export default UserProfile;