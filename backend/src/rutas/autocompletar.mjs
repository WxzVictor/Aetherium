import express from 'express';
import axios from 'axios';

const router = express.Router();

// Ruta para autocompletar ciudades
router.get('/autocompletar', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).send('Falta el parámetro "query"');
  }

  try {
    const response = await axios.get('https://kiwi-com-api.p.rapidapi.com/locations', {
      headers: {
        'X-RapidAPI-Host': 'kiwi-com-api.p.rapidapi.com',
        'X-RapidAPI-Key': 'TU_API_KEY',  // Reemplaza con tu clave de API de RapidAPI
      },
      params: {
        term: query,
        locale: 'es',
        limit: 10,
      },
    });

    const ciudades = response.data.locations.map(loc => loc.name);
    res.json(ciudades);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).send('Error al obtener ciudades');
  }
});

// Ruta para buscar vuelos
router.get('/buscar-vuelos', async (req, res) => {
  const { origen, destino, fechaDesde, fechaHasta } = req.query;

  if (!origen || !destino || !fechaDesde || !fechaHasta) {
    return res.status(400).send('Faltan parámetros');
  }

  try {
    const response = await axios.get('https://kiwi-com-api.p.rapidapi.com/v2/search', {
      headers: {
        'X-RapidAPI-Host': 'kiwi-com-api.p.rapidapi.com',
        'X-RapidAPI-Key': '8950a1ff7amshc52dfb3f62d8793p12efb1jsn6ce71aea4c8c',  // Reemplaza con tu clave de API de RapidAPI
      },
      params: {
        fly_from: origen,
        fly_to: destino,
        date_from: fechaDesde,
        date_to: fechaHasta,
        direct_flights: '0',
        curr: 'USD',
        adults: 1,
        limit: 5,
      },
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error al obtener vuelos:', error);
    res.status(500).send('Error al obtener vuelos');
  }
});

export default router;
