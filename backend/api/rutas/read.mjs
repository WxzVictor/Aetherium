import express from "express";
import conn from "../controller/config_aiven.mjs";

const router = express.Router();
//Preguntar a jose si usuarios y reservas lo da tmb la api
//Para ver todos los vuelos que hay
router.get("/vuelos", async (req, res) => {
    try {
        const vuelos = await Flights.findAll({
            include: [
                { model: Airports, as: "departureAirport", attributes: ["airportName", "city", "countryCode"] },
                { model: Airports, as: "arrivalAirport", attributes: ["airportName", "city", "countryCode"] }
            ]
        });

        const respuesta = {
            vuelos: vuelos.map(v => ({
                id: v.flightId,
                numero_vuelo: v.flightNumber,
                aerolinea: v.airlineName,
                origen: v.departureAirport.city,
                destino: v.arrivalAirport.city,
                fecha_salida: v.departureTime,
                fecha_llegada: v.arrivalTime,
                duracion: v.durationMinutes,
                precio: v.price
            })),
            metadata: {
                total_vuelos: vuelos.length,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        res.json(respuesta);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener vuelos", detalle: err.message });
    }
});


// Ruta para buscar vuelos entre dos ciudades
router.get("/vuelos/:origen/:destino/:fecha_salida/:fecha_llegada", async (req, res) => {
    const { origen, destino, fecha_salida, fecha_llegada } = req.params;

    try {
        const vuelos = await Flights.findAll({
            include: [
                { model: Airports, as: "departureAirport", where: { city: origen }, attributes: [] },
                { model: Airports, as: "arrivalAirport", where: { city: destino }, attributes: [] }
            ],
            where: {
                departureTime: { [Op.gte]: new Date(fecha_salida) },
                arrivalTime: { [Op.lte]: new Date(fecha_llegada) }
            }
        });

        const respuesta = {
            vuelos: vuelos.map(v => ({
                id: v.flightId,
                numero_vuelo: v.flightNumber,
                aerolinea: v.airlineName,
                origen,
                destino,
                fecha_salida: v.departureTime,
                fecha_llegada: v.arrivalTime,
                duracion: v.durationMinutes,
                precio: v.price
            })),
            metadata: {
                total_vuelos: vuelos.length,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        res.json(respuesta);
    } catch (err) {
        res.status(500).json({ error: "Error al buscar vuelos", detalle: err.message });
    }
});


//Aeropuertos
router.get("/aeropuertos", async (req, res) => {
    try {
        const aeropuertos = await Airports.findAll();

        res.json({
            aeropuertos: aeropuertos.map(a => ({
                codigo: a.airportCode,
                nombre: a.airportName,
                ciudad: a.city,
                pais: a.countryCode
            }))
        });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener aeropuertos", detalle: err.message });
    }
});

//Asientos
router.get("/asientos/:flightId", async (req, res) => {
    const { flightId } = req.params;

    try {
        const asientos = await Seats.findAll({
            where: {
                flightId,
                seatStatus: false // false = disponible
            }
        });

        res.json({
            asientos_disponibles: asientos.map(s => ({
                id: s.seatId,
                numero: s.seatNumber,
                clase: s.seatClass,
                tipo: s.seatType
            })),
            total_disponibles: asientos.length
        });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener asientos", detalle: err.message });
    }
});



//Hotel
router.get("/hoteles/:ciudad", async (req, res) => {
    const { ciudad } = req.params;

    try {
        const hoteles = await sequelize.query(
            "SELECT * FROM hotels WHERE city = ?",
            { replacements: [ciudad], type: sequelize.QueryTypes.SELECT }
        );

        res.json({
            hoteles,
            total: hoteles.length,
            ciudad,
            fecha_actualizacion: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener hoteles", detalle: err.message });
    }
});
