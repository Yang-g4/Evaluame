import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


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

const tituloEvento = document.getElementById("titulo-evento");
const subtituloCarrera = document.getElementById("subtitulo-carrera");
const descripcionEvento = document.getElementById("descripcion-evento");
const contenedorParametros = document.getElementById("contenedor-parametros-evaluar");
const formCalificar = document.getElementById("form-calificar");

let datosRubrica = null;

async function obtenerRubrica() {
    if (!rubricaId) {
        alert("No se encontró el ID del proyecto a evaluar.");
        window.location.href = "./home.html";
        return;
    }

    try {
        const docRef = doc(db, "rubricas", rubricaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            datosRubrica = docSnap.data();
            renderizarFormularioEvaluacion(datosRubrica);
        } else {
            tituloEvento.textContent = "El proyecto solicitado no existe.";
            contenedorParametros.innerHTML = "";
        }
    } catch (error) {
        console.error("Error al obtener la rúbrica:", error);
        alert("Ocurrió un error al cargar la información del proyecto.");
    }
}


function renderizarFormularioEvaluacion(rubrica) {
    tituloEvento.textContent = rubrica.nombreEvento || 'Sin Nombre';
    subtituloCarrera.textContent = rubrica.carrera ? `Carrera: ${rubrica.carrera}` : "Sin carrera asignada";
    descripcionEvento.textContent = rubrica.descripcion || "Sin descripción disponible.";

    contenedorParametros.innerHTML = ""; 

    if (!rubrica.parametros || rubrica.parametros.length === 0) {
        contenedorParametros.innerHTML = "<p>Esta rúbrica no tiene parámetros registrados.</p>";
        return;
    }

    rubrica.parametros.forEach((parametro, index) => {
        const tarjetaParametro = document.createElement("div");
        tarjetaParametro.classList.add("tarjeta-parametro-evaluar");
        tarjetaParametro.innerHTML = `
            <div class="fila-parametro-principal">
                <div class="info-parametro">
                    <label for="score-${index}">${parametro}</label>
                </div>
                <div class="control-calificacion">
                    <input 
                        type="number" 
                        id="score-${index}" 
                        class="input-puntos"
                        data-parametro="${parametro}" 
                        min="0" 
                        max="10" 
                        step="0.5" 
                        placeholder="0 - 10" 
                        required 
                    />
                    <span class="max-puntos">/ 10 pts</span>
                </div>
            </div>
            <!-- Comentario individual opcional -->
            <input 
                type="text" 
                class="input-nota-parametro" 
                placeholder="Comentario sobre este punto (opcional)"
            />
        `;
        contenedorParametros.appendChild(tarjetaParametro);
    });
}


formCalificar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreEquipo = document.getElementById("nombre-equipo").value.trim();
    const observacionesGenerales = document.getElementById("observaciones-generales").value.trim();
    const tarjetasParametros = contenedorParametros.querySelectorAll(".tarjeta-parametro-evaluar");

    const detallesCalificacion = [];
    let sumaPuntos = 0;

    tarjetasParametros.forEach(tarjeta => {
        const inputNum = tarjeta.querySelector(".input-puntos");
        const inputNota = tarjeta.querySelector(".input-nota-parametro");

        const valor = parseFloat(inputNum.value) || 0;
        sumaPuntos += valor;

        detallesCalificacion.push({
            parametro: inputNum.getAttribute("data-parametro"),
            puntaje: valor,
            nota: inputNota.value.trim() || null
        });
    });

    const totalParametros = tarjetasParametros.length;
    const promedio = totalParametros > 0 ? (sumaPuntos / totalParametros).toFixed(2) : 0;

    try {
        await addDoc(collection(db, "evaluaciones"), {
            rubricaId: rubricaId,
            nombreEvento: datosRubrica.nombreEvento,
            nombreEquipo: nombreEquipo,
            calificaciones: detallesCalificacion,
            observaciones: observacionesGenerales || "Sin observaciones",
            puntajeTotal: sumaPuntos,
            promedioFinal: parseFloat(promedio),
            fechaEvaluacion: serverTimestamp()
        });

        alert(`¡Evaluación guardada con éxito!\nEquipo: ${nombreEquipo}\nPromedio Final: ${promedio}`);
        window.location.href = "./home.html";
    } catch (error) {
        console.error("Error al guardar la evaluación:", error);
        alert("Ocurrió un error al intentar registrar la evaluación.");
    }
});


obtenerRubrica();