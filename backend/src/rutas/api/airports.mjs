import express from 'express';
import { getAllAirports } from '../../controllers/airports.mjs';

const router = express.Router();

router.get('/aeropuertos', getAllAirports);

export default router;