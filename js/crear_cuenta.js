import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { 
  getFirestore,
  collection, 
  addDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const InputUsuario = document.querySelector("#InputUsuario")
const InputCorreo = document.querySelector("#InputCorreo")
const InputContrasena = document.querySelector("#InputContrasena")
const btnRegistrar = document.querySelector("#btnRegistrar")
const InputCorreoLog = document.querySelector("#InputCorreoLog")
const InputContrasenaLog = document.querySelector("#InputContrasenaLog")
const btnLogin = document.querySelector("#btnLogin")

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

btnRegistrar.addEventListener("click", (e) => {
    e.preventDefault();

    const usuario = InputUsuario.value;
    const correo = InputCorreo.value;
    const contrasena = InputContrasena.value 

    createUserWithEmailAndPassword(auth, correo, contrasena) 
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuario registrado:", user);

        window.location.href = "home.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", errorCode, errorMessage);

        if (errorCode === 'auth/email-already-in-use') {
            alert("Este correo ya está registrado, intenta otra vez");
        } else if (errorCode === 'auth/weak-password') {
            alert("La contraseña es muy débil, debe tener al menos 6 caracteres.");
        } else {
            alert("Ocurrió un error al registrarse: " + errorMessage);
        }
    });
});s