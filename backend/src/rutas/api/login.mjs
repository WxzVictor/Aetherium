// backend/src/rutas/login.mjs
import { Router } from 'express';
const router = Router();

router.get('/login', (req, res) => {
  res.render('login', {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.DOMAIN,
      projectId: process.env.PROJECT_ID
    }
  });
});

export default router;
