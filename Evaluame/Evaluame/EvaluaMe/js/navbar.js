import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpX3I0pwZ3xRkIk9Ifzf5Ly3MhqqUakgQ",
    authDomain: "evaluame-c0498.firebaseapp.com",
    projectId: "evaluame-c0498",
    storageBucket: "evaluame-c0498.firebasestorage.app",
    messagingSenderId: "276754715944",
    appId: "1:276754715944:web:b25c46ede4735990f5ec1d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const iconoUsuario = document.querySelector("#iconoUsuario");
const menuUsuario = document.querySelector("#menuUsuario");
const nombreUsuarioMenu = document.querySelector("#nombreUsuarioMenu");
const btnCerrarSesion = document.querySelector("#btnCerrarSesion");

if (iconoUsuario && menuUsuario) {
    iconoUsuario.addEventListener("click", (e) => {
        e.stopPropagation();
        menuUsuario.classList.toggle("oculto");
    });

    document.addEventListener("click", (e) => {
        if (!menuUsuario.contains(e.target) && e.target !== iconoUsuario) {
            menuUsuario.classList.add("oculto");
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (nombreUsuarioMenu) {
            nombreUsuarioMenu.textContent = user.email;
        }
    } else {
        window.location.href = "./index.html";
    }
});

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async () => {
        try {
            await signOut(auth);
            alert("Sesión cerrada correctamente.");
            window.location.href = "./index.html";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        }
    });
}