import { useEffect, useState } from "react";
import "./../styles/vuelos.css"; // Asumiendo que ya tienes estilos ahí
import Layout from "../components/common/layout";
import '../styles/resultadoVuelos.css';

// 1. Datos simulados (mock)
const mockFlights = [
    {
        id: 1,
        origen: "Madrid",
        destino: "Barcelona",
        fecha: "2025-06-15",
        hora: "08:00",
        precio: 120
    },
    {
        id: 2,
        origen: "Madrid",
        destino: "Lisboa",
        fecha: "2025-06-16",
        hora: "10:30",
        precio: 150
    },
    {
        id: 3,
        origen: "Madrid",
        destino: "Roma",
        fecha: "2025-06-17",
        hora: "12:45",
        precio: 180
    }
];

// 2. Componente que renderiza un vuelo
function FlightCard({ vuelo }) {
    return (
    <div className="flight-card-horizontal">
      <div className="trayecto">{vuelo.origen} → {vuelo.destino}</div>
      <div className="info">
        <span>Fecha: {vuelo.fecha}</span>
        <span>Hora: {vuelo.hora}</span>
        <span>Precio: {vuelo.precio} €</span>
      </div>
    </div>
  );
}

// 3. Página principal
export default function ResultadoVuelos() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simula llamada al backend
    useEffect(() => {
        setTimeout(() => {
            setFlights(mockFlights);
            setLoading(false);
        }, 1500);
    }, []);

    return (
        <Layout>
            <div className="login-page">
                <div id="clouds">
                    {[...Array(7)].map((_, i) => (
                        <div className={`cloud x${i + 1}`} key={i}></div>
                    ))}
                </div>

                <div>
                    <h1>Resultados de Vuelos</h1>
                    <div className="contenedor-formulario">
                        <div className="resultado-vuelos">
                            {loading ? (
                                <p className="cargando" data-text="Cargando vuelos...">Cargando vuelos...</p>
                            ) : (
                                <div className="resultado-vuelos">
                                    {loading ? (
                                        <p>Cargando vuelos...</p>
                                    ) : (
                                        flights.map((vuelo) => (
                                            <FlightCard key={vuelo.id} vuelo={vuelo} />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
