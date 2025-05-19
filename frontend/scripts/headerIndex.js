import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import {
    getAuth,
    onAuthStateChanged,
    signOut
  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

  const app = initializeApp(window.firebaseConfig);
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {   
    const contenido = document.getElementById("contenido");
    const navDerecha = document.querySelector(".navegacion-derecha");
    if (!user || !user.emailVerified) {
      // Usuario no autenticado o sin verificar
      if (contenido) contenido.style.display = "none";
      if (navDerecha) {
        navDerecha.innerHTML = `<a href="/login">Iniciar sesión</a>`;
      }
    } else {
      // Usuario autenticado y verificado
      if (contenido) contenido.style.display = "block";

      const nombre = user.displayName || "Usuario";

      if (navDerecha) {
        navDerecha.innerHTML = `<span>👤 ${nombre}</span> <button id="logoutBtn">Cerrar sesión</button>`;
      }

      const btnCerrarSesion = document.getElementById("logoutBtn");
      
      if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", async () => {
          try {
            await signOut(auth);
            window.location.href = "/login";
          } catch (error) {
            alert("Error al cerrar sesión: " + error.message);
          }
        });
      }      
    }
  });