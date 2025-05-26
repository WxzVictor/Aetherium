import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import Flights from './pages/flights';
import Login from './components/auth/login';
import Register from './components/auth/register';

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

  if (user === undefined) {
    return <div>Cargando...</div>; // Puedes poner un spinner si quieres
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  console.log("Renderizando App")
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/vuelos" />} />
        <Route
          path="/vuelos"
          element={
            <ProtectedRoute>
              <Flights />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Puedes añadir aquí otras rutas como resultadoVuelos, etc. */}
      </Routes>
    </Router>
  )
}

export default App;

