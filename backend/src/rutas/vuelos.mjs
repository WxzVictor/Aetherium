// backend/src/rutas/vuelos.mjs
import { Router } from 'express';
import { buscarVuelos } from '../controllers/vuelos.mjs';
import { buscarVuelosPorRuta } from '../controllers/peticionesAxio.mjs';

const router = Router();

// Ruta para renderizar la vista principal de búsqueda
router.get('/vuelos', (req, res) => {
  res.render('vuelos', {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.DOMAIN,
      projectId: process.env.PROJECT_ID
    }
  });
});

router.post('/api/buscar-vuelos', buscarVuelos);

// Ruta GET tradicional (mantenida por compatibilidad)
router.get('/api/vuelos', async (req, res) => {
  const { origen, destino, fecha } = req.query;
  
  try {
    const vuelos = await buscarVuelosPorRuta(origen, destino, fecha);
    res.json(vuelos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de resultados (usando sesión del servidor)
router.get('/resultados-vuelos', (req, res) => {
  try {
    if (!req.session.vuelos || req.session.vuelos.length === 0) {
      return res.redirect('/vuelos?error=no-data');
    }
    
    res.render('resultadosVuelos', {
      vuelos: req.session.vuelos,
      firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.DOMAIN,
        projectId: process.env.PROJECT_ID
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.redirect('/vuelos?error=server');
  }
});

export default router;