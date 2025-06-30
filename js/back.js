// conexion.js

const API_BASE = "https://pablit-html.onrender.com/api/users";

export async function registerUser(email, password) {
    try {
        const res = await fetch(`${API_BASE}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al registrar");
        return data;
    } catch (err) {
        throw err;
    }
}

export async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Credenciales inválidas");
        return data;
    } catch (err) {
        throw err;
    }
}

