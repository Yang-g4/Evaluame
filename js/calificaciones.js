import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const rubricaId = params.get("id");

const tituloProyecto = document.getElementById("titulo-proyecto");
const totalEvaluaciones = document.getElementById("total-evaluaciones");
const contenedorCalificaciones = document.getElementById("contenedor-calificaciones");

async function cargarCalificaciones() {
    if (!rubricaId) {
        alert("ID de proyecto no válido.");
        window.location.href = "./home.html";
        return;
    }

    try {
        const rubricaSnap = await getDoc(doc(db, "rubricas", rubricaId));
        if (rubricaSnap.exists()) {
            tituloProyecto.textContent = `Resultados: ${rubricaSnap.data().nombreEvento}`;
        }

        const q = query(collection(db, "evaluaciones"), where("rubricaId", "==", rubricaId));
        const querySnapshot = await getDocs(q);

        contenedorCalificaciones.innerHTML = "";

        if (querySnapshot.empty) {
            totalEvaluaciones.textContent = "0 equipos evaluados";
            contenedorCalificaciones.innerHTML = `<div class="sin-datos"><p>Aún no hay evaluaciones registradas para este proyecto.</p></div>`;
            return;
        }

        totalEvaluaciones.textContent = `Total de evaluaciones: ${querySnapshot.size}`;

        querySnapshot.forEach((docSnap) => {
            const evalData = docSnap.data();
            
            let desgloseHTML = "";
            if (evalData.calificaciones && evalData.calificaciones.length > 0) {
                desgloseHTML = evalData.calificaciones.map(item => `
                    <div class="item-desglose">
                        <span class="param-nombre">${item.parametro}:</span>
                        <span class="param-nota"><strong>${item.puntaje}</strong> / 10 pts</span>
                        ${item.nota ? `<small class="nota-individual">"${item.nota}"</small>` : ''}
                    </div>
                `).join("");
            }

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-resultado");
            tarjeta.innerHTML = `
                <div class="encabezado-resultado">
                    <h3>${evalData.nombreEquipo || 'Equipo sin nombre'}</h3>
                    <div class="badge-promedio">
                        <span>Promedio</span>
                        <strong>${evalData.promedioFinal}</strong>
                    </div>
                </div>

                <div class="seccion-desglose">
                    <h4>Desglose de Calificación:</h4>
                    <div class="grid-desglose">
                        ${desgloseHTML}
                    </div>
                </div>

                <div class="seccion-observaciones">
                    <strong>Observaciones Generales:</strong>
                    <p>${evalData.observaciones || 'Sin observaciones.'}</p>
                </div>
            `;

            contenedorCalificaciones.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar calificaciones:", error);
        contenedorCalificaciones.innerHTML = "<p>Error al obtener las calificaciones.</p>";
    }
}

cargarCalificaciones();