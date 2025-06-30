window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userCard = document.getElementById("userCard");
  const editName = document.getElementById("editName");
  const editAge = document.getElementById("editAge");
  const editWeight = document.getElementById("editWeight");
  const editSex = document.getElementById("editSex");

  if (user) {
    // Mostrar información del usuario
    userCard.innerHTML = `
      <h2>Hola, <span id="userName">${user.username}</span></h2>
      <p>Edad: <span id="userAge">${user.age}</span></p>
      <p>Peso: <span id="userWeight">${user.weight}</span> kg</p>
      <p>Sexo: <span id="userSex">${user.sex}</span></p>
    `;

    // Rellenar el formulario con datos actuales
    editName.value = user.username || "";
    editAge.value = user.age || "";
    editWeight.value = user.weight || "";
    editSex.value = user.sex || "Otro";
  } else {
    userCard.innerHTML = `<p class="no-user-msg">No hay datos de usuario disponibles</p>`;
  }

  userCard.style.display = "flex";

  // Evento para enviar formulario
  const editForm = document.getElementById("editUserForm");
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener datos nuevos
    const username = editName.value.trim();
    const age = parseInt(editAge.value, 10);
    const weight = parseFloat(editWeight.value);
    const sex = editSex.value;

    if (!username || isNaN(age) || isNaN(weight) || !sex) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    if (!user || !user.id) {
      alert("No se encontró usuario para editar.");
      return;
    }

    // Construir objeto con rol incluido
    const updatedUserData = {
      id: user.id,
      username: username,
      age: age,
      weight: weight,
      sex: sex,
      rol: user.rol // ← Asegúrate de que el login.js guarda el rol en localStorage
    };

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`https://pablit-html.onrender.com/api/users/editByID/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updatedUserData)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Respuesta del backend:", data);
        throw new Error(data.message || JSON.stringify(data) || "Error al actualizar perfil");
      }

      // Actualizar localStorage y vista
      const updatedUser = { ...user, username, age, weight, sex };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      userCard.innerHTML = `
        <h2>Hola, <span id="userName">${updatedUser.username}</span></h2>
        <p>Edad: <span id="userAge">${updatedUser.age}</span></p>
        <p>Peso: <span id="userWeight">${updatedUser.weight}</span> kg</p>
        <p>Sexo: <span id="userSex">${updatedUser.sex}</span></p>
      `;

      alert("Perfil actualizado con éxito");
      toggleEditForm();
    } catch (error) {
      alert("Error: " + error.message);
      console.error(error);
    }
  });
});

function toggleEditForm() {
  const editSection = document.getElementById("editUserSection");
  editSection.style.display = editSection.style.display === "none" ? "block" : "none";
}

function logout() {
  if (confirm("¿Estás segura que deseas cerrar sesión?")) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "../paginas/login.html"; // o la ruta que corresponda
  }
}
