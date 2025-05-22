import express from 'express';
import { getAllFlights, searchFlights, getAvailableSeats } from '../../controllers/vuelos.mjs';

const router = express.Router();

router.get('/vuelos', getAllFlights);
router.get('/vuelos/:origen/:destino/:fecha_salida/:fecha_llegada', searchFlights);
router.get('/asientos/:flightId/', getAvailableSeats);

export default router;