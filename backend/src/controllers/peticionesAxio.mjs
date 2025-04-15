import axios from 'axios';

const obtenerVuelos = async (origen, destino, fecha) => {
  try {
    const response = await axios.get('https://kiwi-com-cheap-flights.p.rapidapi.com/v2/search', {
      params: {
        fly_from: origen, // Ejemplo: 'NYC'
        fly_to: destino,  // Ejemplo: 'LON'
        date_from: fecha, // Ejemplo: '2025-06-01'
        date_to: fecha,   // Ejemplo: '2025-06-01'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'kiwi-com-cheap-flights.p.rapidapi.com',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error obteniendo vuelos:', error);
    return [];
  }
};


export const obtenerCiudades = async (query, tipo) => {
    try {
      const respuesta = await axios.get(`https://api.skyscanner.net/apiservices/autosuggest/v1.0/US/USD/en-US`, {
        params: {
          query: query,
          apiKey: process.env.SKYSKANNER_API_KEY, // Aquí debes poner tu API Key de Skyscanner
        }
      });
  
      // Si se encuentra la respuesta, devolveremos los resultados relevantes
      return respuesta.data.Places.map(place => ({
        name: place.PlaceName,
        code: place.PlaceId,
      }));
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
      return [];
    }
  };
