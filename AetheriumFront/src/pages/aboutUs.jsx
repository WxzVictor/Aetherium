import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/contact.css';

const AboutUs = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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

        <div className="contenedor-formulario">
          <div className="contact-form-container">
            <h1>Sobre Nosotros</h1>
            <p>
              ✈️ En <strong>TuCompañía</strong>, creemos que viajar debería ser sencillo, accesible y emocionante.
              Desde nuestros inicios en 2025, nos hemos comprometido a crear experiencias de viaje sin estrés.
            </p>
            <br />
            <h2>Nuestra misión</h2>
            <p>
              Ofrecer a los viajeros todas las opciones de vuelo, hospedaje y experiencias en un solo lugar.
              Nuestro objetivo es eliminar la confusión de las reservas online y permitir que tú tomes el control.
            </p>
            <br />
            <h2>Lo que nos hace diferentes</h2>
            <ul>
              <li>✔️ Comparación de cientos de aerolíneas en segundos</li>
              <li>✔️ Plataforma intuitiva y sin publicidad invasiva</li>
              <li>✔️ Soporte humano y disponible 24/7</li>
              <li>✔️ Comprometidos con la sostenibilidad del turismo</li>
            </ul>
            <br />
            <h2>Equipo</h2>
            <p>
              Nuestro equipo está formado por apasionados del viaje, la tecnología y la atención al cliente.
              Trabajamos desde múltiples países para traerte la mejor experiencia posible.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
