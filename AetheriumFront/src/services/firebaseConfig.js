import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
console.log("API KEY:", import.meta.env.VITE_API_KEY);
// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth para poder usarlo en otros componentes
const auth = getAuth(app);

export { auth };
