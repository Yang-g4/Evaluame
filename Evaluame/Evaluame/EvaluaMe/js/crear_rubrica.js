import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpX3I0pwZ3xRkIk9Ifzf5Ly3MhqqUakgQ",
  authDomain: "evaluame-c0498.firebaseapp.com",
  projectId: "evaluame-c0498",
  storageBucket: "evaluame-c0498.firebasestorage.app",
  messagingSenderId: "276754715944",
  appId: "1:276754715944:web:b25c46ede4735990f5ec1d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let parametros = [];

const inputParametro = document.getElementById("input-parametro");
const btnAgregar = document.getElementById("btn-agregar");
const listaParametros = document.getElementById("lista-parametros");
const mensajeVacio = document.getElementById("mensaje-vacio");
const formEvaluacion = document.getElementById("form-evaluacion");

function renderizarParametros() {
    listaParametros.innerHTML = "";
    
    if (parametros.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }
    
    mensajeVacio.style.display = "none";

    parametros.forEach((param, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${param}</span>
            <button type="button" class="btn-eliminar" data-index="${index}">&times;</button>
        `;
        listaParametros.appendChild(li);
    });
}

btnAgregar.addEventListener("click", () => {
    const texto = inputParametro.value.trim();
    if (texto !== "") {
        parametros.push(texto);
        inputParametro.value = "";
        renderizarParametros();
    }
});

listaParametros.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        const index = e.target.getAttribute("data-index");
        parametros.splice(index, 1);
        renderizarParametros();
    }
});

formEvaluacion.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreEvento = document.getElementById("nombre-evento").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const carrera = document.getElementById("carrera").value.trim();
    const grupos = document.getElementById("grupos").value.trim();
    const fechaInicio = document.getElementById("fecha-inicio").value;
    const fechaFin = document.getElementById("fecha-fin").value;

    if (parametros.length === 0) {
        alert("Por favor agrega al menos un parámetro antes de guardar.");
        return;
    }

    try {
        await addDoc(collection(db, "rubricas"), {
            nombreEvento,
            descripcion,
            carrera,
            grupos,
            fechaInicio,
            fechaFin,
            parametros,
            creadoEn: serverTimestamp()
        });

        alert("¡Rúbrica guardada exitosamente!");
        window.location.href = "./home.html"; 
    } catch (error) {
        console.error("Error al guardar en Firebase:", error);
        alert("Ocurrió un error al guardar la rúbrica.");
    }
});