import React, { useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom"; // Para redirección

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // React Router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/flights"); // Redirige a la pagina principal
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  return (
    <header>
      <nav className="barra-navegacion">
        <div className="logo-aetherium">
          <a href="/flights">
          <img src={logo} alt="Logo" /></a>
          <span translate="no"><a href="/flights" >Aetherium</a></span>
        </div>
        
        <div className="navegacion-derecha">
          {!user ? (
            <a href="/login">Iniciar sesión</a>
          ) : (
            <>
              <span><a href="/perfilUsuario">👤 {user.displayName || "Iniciar sesión"}</a></span>&nbsp;
              <button onClick={handleLogout} className="bt_logout">Cerrar sesión</button>
            </>
          )}
        </div>
      </nav>

      {user && (
        <div className="buscador">
          <a href="/flights"><button>✈️ Vuelos</button></a>
          <a href="/hoteles"><button>🏨 Hoteles</button></a>
        </div>
      )}
    </header>
  );
};

export default Header;