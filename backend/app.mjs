import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/rutas/autocompletar.mjs'; // Importar la ruta de autocompletar

const app = express();

// Obtener el nombre del archivo y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cambiar la ruta para buscar vistas en frontend/vistas/completas
const viewsPath = path.join(__dirname, '..', 'frontend', 'vistas', 'completas');

// Configuración de la vista (si usas EJS)
app.set('view engine', 'ejs');
app.set('views', viewsPath);  // Apuntar a la ruta correcta de las vistas

// Configuración de sesión (si es necesario)
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true,
}));

// Configuración de la ruta estática para archivos públicos (por ejemplo, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas que has creado
app.use(router); // Esto conecta la ruta de autocompletar con el servidor

// Ruta de inicio o login (puedes agregar otras rutas de tu aplicación)
app.get('/', (req, res) => {
  res.render('vuelos'); // Renderizar la vista vuelos.ejs en frontend/vistas/completas
});

// Configurar el puerto del servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
