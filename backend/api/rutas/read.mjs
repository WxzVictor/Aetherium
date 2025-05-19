import express from "express";
import conn from "../controller/config_aiven.mjs";

const router = express.Router();
//Preguntar a jose si usuarios y reservas lo da tmb la api
//Para ver todos los vuelos que hay
router.get("/vuelos", (req, res) => {
    let sql = "SELECT * FROM ";

    conn.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }

        let vuelos = result.map(elemento => ({
            //cambiar por lo que de la base de datos(preguntar al chat)
            id: elemento.id,
            equipo: elemento.equipo,
            puntos: elemento.puntos,
            estadisticas: {
                PJ: elemento.PJ,
                PG: elemento.PG,
                PE: elemento.PE,
                PP: elemento.PP,
                GF: elemento.GF,
                GC: elemento.GC,
                DG: elemento.DG
            }
        }));

        let respuesta = {
            vuelos,
            metadata: {
                total_equipos: clasificacion.length,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        // Enviar la respuesta JSON
         res.json(respuesta);
    });
});

// Ruta para buscar vuelos entre dos ciudades
router.get("/vuelos/:departure_city/:arrival_city/:departure_date/:arrival_date", (req, res) => {
    const { departure_city, arrival_city, departure_date, arrival_date } = req.params;

    const sql = "SELECT * FROM vuelos WHERE departure_city = ? AND arrival_city = ? AND departure_date = ? AND arrival_date = ?";
    const values = [departure_city, arrival_city, departure_date, arrival_date];

    conn.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }

        // Mapear los vuelos al formato personalizado
        let vuelos = result.map(vuelo => ({
            id: vuelo.id,
            aerolinea: vuelo.aerolinea,         // Ajusta estos campos según tu tabla
            numero_vuelo: vuelo.numero_vuelo,
            origen: vuelo.departure_city,
            destino: vuelo.arrival_city,
            fecha_salida: vuelo.fecha_salida,
            fecha_llegada: vuelo.fecha_llegada,
            duracion: vuelo.duracion,
            precio: vuelo.precio,
            estado: vuelo.estado
        }));

        // Estructura de la respuesta
        let respuesta = {
            vuelos,
            metadata: {
                total_vuelos: vuelos.length,
                origen: departure_city,
                destino: arrival_city,
                fechaSalida: departure_date ,
                fechaLlegada: arrival_date ,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        res.json(respuesta);
    });
});


//Hotel
router.get("/hotel", (req, res) => {
    let sql = "SELECT * FROM hotel";

    conn.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }

        let vuelos = result.map(elemento => ({
            //cambiar por lo que de la base de datos(preguntar al chat)
            id: elemento.id,
            equipo: elemento.equipo,
            puntos: elemento.puntos,
            estadisticas: {
                PJ: elemento.PJ,
                PG: elemento.PG,
                PE: elemento.PE,
                PP: elemento.PP,
                GF: elemento.GF,
                GC: elemento.GC,
                DG: elemento.DG
            }
        }));

        let respuesta = {
            vuelos,
            metadata: {
                total_equipos: clasificacion.length,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        // Enviar la respuesta JSON
         res.json(respuesta);
    });
});

//buscar hotel en ciudad y entre fechas
router.get("/hotel/:destino", (req, res) => {
    let sql = "SELECT * FROM hotel where city = ? ";

    conn.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }

        let vuelos = result.map(elemento => ({
            //cambiar por lo que de la base de datos(preguntar al chat)
            id: elemento.id,
            equipo: elemento.equipo,
            puntos: elemento.puntos,
            estadisticas: {
                PJ: elemento.PJ,
                PG: elemento.PG,
                PE: elemento.PE,
                PP: elemento.PP,
                GF: elemento.GF,
                GC: elemento.GC,
                DG: elemento.DG
            }
        }));

        let respuesta = {
            vuelos,
            metadata: {
                total_equipos: clasificacion.length,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        // Enviar la respuesta JSON
         res.json(respuesta);
    });
});

//Aeropuerto (que nos de el nombre de los aeropuertos para autcompletar la busqueda)
router.get("/aeropuertos", (req, res) => {
    let sql = "SELECT * FROM aeropuerto";

    conn.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error en la consulta a la base de datos" });
        }

        let vuelos = result.map(elemento => ({
            //cambiar por lo que de la base de datos(preguntar al chat)
            id: elemento.id,
            equipo: elemento.equipo,
            puntos: elemento.puntos,
            estadisticas: {
                PJ: elemento.PJ,
                PG: elemento.PG,
                PE: elemento.PE,
                PP: elemento.PP,
                GF: elemento.GF,
                GC: elemento.GC,
                DG: elemento.DG
            }
        }));

        let respuesta = {
            vuelos,
            metadata: {
                total_equipos: clasificacion.length,
                fecha_actualizacion: new Date().toISOString()
            }
        };

        // Enviar la respuesta JSON
         res.json(respuesta);
    });
});

