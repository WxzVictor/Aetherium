import { Airport } from '../models/Airport.js';

export const getAllAirports = async (req, res) => {
    try {
        const airport = await Airport.FindAll();

        res.json({
            ariports: airport.map(a => ({
                airportCode: a.airportCode,
                airportName: a.airportName,
                city: a.city,
                countryCode: a.countryCode,
                latitude: a.latitude,
                longitude: a.longitude,
                elevationFeet: a.elevationFeet,
                regionCode: a.regionCode
            }))
        });        
    } catch (error) {
        res.status(500).json({ error: "Error al buscar aeropuertos", detalle: error.message });        
    }
};