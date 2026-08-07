import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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

const InputCorreoLog = document.querySelector("#InputCorreoLog");
const InputContrasenaLog = document.querySelector("#InputContrasenaLog");
const btnLogin = document.querySelector("#btnLogin");

btnLogin.addEventListener("click", (e) => {
    e.preventDefault(); 

    signInWithEmailAndPassword(auth, InputCorreoLog.value, InputContrasenaLog.value)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login exitoso: " + user.email);

        window.location.href = "home.html";
    })
    .catch((error) => {
        console.error("Error en el login:", error.code, error.message);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            alert("Correo o contraseña incorrectos.");
        } else if (errorCode === 'auth/user-not-found') {
            alert("No existe una cuenta registrada con este correo.");
        } else {
            alert("Ocurrió un error al iniciar sesión: " + errorMessage);
        }
    });
});