// frontend/scripts/login.js
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Inicializar Firebase con config global
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Tu correo no ha sido verificado. Por favor revisa tu bandeja de entrada.");
      return;
    }

    
    // Redirigir a vuelos
    window.location.href = "/vuelos";

  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      alert("Correo o contraseña incorrectos.");
    } else {
      alert("Error al iniciar sesión: " + error.message);
    }
  }
});
