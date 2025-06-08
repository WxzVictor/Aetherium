import React from "react";
import "../styles/ResultadoVuelosPrueba.css";
import Layout from '../components/common/layout';

const ResultadoVuelosPrueba = () => {
  const resumen = [
    { tipo: "Mejor opción", precio: 157, duracion: "1 h 28 min", destacado: true },
    { tipo: "Opción más barata", precio: 157, duracion: "1 h 28 min", destacado: false },
    { tipo: "Opción más rápida", precio: 218, duracion: "1 h 20 min", destacado: false },
  ];

  const resultados = [
    {
      aerolinea: "Iberia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Iberia_Logo_2022.svg/512px-Iberia_Logo_2022.svg.png",
      ida: {
        origen: "Madrid (MAD)",
        destino: "Barcelona (BCN)",
        horaSalida: "21:35",
        horaLlegada: "22:50",
        duracion: "1 h 15 min",
      },
      vuelta: {
        origen: "Barcelona (BCN)",
        destino: "Madrid (MAD)",
        horaSalida: "13:35",
        horaLlegada: "15:00",
        duracion: "1 h 25 min",
      },
      precio: 218,
    },
    {
      aerolinea: "Vueling",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Vueling_Airlines_Logo.svg/512px-Vueling_Airlines_Logo.svg.png",
      ida: {
        origen: "Madrid (MAD)",
        destino: "Sevilla (SVQ)",
        horaSalida: "08:00",
        horaLlegada: "09:10",
        duracion: "1 h 10 min",
      },
      precio: 157,
    },
    {
      aerolinea: "Air Europa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Air_Europa_Logo_2015.svg/512px-Air_Europa_Logo_2015.svg.png",
      ida: {
        origen: "Valencia (VLC)",
        destino: "Palma (PMI)",
        horaSalida: "12:00",
        horaLlegada: "12:45",
        duracion: "0 h 45 min",
      },
      precio: 198,
    },
  ];

  return (
    <Layout>
    <div className="resultado-vuelos-container">
      <div className="resumen-opciones">
        {resumen.map((item, index) => (
          <div
            key={index}
            className={`opcion-resumen`}
          >
            <div className="tipo">{item.tipo}</div>
            <div className="precio-resumen">{item.precio} €</div>
            <div className="duracion-resumen">{item.duracion} de media</div>
          </div>
        ))}
      </div>

      <div className="resultado-vuelos">
        {resultados.map((vuelo, index) => (
          <div key={index} className="card">
            <div className="info">
              {[vuelo.ida, vuelo.vuelta].map((segmento, i) =>
                segmento ? (
                  <div className="segmento" key={i}>{vuelo.aerolinea} <div/>
                    <div className="horarios">
                      <div className="hora-bloque">
                        <div className="hora">{segmento.horaSalida}</div>
                        <div className="ciudad">{segmento.origen}</div>
                      </div>
                      <div className="duracion">
                        ✈
                        <span className="directo">Directo</span>
                      </div>
                      <div className="hora-bloque">
                        <div className="hora">{segmento.horaLlegada}</div>
                        <div className="ciudad">{segmento.destino}</div>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
            <div className="precio">
              <div className="monto">{vuelo.precio} €</div>
              <button className="btn">Reservar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default ResultadoVuelosPrueba;
