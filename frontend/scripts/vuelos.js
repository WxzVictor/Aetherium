import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Inicializa Firebase
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

// Verifica si el usuario está autenticado (añadir tambien por cookies)
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

// Función para buscar vuelos
async function buscarVuelos(e) {
  e.preventDefault();
  
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const fechaIda = document.getElementById("fechaIda").value;
  const adultos = document.getElementById("contadorAdultos").textContent;

  // Validación básica
  if (!origen || !destino || !fechaIda) {
    alert("❌ Completa origen, destino y fecha de ida");
    return;
  }

  try {
    const codigoOrigen = origen.match(/\(([A-Z]{3})\)/)?.[1] || origen;
    const codigoDestino = destino.match(/\(([A-Z]{3})\)/)?.[1] || destino;

    // Mostrar loader
    const botonBuscar = document.querySelector(".boton-buscar");
    botonBuscar.textContent = "Buscando...";
    botonBuscar.disabled = true;

    // Enviar datos como POST para guardar en sesión
    const response = await fetch("/vuelos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        origen: codigoOrigen,
        destino: codigoDestino,
        fecha: fechaIda,
        pasajeros: adultos
      })
    });

    if (!response.ok) throw new Error("Error en la búsqueda");
    
    // Redirigir a resultados (los datos ya están en req.session)
    window.location.href = "/resultados-vuelos";

  } catch (error) {
    console.error("Error:", error);
    alert("🚨 Error al buscar vuelos");
  } finally {
    const botonBuscar = document.querySelector(".boton-buscar");
    botonBuscar.textContent = "Buscar";
    botonBuscar.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botonIntercambiar").addEventListener("click", intercambiarValores);
  document.getElementById("abrirDesplegable").addEventListener("click", mostrarDesplegable);
  document.getElementById("botonAplicar").addEventListener("click", aplicarSeleccion);
  document.querySelector(".boton-buscar").addEventListener("click", buscarVuelos);

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

async function manejarInput(input, dropdown) {
  let aeropuertos = [];

  // Cargamos el JSON de aeropuertos una sola vez
  if (aeropuertos.length === 0) {
    const res = await fetch("/scripts/data/aeropuertos.json");
    aeropuertos = await res.json();
  }

  input.addEventListener("input", () => {
    inputActivo = input;
    dropdown.innerHTML = "";
    const texto = input.value.trim().toLowerCase();
    if (texto.length < 2) return;

    const coincidencias = aeropuertos.filter(a =>
      a.ciudad.toLowerCase().includes(texto) ||
      a.codigo.toLowerCase().includes(texto) ||
      a.pais.toLowerCase().includes(texto)
    );

    coincidencias.slice(0, 10).forEach(item => {
      dropdown.appendChild(crearSugerencia(item));
    });
  });

  input.addEventListener("blur", () => {
    setTimeout(() => cerrarDropdown(), 150);
  });
}
function crearSugerencia({ ciudad, codigo, pais }) {
  const div = document.createElement("div");
  div.classList.add("sugerencia");
  div.textContent = `${ciudad}, ${pais} (${codigo})`;
  div.addEventListener("click", () => {
    inputActivo.value = `${ciudad}, ${pais} (${codigo})`;
    cerrarDropdown();
  });
  return div;
}

function cerrarDropdown() {
  document.getElementById("sugerenciasOrigen").innerHTML = "";
  document.getElementById("sugerenciasDestino").innerHTML = "";
}

