// backend/src/rutas/vuelos.mjs
import { Router } from 'express';
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

// Nueva ruta POST para búsqueda (Opción B)
router.post('/api/buscar-vuelos', async (req, res) => {
  const { origen, destino, fecha, pasajeros } = req.body;
  
  if (!origen || !destino) {
    return res.status(400).json({ error: "Se requieren origen y destino" });
  }

  try {
    const vuelos = await buscarVuelosPorRuta(origen, destino);
    
    // Filtrar y procesar resultados
    const vuelosFiltrados = fecha 
      ? vuelos.filter(v => v.flight_date === fecha)
      : vuelos;

    // Añadir disponibilidad simulada
    vuelosFiltrados.forEach(v => {
      v.asientos_disponibles = Math.floor(Math.random() * 10) + 1;
      v.precio = Math.floor(Math.random() * 500) + 100; // Precio aleatorio entre 100-600
    });

    // Guardar en sesión del servidor
    req.session.vuelos = vuelosFiltrados;
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ 
      error: "Error al buscar vuelos",
      detalle: error.message
    });
  }
});

// Ruta GET tradicional (mantenida por compatibilidad)
router.get('/api/vuelos', async (req, res) => {
  const { origen, destino, fecha } = req.query;
  
  try {
    const vuelos = await buscarVuelosPorRuta(origen, destino);
    const vuelosFiltrados = fecha ? vuelos.filter(v => v.flight_date === fecha) : vuelos;
    res.json(vuelosFiltrados);
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