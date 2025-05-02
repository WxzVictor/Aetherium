// backend/src/rutas/vuelos.mjs
import { Router } from 'express';
const router = Router();

router.get('/vuelos', (req, res) => {
    res.render('vuelos', {
      firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.DOMAIN,
        projectId: process.env.PROJECT_ID
      }
    });
  });
  

export default router;
