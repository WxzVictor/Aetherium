import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/cloud.css';
import '../styles/contact.css';
import Layout from '../components/common/layout';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('contact');

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
        alert(`${t('contact.error.sending')}: ${error.text || error}`);
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
          <h1>{t('title')}</h1>
          <div className="contenedor-formulario">
            <div className="contact-form-container">
              <form ref={form} onSubmit={sendEmail}>
                <label>{t('name')}</label>
                <input type="text" name="nombre" required placeholder={t('placeholder.name')} />
                <label>{t('email')}</label>
                <input type="email" name="correo" required placeholder={t('placeholder.email')} />
                <label>{t('message')}</label>
                <textarea name="asunto" required placeholder={t('placeholder.message')} rows="5"></textarea>
                <button type="submit" disabled={loading}>
                  {loading ? t('sending') : t('send')}
                </button>
                {sent && <p>{t('contact.success')}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactForm;
