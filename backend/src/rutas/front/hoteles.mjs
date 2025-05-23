import { Router } from 'express';
const router = Router();

router.get('/hoteles', (req, res) => {
  res.render('hoteles', {
    firebaseConfig: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.DOMAIN,
      projectId: process.env.PROJECT_ID
    }
  });
});

export default router;