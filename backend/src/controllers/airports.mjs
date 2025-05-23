import { Airport } from '../models/Airport.js';

export const getAllAirports = async (req, res) => {
    try {
        const airport = await Airport.FindAll();

        res.json({
            ariports: airport.map(a => ({
                code: a.airportCode,
                name: a.airportName,
                city: a.city,
                country: a.countryCode,
            }))
        });        
    } catch (error) {
        res.status(500).json({ error: "Error al buscar aeropuertos", detalle: error.message });        
    }
};