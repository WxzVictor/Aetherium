import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Inicializar Firebase
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

// Login handler
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

    window.location.href = "/vuelos";
  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      alert("Correo o contraseña incorrectos.");
    } else {
      alert("Error al iniciar sesión: " + error.message);
    }
  }
});

// Forgot password handler
document.getElementById("forgotPasswordLink").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = prompt("Introduce tu correo electrónico para recuperar la contraseña:");

  if (email) {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Si el correo está registrado, recibirás un mensaje para restablecer tu contraseña.");
    } catch (error) {
      alert("Error al enviar el correo de recuperación: " + error.message);
    }
  }
});
