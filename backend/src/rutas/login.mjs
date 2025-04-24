import express from 'express';
import { login } from '../controllers/authController.mjs';

const router = express.Router();

router.post('/login', login);

export default router;

// src/rutas/autenticacion.mjs
import { login } from '../controllers/autenticacion.mjs';

// app.mjs
import loginRoutes from './src/rutas/login.mjs';

app.use('/api', loginRoutes);