// Elementos base
const popup = document.querySelector(".popup");
const modalLogin = document.querySelector(".modal-login");
const overlay = document.querySelector(".modal-overlay");
const API = "https://pablit-html.onrender.com/api/users";

// Mostrar el modal de registro
document.querySelector("#show-register")?.addEventListener("click", () => {
    popup.classList.add("active");
    modalLogin.classList.remove("active");
    overlay.classList.add("active");
});

// Cerrar el modal de registro
document.querySelector("#close-btn")?.addEventListener("click", () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
});

// Mostrar el modal de login
document.querySelector("#show-login-btn")?.addEventListener("click", () => {
    modalLogin.classList.add("active");
    popup.classList.remove("active");
    overlay.classList.add("active");
});

// Cerrar el modal de login
document.querySelector("#close-login")?.addEventListener("click", () => {
    modalLogin.classList.remove("active");
    overlay.classList.remove("active");
});

// Cambiar entre modales
document.querySelector("#link-to-login-modal")?.addEventListener("click", () => {
    modalLogin.classList.add("active");
    popup.classList.remove("active");
});

document.querySelector("#link-to-register-modal")?.addEventListener("click", () => {
    popup.classList.add("active");
    modalLogin.classList.remove("active");
});

// Registro de usuario
document.querySelector("#crear-usuario")?.addEventListener("click", async () => {
    const username = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const weight = parseFloat(document.querySelector("#weight").value);
    const age = parseInt(document.querySelector("#age").value);
    const sex = document.querySelector("#sex").value;

    if (!username || !password || !weight || !age || !sex) {
        return alert("Por favor completa todos los campos");
    }

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, weight, age, sex })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al registrar");

        alert("Usuario creado con éxito");
        popup.classList.remove("active");
        overlay.classList.remove("active");
    } catch (err) {
        alert("Error: " + err.message);
        console.error(err);
    }
});

// Login de usuario
document.querySelector("#acceder")?.addEventListener("click", async () => {
    const username = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value;

    if (!username || !password) {
        return alert("Por favor completa todos los campos");
    }

    try {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Credenciales incorrectas");

        // Guardar datos en localStorage
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("userId", data.id || "");

        alert("Bienvenido " + username);
        modalLogin.classList.remove("active");
        overlay.classList.remove("active");

        // Redirigir a workout
        window.location.href = "../paginas/workout.html";

    } catch (err) {
        console.error("Error en login:", err);
        alert("Error: " + err.message);
    }
});
