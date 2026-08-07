import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const contenedorProyectos = document.querySelector(".contenedor-proyectos");

onSnapshot(collection(db, "rubricas"), (snapshot) => {
    contenedorProyectos.innerHTML = "";

    if (snapshot.empty) {
        contenedorProyectos.innerHTML = "<p>No hay proyectos registrados aún.</p>";
        return;
    }

    snapshot.forEach((docSnap) => {
        const proyecto = docSnap.data();
        const id = docSnap.id;
        
        const fechaInicio = proyecto.fechaInicio ? proyecto.fechaInicio : 'N/A';
        const fechaFin = proyecto.fechaFin ? proyecto.fechaFin : 'N/A';

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-proyecto");
        tarjeta.innerHTML = `
            <div class="encabezado-tarjeta">
                <h3>${proyecto.nombreEvento || 'Sin Nombre'}</h3>
                <button class="btn-eliminar-tarjeta" data-id="${id}" title="Eliminar proyecto">&times;</button>
            </div>
            <p class="carrera">${proyecto.carrera || 'Sin carrera asignada'}</p>
            <p class="descripcion">${proyecto.descripcion || 'Sin descripción'}</p>
            
            <div class="fechas-proyecto">
                <p><strong>Inicio:</strong> ${fechaInicio}</p>
                <p><strong>Fin:</strong> ${fechaFin}</p>
            </div>

            <div class="meta-info">
                <span><strong>Grupos:</strong> ${proyecto.grupos || 'N/A'}</span>
                <span><strong>Parámetros:</strong> ${proyecto.parametros ? proyecto.parametros.length : 0}</span>
            </div>

            <div class="acciones-tarjeta">
                <button class="btn-evaluar" data-id="${id}">Evaluar</button>
                <button class="btn-ver-calificaciones" data-id="${id}">Ver Resultados</button>
            </div>
        `;
        
        contenedorProyectos.appendChild(tarjeta);
    });
}, (error) => {
    console.error("Error leyendo Firestore: ", error);
});

contenedorProyectos.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-eliminar-tarjeta")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
            try {
                await deleteDoc(doc(db, "rubricas", id));
                alert("Proyecto eliminado correctamente.");
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    }

    if (e.target.classList.contains("btn-evaluar")) {
        const id = e.target.getAttribute("data-id");
        window.location.href = `./evaluar.html?id=${id}`;
    }

    if (e.target.classList.contains("btn-ver-calificaciones")) {
        const id = e.target.getAttribute("data-id");
        window.location.href = `./calificaciones.html?id=${id}`;
    }
});