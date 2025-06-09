import React from 'react';
import Layout from '../components/common/layout';
import '../styles/cloud.css';
import '../styles/aboutUs.css';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation('aboutUs');

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
              <p>{t('intro')}</p>
              <br />
              <h2>{t('missionTitle')}</h2>
              <p>{t('missionText')}</p>
              <br />
              <h2>{t('differenceTitle')}</h2>
              <ul>
                <li>✔️ {t('difference.0')}</li>
                <li>✔️ {t('difference.1')}</li>
                <li>✔️ {t('difference.2')}</li>
                <li>✔️ {t('difference.3')}</li>
              </ul>
              <br />
              <h2>{t('teamTitle')}</h2>
              <p>{t('teamText')}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
