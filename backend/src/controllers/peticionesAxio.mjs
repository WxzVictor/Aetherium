// backend/src/controllers/peticionesAxio.mjs
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";

// Esta parte calcula el path absoluto del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura dotenv para leer "process.env"
dotenv.config({ path: path.join(__dirname, '..', '..', 'process.env') });


/*export const obtenerAeropuertosPorNombre = async (busqueda) => {
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
*/