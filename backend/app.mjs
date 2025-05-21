import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Rutas
import registerRouter from './src/rutas/register.mjs';
import loginRouter from './src/rutas/login.mjs';
import vuelosRouter from './src/rutas/vuelos.mjs';
import resultadoVuelos from './src/rutas/resultadoVuelos.mjs'

//rutas api
//import rutasLectura from "../api/rutas/read.mjs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const app = express();

// 📁 Rutas de carpetas
const viewsPath = path.join(__dirname, '..', 'frontend', 'vistas', 'completas');
const staticPath = path.join(__dirname, '..', 'frontend');

// 🧠 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', viewsPath);

const scriptsPath = path.join(__dirname, '..', 'frontend', 'scripts');
app.use('/scripts', express.static(scriptsPath));


// Archivos estáticos (CSS, JS frontend, imágenes, etc.)
app.use(express.static(staticPath));


// Sesión (opcional, si luego quieres manejar login de backend)
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true,
}));

// 📌 Rutas de la app (login y registro)
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use('/', vuelosRouter);
app.use('/', resultadoVuelos);



//app.use('/api', rutasLectura);

// Redirigir raíz a registro
app.use('/', (req, res) => {
  res.redirect('/register');
});


// 🚀 Levantar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
