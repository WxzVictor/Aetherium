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
      navigate("/login"); // Redirige a login
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  return (
    <header>
      <nav className="barra-navegacion">
        <div className="logo-aetherium">
          <img src={logo} alt="Logo" />
          <span translate="no">Aetherium</span>
        </div>
        <div className="navegacion-derecha">
          {!user ? (
            <a href="/login">Iniciar sesión</a>
          ) : (
            <>
              <span>👤 {user.displayName || "Usuario"}</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          )}
        </div>
      </nav>

      {user && (
        <div className="buscador">
          <a href="/vuelos"><button>✈️ Vuelos</button></a>
          <a href="/hoteles"><button>🏨 Hoteles</button></a>
        </div>
      )}
    </header>
  );
};

export default Header;