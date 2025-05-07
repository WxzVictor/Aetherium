// backend/src/rutas/register.mjs
import { Router } from 'express';
const router = Router();

router.get('/register', (req, res) => {
  res.render('register', {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.DOMAIN,
      projectId: process.env.PROJECT_ID
    }
  });
});

export default router;

//Guardar nombre de usuario en nuestra base de datos cuando haga el registro