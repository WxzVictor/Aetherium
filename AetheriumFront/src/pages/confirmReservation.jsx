import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/layout";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const ConfirmReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ida, setIda] = useState(location.state?.vuelo || null);
  const [vuelta, setVuelta] = useState(location.state?.vuelo?.vuelta || null);
  const [checking, setChecking] = useState(!location.state?.vuelo);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Escucha cambios de sesión Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Recuperar vuelo pendiente si no hay en location.state
  useEffect(() => {
    if (!ida && checking) {
      const vueloPendiente = sessionStorage.getItem("vueloPendiente");
      if (vueloPendiente) {
        const vueloParsed = JSON.parse(vueloPendiente);
        setIda(vueloParsed);
        setVuelta(vueloParsed.vuelta || null);
        sessionStorage.removeItem("vueloPendiente");
      }
      setChecking(false);
    } else if (!ida && !checking) {
      navigate("/resultadoVuelos");
    }
  }, [ida, checking, navigate]);


  if (!ida || checking) return null;

  const renderVueloInfo = (vuelo, titulo) => (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <h3>{titulo}</h3>
      <div className="info">
        <strong>{vuelo.airlineName}</strong>
        <div>
          {vuelo.departureAirport.city} ({vuelo.departureAirport.code}) →{" "}
          {vuelo.arrivalAirport.city} ({vuelo.arrivalAirport.code})
        </div>
        <div>Salida: {new Date(vuelo.departureTime).toLocaleString()}</div>
        <div>Llegada: {new Date(vuelo.arrivalTime).toLocaleString()}</div>
        <div>Precio: {(vuelo.price / 100).toFixed(2)} €</div>
      </div>
    </div>
  );

  const totalPrice = vuelta
    ? (ida.price + vuelta.price) / 100
    : ida.price / 100;

  const handleConfirm = async () => {
    if (!user) {
      alert("No estás autenticado.");
      return;
    }

    setLoading(true);
    try {
      // Obtén el token JWT de Firebase para autorizar la API
      const token = await user.getIdToken();

      // Crear payload para la reserva (ajusta según tu API)
      const payload = {
        userId: user.uid,
        flightId: ida.flightId, // asegúrate que venga ese dato
        seatId: null, // si tienes asiento seleccionado, envíalo
      };
      console.log("Payload enviado:", payload);

      const response = await fetch("http://localhost:5120/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Error al reservar: ${errorData.message || response.statusText}`
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      alert("Reserva confirmada con ID: " + data.reservationId);
      navigate("/flights");

    } catch (error) {
      console.error("Error en confirmación:", error);
      alert("Error en la confirmación, revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="resultado-vuelos-container">
        <h1>Confirmar Reserva</h1>
        {renderVueloInfo(ida, "Vuelo de ida")}
        {vuelta && renderVueloInfo(vuelta, "Vuelo de vuelta")}

        <div
          className="total-precio"
          style={{ marginTop: "1rem", fontWeight: "bold" }}
        >
          Total: {totalPrice.toFixed(2)} €
        </div>

        <button
          className="btn"
          style={{ marginTop: "2rem" }}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar Reserva"}
        </button>
      </div>
    </Layout>
  );
};

export default ConfirmReservation;
