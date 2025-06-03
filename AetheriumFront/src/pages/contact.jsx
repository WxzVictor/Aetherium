import React, { useRef, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/cloud.css';
import '../styles/contact.css';
import Layout from '../components/common/layout';

const ContactForm = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setSent(true);
        setLoading(false);
        form.current.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        setLoading(false);
        alert(`Error al enviar el mensaje: ${error.text || error}`);
      });
  };

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

        <div>
          <h1>Contáctanos</h1>
          <div className="contenedor-formulario">
            <div className="contact-form-container">
              <form ref={form} onSubmit={sendEmail}>
                <label>Nombre</label>
                <input type="text" name="nombre" required placeholder="Tu nombre" />
                <label>Email</label>
                <input type="email" name="correo" required placeholder="tu@email.com" />
                <label>Mensaje</label>
                <textarea name="asunto" required placeholder="Escribe tu mensaje aquí..." rows="5"></textarea>
                <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
                {sent && <p>Mensaje enviado con éxito ✅</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactForm;