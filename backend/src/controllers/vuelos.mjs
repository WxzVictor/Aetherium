import { Flight, Airport, Seat } from '../models/index.mjs';
import { Op } from 'sequelize';

export const getAllFlights = async (req, res) => {
    try{
        const flights = await Flight.findAll({
            include: [
                { model: Airport, as: 'departureAirportCode', attributes: ['airportNme', 'city', 'airportCode']},
                { model: Airport, as: 'arrivalAirportCode', attributes: ['airportNme', 'city', 'airportCode']}
            ]
        });

        res.json({
            flights: flights.map(f => ({
                id: f.flightId,
                flightNumber: f.flightNumber,
                airlineName: f.airlineName,
                flightcode: f.flightCode,
                departureAirportCode: f.departureAirportCode,
                arrivalAirportCode: f.arrivalAirportCode,
                departureTime: f.departureTime,
                arrivalTime: f.arrivalTime,
                durationMinutes: f.durationMinutes,
                price: f.price
            })),
            metadata: {
                totalFlights: flights.length,
                lastUpdate: new Date().toISOString()
            }
        });
    }catch(err){
        res.status(500).json({ error: "Error al buscar vuelos", detalle: err.message });
    }
};

export const searchFlights = async (req, res) => {
    const { origen, destino, fecha_salida, fecha_llegada } = req.params;
    try {
        const flights = await Flight.findAll({
            include: [
                { model: Airport, as: 'departureAirportCode', where: { city: origen }, attributes: [] },
                { model: Airport, as: 'arrivalAirportCode', where: { city: destino }, attributes: [] }
            ],
            where: {
                departureAirportCode:{ [Op.gte]: new Date(fecha_salida) },
                arrivalAirportCode: { [Op.lte]: new Date(fecha_llegada)}
            }
        });

        res.json({
            flights: flights.map(f => ({
                id: f.flightId,
                flightNumber: f.flightNumber,
                airlineName: f.airlineName,
                flightcode: f.flightCode,
                departureAirportCode: f.departureAirportCode,
                arrivalAirportCode: f.arrivalAirportCode,
                departureTime: f.departureTime,
                arrivalTime: f.arrivalTime,
                durationMinutes: f.durationMinutes,
                price: f.price
            })),
            metadata: {
                totalFlights: flights.length,
                lastUpdate: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error al buscar vuelos", detalle: err.message });        
    }
};

export const getAvailableSeats = async (req, res) => {
    const [{ flightId }] = req.params;
    try {
        const seats = await Seat.FindAll({
            where: { flightId, seatStatus: false }
        });
        res.json ({
            availableSeats: seats.map(s => ({
                seatId: s.seatId,
                flightId: s.flightId, 
                seatNumber: s.seatNumber,
                seatClass: s.seatClass,
                seatType: s.seatType,
            })),
            totalAvailableSeats: seats.length
        });
    } catch (error) {
        res.status(500).json({ error: "Error al buscar asientos", detalle: err.message });        
    }
};