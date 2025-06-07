import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/aboutUs.css'; // Puedes compartir estilos aquí o hacer uno nuevo

import { useState } from 'react';

const faqData = {
  "Reservas y disponibilidad": [
    {
      question: "¿Cómo puedo buscar un vuelo?",
      answer: "Solo ingresa origen, destino y fechas en el formulario principal y haz clic en 'Buscar'."
    },
    {
      question: "¿Puedo reservar vuelos para más de una persona?",
      answer: "Sí, selecciona el número de pasajeros en el buscador antes de iniciar la búsqueda."
    },
  ],
  "Pagos": [
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Tarjetas de crédito, débito, PayPal y otros métodos seguros dependiendo del país."
    },
    {
      question: "¿Los precios incluyen impuestos?",
      answer: "Sí, el precio final mostrado incluye tasas e impuestos obligatorios."
    },
  ],
  "Cambios y cancelaciones": [
    {
      question: "¿Puedo cancelar mi vuelo?",
      answer: "Depende de la tarifa. Algunas permiten cancelación con reembolso parcial o total."
    },
    {
      question: "¿Se pueden hacer cambios de fecha?",
      answer: "Sí, pero pueden tener un coste adicional según la aerolínea y el tipo de tarifa."
    },
  ],
};

const FAQ = () => {
  const [open, setOpen] = useState({});

  const toggle = (section, index) => {
    setOpen(prev => ({
      ...prev,
      [`${section}-${index}`]: !prev[`${section}-${index}`]
    }));
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
          <h1>Preguntas Frecuentes</h1>
          <div className="contenedor-formulario">
            <div className="aboutUs-form-container">
              {Object.entries(faqData).map(([section, faqs], i) => (
                <div key={i}>
                  <h2>{section}</h2>
                  {faqs.map((faq, j) => (
                    <div key={j} style={{ marginBottom: '1rem' }}>
                      <button
                        onClick={() => toggle(section, j)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        {faq.question}
                      </button>
                      {open[`${section}-${j}`] && (
                        <p style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
