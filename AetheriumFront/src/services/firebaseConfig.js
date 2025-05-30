import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

// Mostrar en consola para verificar que la clave API está siendo cargada correctamente
console.log("API KEY:", import.meta.env.VITE_API_KEY);

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de autenticación
const auth = getAuth(app);

// Establecer la persistencia de sesión
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // La sesión ahora dura solo durante la sesión activa del navegador
    console.log("Persistencia de sesión configurada para durar solo mientras el navegador esté abierto.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia de sesión:", error);
  });

// Exportar auth para poder usarlo en otros componentes
export { auth };
