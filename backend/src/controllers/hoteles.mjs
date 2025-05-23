import { Hotels } from "../models/Hotel.js";

// Obtener todos los hoteles
export const getAllHotels = async (req, res) => {
    try {
        const hoteles = await Hotels.FindAll();

        res.json({
            total: hoteles.lenght,
            hoteles
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener hoteles", detalle: error.message });        
    }
};

export const getHotelByCity = async (req, res) => {
    const { ciudad } = req.params;
    try {
        const hoteles = await Hotels.FindAll({
            where: { city: ciudad }
        });

        res.json({
            ciudad,
            total: hoteles.lenght,
            hoteles,
            fecha_actualizacion: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener hoteles", detalle: error.message });        
    }
};