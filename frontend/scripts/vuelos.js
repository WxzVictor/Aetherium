import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Inicializa Firebase
const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

// Verifica si el usuario está autenticado y su email verificado
onAuthStateChanged(auth, (user) => {
  const contenido = document.getElementById("contenido");
  if (!user || !user.emailVerified) {
    window.location.href = "/login";
  } else {
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

// Variables para viajeros
let cantidadAdultos = 1;
let cantidadNiños = 0;

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

  manejarAutocomplete("origen", "sugerenciasOrigen");
  manejarAutocomplete("destino", "sugerenciasDestino");
});

function intercambiarValores() {
  const origen = document.getElementById("origen");
  const destino = document.getElementById("destino");
  [origen.value, destino.value] = [destino.value, origen.value];
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

// NUEVO AUTOCOMPLETADO CON TU API
function manejarAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  input.addEventListener("input", async () => {
    const query = input.value.trim();

    if (query.length < 2) {
      dropdown.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`/api/aeropuertos?q=${encodeURIComponent(query)}`);
      const resultados = await res.json();

      dropdown.innerHTML = "";
      resultados.slice(0, 10).forEach(({ ciudad, pais, codigo }) => {
        const div = document.createElement("div");
        div.classList.add("sugerencia");
        div.textContent = `${ciudad}, ${pais} (${codigo})`;
        div.addEventListener("click", () => {
          input.value = `${ciudad}, ${pais} (${codigo})`;
          dropdown.innerHTML = "";
        });
        dropdown.appendChild(div);
      });
    } catch (err) {
      console.error("Error en autocomplete:", err);
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      dropdown.innerHTML = "";
    }, 150);
  });
}

async function buscarVuelos(e) {
  e.preventDefault();

  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const fechaIda = document.getElementById("fechaIda").value;
  const fechaVuelta = document.getElementById("fechaVuelta").value || fechaIda; // fallback
  const adultos = document.getElementById("contadorAdultos").textContent;

  if (!origen || !destino || !fechaIda) {
    alert("❌ Completa origen, destino y fecha de ida");
    return;
  }

  try {
    const codigoOrigen = origen.match(/\(([A-Z]{3})\)/)?.[1] || origen;
    const codigoDestino = destino.match(/\(([A-Z]{3})\)/)?.[1] || destino;

    const botonBuscar = document.querySelector(".boton-buscar");
    botonBuscar.textContent = "Buscando...";
    botonBuscar.disabled = true;

    const url = `/vuelos/${codigoOrigen}/${codigoDestino}/${fechaIda}/${fechaVuelta}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Error en la búsqueda");

    const data = await response.json();

    
    //No se si funciona, redirigir a la pagina que hagamos para el resultado de la busqueda.
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

