import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

const Footer = () => {
  return (
    <footer>
      <nav className="barra-footer">
        <p className="copyrightAetherium" >© Aetherium 2025</p>
        <Link to="/aboutUs">Sobre Nosotros</Link>
        <Link to="/contact">Contacto</Link>
        <Link to="/FAQ-Page">Preguntas Frecuentes</Link>
      </nav>
    </footer>
  );
};

export default Footer;