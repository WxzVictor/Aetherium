import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth para poder usarlo en otros componentes
const auth = getAuth(app);

export { auth };