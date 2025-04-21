let cantidadAdultos = 1;
let cantidadNiños = 0;

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
