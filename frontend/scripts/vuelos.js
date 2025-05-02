import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Inicializa Firebase
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

// Verifica si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  const contenido = document.getElementById("contenido");
  if (!user || !user.emailVerified) {
    window.location.href = "/login";
  }
  else{
    contenido.style.display = "block";
  }
});

// Cerrar sesión
const btnCerrarSesion = document.getElementById("cerrarSesionBtn");

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


let cantidadAdultos = 1;
let cantidadNiños = 0;
let inputActivo = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botonIntercambiar").addEventListener("click", intercambiarValores);
  document.getElementById("abrirDesplegable").addEventListener("click", mostrarDesplegable);
  document.getElementById("botonAplicar").addEventListener("click", aplicarSeleccion);

  document.querySelectorAll("[data-cambio]").forEach(boton => {
    boton.addEventListener("click", () => {
      const tipo = boton.getAttribute("data-tipo");
      const cambio = parseInt(boton.getAttribute("data-cambio"), 10);
      modificarCantidad(tipo, cambio);
    });
  });

  manejarInput(document.getElementById("origen"), document.getElementById("sugerenciasOrigen"));
  manejarInput(document.getElementById("destino"), document.getElementById("sugerenciasDestino"));
});

function intercambiarValores() {
  const origen = document.getElementById("origen");
  const destino = document.getElementById("destino");
  const temporal = origen.value;
  origen.value = destino.value;
  destino.value = temporal;
}

function mostrarDesplegable() {
  const desplegable = document.getElementById("desplegableViajeros");
  desplegable.style.display = desplegable.style.display === "block" ? "none" : "block";
}

function modificarCantidad(tipo, cambio) {
  if (tipo === 'adulto') {
    cantidadAdultos = Math.max(1, cantidadAdultos + cambio);
    document.getElementById("contadorAdultos").innerText = cantidadAdultos;
  } else {
    cantidadNiños = Math.max(0, cantidadNiños + cambio);
    document.getElementById("contadorNiños").innerText = cantidadNiños;
  }
}

function aplicarSeleccion() {
  const total = cantidadAdultos + cantidadNiños;
  const texto = `${total} ${total === 1 ? "Viajero" : "Viajeros"}, Turista`;
  document.getElementById("infoViajeros").value = texto;
  mostrarDesplegable();
}
/*
function crearSugerencia({ ciudad, codigo, pais }) {
  const div = document.createElement("div");
  div.classList.add("sugerencia");
  div.innerHTML = `
    <span class="sugerencia-icono">✈️</span>
    <div>
      <div class="sugerencia-texto-principal">${ciudad} <strong>(${codigo})</strong></div>
      <div class="sugerencia-texto-secundario">${pais}</div>
    </div>
  `;
  div.addEventListener("click", () => {
    inputActivo.value = `${ciudad} (${codigo})`;
    cerrarDropdown();
  });
  return div;
}

function manejarInput(input, dropdown) {
  input.addEventListener("input", async () => {
    inputActivo = input;
    dropdown.innerHTML = "";
    const texto = input.value.trim();
    if (texto.length < 2) return;

    try {
      const res = await fetch(`/api/vuelos?busqueda=${encodeURIComponent(texto)}`);
      const datos = await res.json();

      datos.forEach(item => {
        dropdown.appendChild(crearSugerencia(item));
      });
    } catch (err) {
      console.error("Error al buscar aeropuertos:", err);
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => cerrarDropdown(), 150);
  });
}

function cerrarDropdown() {
  document.querySelectorAll(".dropdown-sugerencias").forEach(drop => drop.innerHTML = "");
}
*/