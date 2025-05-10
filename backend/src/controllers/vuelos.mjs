import { buscarVuelosPorRuta } from "./peticionesAxio.mjs";

export const buscarVuelos = async (req, res) => {
    try {
        const { origen, destino, fecha } = req.body;
        if (!origen || !destino || !fecha) {
            return res.status(400).json({ error: "Faltan datos obligatorios: origen, destino o fecha" });
        }
    
        const vuelos = await buscarVuelosPorRuta(origen, destino, fecha);

        vuelos.forEach(v => {
            v.asientos_disponibles = Math.floor(Math.random() * 10) + 1;
            v.precio = Math.floor(Math.random() * 500) + 100; // Precio aleatorio entre 100-600
        });

        req.session.vuelos = vuelos; // Guardar en sesión del servidor
        
        res.status(200).json(vuelos);
    } catch (error) {
        console.error("Error al buscar vuelos:", error);
        res.status(500).json({ error: "Error interno al buscar vuelos" });
    }
}