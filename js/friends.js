const API_FRIENDS = "https://pablit-html.onrender.com/api/friends";
const user = JSON.parse(localStorage.getItem("user"));

// 👇 FUNCIÓN PARA CARGAR TODOS LOS AMIGOS
async function loadAllFriends() {
    const list = document.getElementById('friendsList');
    list.innerHTML = "";

    try {
        const res = await fetch(API_FRIENDS);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "No se pudieron obtener los amigos");

        if (!Array.isArray(data) || data.length === 0) {
            list.innerHTML = "<tr><td colspan='3'>No tienes amigos aún.</td></tr>";
            return;
        }

        // Mostrar amigos como filas
        list.innerHTML = data.map(friend => `
            <tr>
                <td>${friend.senderUsername}</td>
                <td>${friend.receiverUsername}</td>
                <td>
                    <button onclick="deleteFriend(${friend.id})" class="btn btn-danger">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error al cargar amigos:", err);
        list.innerHTML = "<tr><td colspan='3'>Error al cargar amigos.</td></tr>";
    }
}

// 👇 AGREGAR AMIGO
async function addFriend() {
    const receiverUsername = document.getElementById('friendEmail').value.trim();
    if (!receiverUsername) return alert("Por favor ingresa un correo válido");
    if (!user || !user.username) return alert("Usuario no autenticado");

    try {
        const res = await fetch(API_FRIENDS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senderUsername: user.username,
                receiverUsername
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "No se pudo agregar al amigo");

        alert("Solicitud enviada a " + receiverUsername);
        document.getElementById('friendEmail').value = "";
        loadAllFriends(); // ✅ Ya está definida
    } catch (err) {
        console.error(err);
        alert("Error al agregar amigo: " + err.message);
    }
}

// 👇 ELIMINAR AMIGO
async function deleteFriend(id) {
    if (!confirm("¿Estás segura de eliminar esta amistad?")) return;

    try {
        const res = await fetch(`${API_FRIENDS}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "No se pudo eliminar");
        }

        alert("Amigo eliminado con éxito");
        loadAllFriends();
    } catch (err) {
        console.error("Error al eliminar amigo:", err);
        alert("Error: " + err.message);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const nameSpan = document.getElementById("userName");
    if (user?.username && nameSpan) {
        nameSpan.innerHTML = user.username;
    }

    loadAllFriends(); // ✅ Llamada válida
});
