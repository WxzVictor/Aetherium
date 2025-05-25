import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

const Footer = () => {
  return (
    <footer>
      <nav>
        <Link to="/login">Iniciar Sesión</Link>
        <Link to="/sobre-nosotros">Sobre Nosotros</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link>
      </nav>
      <p>© Aetherium 2025</p>
    </footer>
  );
};

export default Footer;