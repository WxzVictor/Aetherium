  // app.mjs
  import express from 'express';
  import session from 'express-session';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import dotenv from 'dotenv';
  // import router from './src/rutas/autocompletar.mjs';

  // 📌 Cargar variables de entorno desde la raíz del proyecto
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.join(__dirname, '..', 'process.env') });

  const app = express();

  // 📁 Rutas de carpetas
  const viewsPath = path.join(__dirname, '..', 'frontend', 'vistas', 'completas');
  const staticPath = path.join(__dirname, '..', 'frontend');

  // 🧠 Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuración de vistas EJS
  app.set('view engine', 'ejs');
  app.set('views', viewsPath);

  // Archivos estáticos
  app.use(express.static(staticPath));

  // Sesión (opcional)
  app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
  }));

  // 📌 Rutas de API
  // app.use(router);

  // 🏠 Ruta principal
  app.get('/', (req, res) => {
    res.render('vuelos');
  });

  // Servidor en marcha
  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
