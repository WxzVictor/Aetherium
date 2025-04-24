// backend/src/rutas/autocompletar.mjs
/*import express from "express";
import { obtenerAeropuertosPorNombre } from "../controllers/peticionesAxio.mjs";

const router = express.Router();

router.get("/api/vuelos", async (req, res) => {
  const { busqueda } = req.query; // Cambié el parámetro de "query" a "busqueda" para que sea coherente con tu solicitud

  if (!busqueda || busqueda.length < 2) {
    return res.status(400).json({ error: "Consulta demasiado corta" });
  }

  try {
    const aeropuertos = await obtenerAeropuertosPorNombre(busqueda);
    res.json(aeropuertos);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar aeropuertos" });
  }
});

export default router;*/
