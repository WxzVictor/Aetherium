import express from 'express';
import { getAllHotels, getHotelByCity } from '../../controllers/hoteles.mjs';

const router = express.Router();

router.get('/hoteles', getAllHotels);
router.get('/hoteles/:ciudad', getHotelByCity);

export default router;