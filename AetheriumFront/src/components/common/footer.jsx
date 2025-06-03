import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

const Footer = () => {
  return (
    <footer>
      <nav className="barra-footer">
        <p className="copyrightAetherium" >© Aetherium 2025</p>
        <Link to="/sobre-nosotros">Sobre Nosotros</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link>
      </nav>
    </footer>
  );
};

export default Footer;