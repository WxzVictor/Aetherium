import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

const ContactForm = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div style={{
      maxWidth: '500px',
      margin: 'auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Contáctanos</h2>

      <form ref={form} onSubmit={sendEmail}>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          required
          placeholder="Tu nombre"
          style={inputStyle}
        />

        <label>Email</label>
        <input
          type="email"
          name="correo"
          required
          placeholder="tu@email.com"
          style={inputStyle}
        />

        <label>Mensaje</label>
        <textarea
          name="asunto"
          required
          placeholder="Escribe tu mensaje aquí..."
          rows="5"
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '10px'
          }}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>

        {sent && <p style={{ color: 'green', marginTop: '10px' }}>Mensaje enviado con éxito ✅</p>}
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0 16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};

export default ContactForm;
