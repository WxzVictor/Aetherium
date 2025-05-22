// backend/src/controllers/peticionesAxio.mjs
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { access } from "fs";

// Esta parte calcula el path absoluto del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura dotenv para leer "process.env"
dotenv.config({ path: path.join(__dirname, '..', '..', 'config.env') });


export const obtenerAeropuertosPorNombre = async (busqueda) => {
  try {
    const response = await axios.get("http://api.aviationstack.com/v1/airports", {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY, // Asegúrate de que tu clave API esté configurada correctamente
        search: busqueda, // El parámetro que estamos buscando
      },
    });

    // Aquí mapeamos la respuesta para ajustarla al formato esperado por el frontend
    return response.data.data.map(aeropuerto => ({
      ciudad: aeropuerto.airport_name,
      codigo: aeropuerto.iata_code,
      pais: aeropuerto.country_name,
    }));
  } catch (error) {
    console.error("Error al obtener aeropuertos:", error.message);
    return [];
  }
};

//Por si necesitamos buscar un vuelo por numero
export const buscarVuelo = async (numeroVuelo) => {
  try{
    const response = await axios.get("http://api.aviationstack.com/v1/flights", {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY,
        flight_iata: numeroVuelo,
      },
    });

    return response.data.data;
  }catch (error) {
    console.error("Error al buscar vuelo:", error.message);
    return [];
  }
};

export const buscarVuelosPorRuta = async (origen, destino, fecha) => {
  try {
    const response = await axios.get("http://api.aviationstack.com/v1/flights", {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY,
        dep_iata: origen,
        arr_iata: destino,
        flight_date: fecha
      }
    });

    return response.data.data

  } catch (error) {
    console.error("Error al buscar vuelos por ruta:", error.message);
    return [];
  }
};

/*
export const buscarHotelesSimulados = (ciudad) => {
  // Por si queremos sustituirlo por una API real de hoteles si queremos mas adelante
  const hoteles = [
    { nombre: "Hotel Sol", ciudad, estrellas: 4, precio: 80 },
    { nombre: "Hotel Luna", ciudad, estrellas: 3, precio: 60 },
    { nombre: "Hotel Estrella", ciudad, estrellas: 5, precio: 120 },
  ];
  return hoteles;
};
*/

/*
// Por si queremos generar un mapa de asientos para reservas, esto me lo ha hecho la IA, le he preguntado como haria un mapa de asientos para reservar
export const generarMapaDeAsientos = (filas = 10, columnas = 6) => {
  const mapa = [];
  for (let f = 1; f <= filas; f++) {
    for (let c = 0; c < columnas; c++) {
      mapa.push({
        asiento: `${f}${String.fromCharCode(65 + c)}`,
        ocupado: false,
      });
    }
  }
  return mapa;
};
*/