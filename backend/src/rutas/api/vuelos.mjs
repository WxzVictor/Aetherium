import express from 'express';
import { getAllvuelos, searchvuelos, getAvailableSeats } from '../../controllers/vuelos.mjs';

const router = express.Router();

router.get('/vuelos', getAllvuelos);
router.get('/vuelos/:origen/:destino/:fecha_salida/:fecha_llegada', searchvuelos);
router.get('/asientos/:flightId/', getAvailableSeats);

export default router;