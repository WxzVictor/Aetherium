import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/aboutUs.css';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation('FAQ');
  const [open, setOpen] = useState({});

  const toggle = (section, index) => {
    setOpen(prev => ({
      ...prev,
      [`${section}-${index}`]: !prev[`${section}-${index}`]
    }));
  };

  const sections = ['reservas', 'pagos', 'cambios'];

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
          <h1>{t('title')}</h1>
          <div className="contenedor-formulario">
            <div className="aboutUs-form-container">
              {sections.map(sectionKey => (
                <div key={sectionKey}>
                  <h2>{t(`${sectionKey}.title`)}</h2>
                  {t(`${sectionKey}.questions`, { returnObjects: true }).map((FAQ, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                      <button
                        onClick={() => toggle(sectionKey, i)}
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
                        {FAQ.question}
                      </button>
                      {open[`${sectionKey}-${i}`] && (
                        <p style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                          {FAQ.answer}
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
