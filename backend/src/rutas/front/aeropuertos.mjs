import { Router } from 'express';
const router = Router();

router.get('/aeropuertos', (req, res) => {
  res.render('aeropuertos', {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.DOMAIN,
      projectId: process.env.PROJECT_ID
    }
  });
});

export default router;