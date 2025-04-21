import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/rutas/autocompletar.mjs';

const app = express();

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Rutas de carpetas
const viewsPath = path.join(__dirname, '..', 'frontend', 'vistas', 'completas');
const staticPath = path.join(__dirname, '..', 'frontend');

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', viewsPath);

// Configuración de archivos estáticos (CSS, JS)
app.use(express.static(staticPath));

// Sesión (si es necesario)
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true,
}));

// Rutas adicionales
app.use(router);

// Ruta principal
app.get('/', (req, res) => {
  res.render('vuelos');
});

// Servidor en marcha
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
