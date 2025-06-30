const API = "https://pablit-html.onrender.com/api/reports";

async function buscarPorNivel() {
  const nivel = document.getElementById("levelInput").value;
  const tbody = document.querySelector("#tablaNivel tbody");
  tbody.innerHTML = "";

  if (!nivel) return alert("Por favor ingresa un nivel");

  try {
    const res = await fetch(`${API}/findByLevel/${nivel}`);
    if (!res.ok) {
      const msg = await res.text();
      return alert(msg);
    }

    const users = await res.json();
    users.forEach(user => {
      const row = `<tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.age}</td>
        <td>${user.sex}</td>
        <td>${user.weight}</td>
        <td>${user.level}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    alert("Error al buscar por nivel");
    console.error(err);
  }
}

async function buscarPorUsername() {
  const username = document.getElementById("usernameInput").value;
  const tbody = document.querySelector("#tablaUsername tbody");
  tbody.innerHTML = "";

  if (!username) return alert("Por favor ingresa un username");

  try {
    const res = await fetch(`${API}/${username}`);
    if (!res.ok) {
      const msg = await res.text();
      return alert(msg);
    }

    const user = await res.json();
    const entries = Object.entries(user);
    entries.forEach(([key, value]) => {
      const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    alert("Error al buscar usuario");
    console.error(err);
  }
}

async function cargarTodos() {
  const tbody = document.querySelector("#tablaTodos tbody");
  tbody.innerHTML = "";

  try {
    const res = await fetch(`${API}`);
    if (!res.ok) {
      const msg = await res.text();
      return alert(msg);
    }

    const users = await res.json();
    users.forEach(user => {
      const row = `<tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.age}</td>
        <td>${user.sex}</td>
        <td>${user.weight}</td>
        <td>${user.level}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    alert("Error al cargar usuarios");
    console.error(err);
  }
}