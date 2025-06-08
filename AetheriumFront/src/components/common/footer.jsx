import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

const Footer = () => {
  return (
    <footer>
      <nav className="barra-footer">
        <p className="copyrightAetherium" >© Aetherium 2025</p>
        <Link to="/aboutUs">About Us</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/FAQ-Page">FAQ Page</Link>
      </nav>
    </footer>
  );
};

export default Footer;