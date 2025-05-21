// backend/src/controllers/peticionesAxio.mjs
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { access } from "fs";

// Esta parte calcula el path absoluto del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura dotenv para leer "process.env"
dotenv.config({ path: path.join(__dirname, '..', '..', 'process.env') });


