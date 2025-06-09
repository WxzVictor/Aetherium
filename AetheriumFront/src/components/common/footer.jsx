import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('footer'); // Namespace 'footer'

  return (
    <footer>
      <nav className="barra-footer">
        <p className="copyrightAetherium">© Aetherium 2025</p>
        <Link to="/aboutUs">{t('aboutUs')}</Link>
        <Link to="/contact">{t('contact')}</Link>
        <Link to="/FAQ-Page">{t('faq')}</Link>
      </nav>
    </footer>
  );
};

export default Footer;  
