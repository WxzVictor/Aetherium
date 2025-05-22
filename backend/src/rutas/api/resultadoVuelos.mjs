// backend/src/rutas/vuelos.mjs
import { Router } from 'express';

const router = Router();

// Ruta para renderizar la vista principal de búsqueda
router.get('/resultadosVuelo', (req, res) => {
  res.render('resultadosVuelo', {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.DOMAIN,
      projectId: process.env.PROJECT_ID
    }
  });
});

export default router;
