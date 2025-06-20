import React, { useEffect, useState } from 'react';
import './services/i18n';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import Flights from './pages/flights';
import Login from './components/auth/login';
import Register from './components/auth/register';
import ContactForm from './pages/contact';
import AboutUS from './pages/aboutUs';
import UserProfile from './pages/perfilUsuario';
import FAQ from './pages/FAQ-Page';
import Hoteles from './pages/hoteles';
import ResultadoVuelos from './pages/resultadoVuelos';
import ConfirmReservation from './pages/confirmReservation';
import SelectSeat from './pages/selectSeat';
import ResultadoVuelosHotel from './pages/resultadoVuelosHotel';
import SelectSeatCombo from './pages/selectSeatCombo';
import ConfirmReservationCombo from './pages/confirmReservationCombo';



const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !currentUser.emailVerified) {
        setUser(null);
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div>Cargando...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Redirección inicial a vuelos */}
        <Route path="/" element={<Navigate to="/flights" />} />

        {/* ✅ Públicas */}
        <Route path="/flights" element={<Flights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/aboutUs" element={<AboutUS />} />
        <Route path="/FAQ-Page" element={<FAQ />} />
        <Route path="/resultadoVuelos" element={<ResultadoVuelos />} />
        <Route path="/selectSeat" element={<SelectSeat />} />
        <Route path="/hoteles" element={<Hoteles />} />
        <Route path="/ConfirmReservation" element={<ConfirmReservation />} />
        <Route path="/resultadoVuelosHotel" element={<ResultadoVuelosHotel />} />
        <Route path="/selectSeatCombo" element={<SelectSeatCombo />} />
        <Route path="/confirmReservationCombo" element={<ConfirmReservationCombo />} />

        {/* ✅ Protegida */}
        <Route
          path="/perfilUsuario"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;