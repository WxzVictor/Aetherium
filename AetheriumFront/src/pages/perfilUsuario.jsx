import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/perfilUsuario.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showReservations, setShowReservations] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [flightStats, setFlightStats] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        // Verificar el token de acceso
        try {
          const token = await getIdToken(currentUser);
          if (!token) {
            // Si no hay token válido, redirigir al login
            navigate('/login');
          } else {
            setUser(currentUser);
            // Simulación de datos de vuelos
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
        } catch (error) {
          console.error("Error al obtener el token:", error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Calcular horas de vuelo
  const calcularHorasTotales = () => {
    let total = 0;
    flightStats.forEach((f) => {
      const salida = new Date(`1970-01-01T${f.horaSalida}`);
      const llegada = new Date(`1970-01-01T${f.horaLlegada}`);
      const diff = (llegada - salida) / (1000 * 60 * 60); // en horas
      total += diff;
    });
    return total.toFixed(1);
  };

  // Compañía más usada
  const companiaMasUsada = () => {
    const count = {};
    flightStats.forEach(f => {
      count[f.compania] = (count[f.compania] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  // Destino favorito
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
          <h1>👤 Perfil del Usuario</h1>
          <div className="contenedor-formulario">
            <div className="perfilUsuario-form-container">
              {user && (
                <div style={{ marginBottom: '20px' }}>
                  <p><strong>Nombre:</strong> {user.displayName || 'Usuario'}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setShowReservations(!showReservations)}>
                  {showReservations ? 'Ocultar reservas 📆' : 'Ver próximas reservas 📆'}
                </button>
                <button onClick={() => setShowStats(!showStats)}>
                  {showStats ? 'Ocultar estadísticas 📊' : 'Ver mis estadísticas 📊'}
                </button>
              </div>

              {/* Reservas */}
              {showReservations && (
                <div>
                  <h2>📅 Próximas Reservas</h2>
                  {flightStats.length > 0 ? (
                    <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                          <th style={{ padding: '8px', border: '1px solid #ccc' }}>Origen</th>
                          <th style={{ padding: '8px', border: '1px solid #ccc' }}>Destino</th>
                          <th style={{ padding: '8px', border: '1px solid #ccc' }}>Fecha</th>
                          <th style={{ padding: '8px', border: '1px solid #ccc' }}>Hora salida</th>
                          <th style={{ padding: '8px', border: '1px solid #ccc' }}>Hora llegada</th>
                          <th style={{ padding: '8px', border: '1px solid #ccc' }}>Compañía</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightStats.map((reserva, i) => (
                          <tr key={i}>
                            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{reserva.origen}</td>
                            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{reserva.destino}</td>
                            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{reserva.fecha}</td>
                            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{reserva.horaSalida}</td>
                            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{reserva.horaLlegada}</td>
                            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{reserva.compania}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No tienes reservas aún.</p>
                  )}
                </div>
              )}

              {/* Estadísticas */}
              {showStats && (
                <div style={{ marginTop: '30px' }}>
                  <h2>📊 Estadísticas de Vuelo</h2>
                  <p><strong>Total de vuelos:</strong> {flightStats.length}</p>
                  <p><strong>Horas totales voladas:</strong> {calcularHorasTotales()}h</p>
                  <p><strong>Compañía más usada:</strong> {companiaMasUsada()}</p>
                  <p><strong>Destino favorito:</strong> {destinoFavorito()}</p>
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
