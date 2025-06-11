import React, { useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("header");

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/flights");
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  return (
    <header>
      <nav className="barra-navegacion">
        <div className="logo-aetherium">
          <a href="/flights">
            <img src={logo} alt="Logo" />
          </a>
          <span translate="no">
            <a href="/flights">Aetherium</a>
          </span>
        </div>

        <div className="navegacion-derecha">
          <button onClick={toggleLanguage} style={{ marginRight: "10px" }}>
            {i18n.language === "es" ? "🌐 English" : "🌐 Español"}
          </button>

          {!user ? (
            <a href="/login">{t("login")}</a>
          ) : (
            <>
              <span>
                <a href="/perfilUsuario">👤 {user.displayName || t("login")}</a>
              </span>
              &nbsp;
              <button onClick={handleLogout} className="bt_logout">
                {t("logout")}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
