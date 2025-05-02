// frontend/scripts/register.js
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Inicializar Firebase con config inyectada
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

// Función para validar la contraseña
function validarPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!validarPassword(password)) {
    alert("❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);
    alert("✅ Cuenta creada correctamente. Revisa tu correo para verificar la cuenta.");

    // Redirigir al login
    window.location.href = "/login";
    
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("❌ El correo ya está registrado.");
    } else {
      alert("❌ Error al registrar: " + error.message);
    }
  }
});
