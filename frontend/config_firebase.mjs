// frontend/config_firebase.mjs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.DOMAIN,
    projectId: process.env.PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
