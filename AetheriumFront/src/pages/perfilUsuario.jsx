import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/perfilUsuario.css';
import { useTranslation } from 'react-i18next';
import { getReservationsByUser, deleteReservation } from '../services/reservationService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [showReservations, setShowReservations] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('userProfile');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        try {
          const firebaseUid = currentUser.uid;
          const token = await getIdToken(currentUser);

          const res = await fetch(`/api/user/byfirebase/${firebaseUid}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) throw new Error("No se pudo obtener el usuario");
          const userInfo = await res.json();
          setUserInfo(userInfo);

          const reservations = await getReservationsByUser(userInfo.userId, token);

          setUser(currentUser);
          setReservations(reservations);
        } catch (error) {
          console.error("❌ Error al obtener usuario o reservas:", error);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

  const calcularHorasTotales = () => {
    return reservations.reduce((total, r) => {
      const salida = new Date(r.flightId.departureTime);
      const llegada = new Date(r.flightId.arrivalTime);
      return total + (llegada - salida) / (1000 * 60 * 60);
    }, 0).toFixed(1);
  };

  const companiaMasUsada = () => {
    const count = {};
    reservations.forEach(r => {
      const name = r.flightId.airlineName;
      count[name] = (count[name] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const destinoFavorito = () => {
    const count = {};
    reservations.forEach(r => {
      const city = r.flightId.arrivalAirport.city;
      count[city] = (count[city] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) return;
    try {
      const token = await getIdToken(user);
      await deleteReservation(id, token);
      setReservations(prev => prev.filter(r => r.reservationId !== id));
    } catch (error) {
      alert("Error al eliminar la reserva." + error);
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
            {userInfo && (
              <div className="perfil-info">
                <p><strong>{t('name')}:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                <p><strong>{t('email')}:</strong> {userInfo.email}</p>
                <p><strong><a href="#" onClick={handleForgotPassword} className="forgotPass">{t('contrasena')}</a></strong></p>
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
                {reservations.length > 0 ? (
                  <div className="reservas-cards-container">
                    {reservations.map((reserva) => (
                      <div key={reserva.reservationId} className="reserva-card">
                        <div className="reserva-header">
                          <span className="reserva-route">
                            {reserva.flightId.departureAirport.city} ➜ {reserva.flightId.arrivalAirport.city}
                          </span>
                          <span className="reserva-fecha">{new Date(reserva.flightId.departureTime).toLocaleDateString()}</span>
                        </div>
                        <div className="reserva-detalles">
                          <div><strong>{t('table.salida')}:</strong> {new Date(reserva.flightId.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div><strong>{t('table.llegada')}:</strong> {new Date(reserva.flightId.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div><strong>{t('table.compania')}:</strong> {reserva.flightId.airlineName}</div>
                        </div>
                        <button className="delete-button" onClick={() => handleDelete(reserva.reservationId)}>
                          {t('deleteReservation')}
                        </button>
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
                <p><strong>{t('totalFlights')}:</strong> {reservations.length}</p>
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