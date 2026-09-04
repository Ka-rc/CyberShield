// ==========================================================
// ELEMENTOS
// ==========================================================

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyePath = document.getElementById("eyePath");
const eyeCircle = document.getElementById("eyeCircle");


// ==========================================================
// ESTADO
// ==========================================================

let passwordVisible = false;


// ==========================================================
// ÍCONES
// ==========================================================

const eyeOpen =
    "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z";

const eyeClosed =
    "M3 3l18 18 M10.6 10.6A3 3 0 0013.4 13.4 M9.9 4.2A10.7 10.7 0 0112 4c6.5 0 10 8 10 8a17.8 17.8 0 01-4.3 5.1 M6.1 6.1A17.7 17.7 0 002 12s3.5 8 10 8c1.7 0 3.2-.4 4.6-1.1";


// ==========================================================
// EVENTOS
// ==========================================================

togglePassword.addEventListener("click", togglePasswordVisibility);


// ==========================================================
// FUNÇÕES
// ==========================================================

function togglePasswordVisibility() {

    passwordVisible = !passwordVisible;

    password.type = passwordVisible ? "text" : "password";

    eyePath.setAttribute(
        "d",
        passwordVisible ? eyeClosed : eyeOpen
    );

    eyeCircle.style.display =
        passwordVisible ? "none" : "block";

    togglePassword.title =
        passwordVisible
            ? "Ocultar senha"
            : "Mostrar senha";

    togglePassword.setAttribute(
        "aria-label",
        passwordVisible
            ? "Ocultar senha"
            : "Mostrar senha"
    );
}