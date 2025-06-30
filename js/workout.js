let countdown;
let timeLeft;
let currentRep = 0;
let totalReps = 0;
let workoutPhase = "Inactivo";
let isPaused = false;

const exerciseTime = 30;
const restTime = 10;
const timePerRep = exerciseTime + restTime;

let initialTimerValue = 0;

window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) {
    alert("No se encontró usuario logueado. Por favor inicia sesión.");
    return;
  }
  const userId = user.id;

  const startWorkoutBtn = document.getElementById('startWorkoutBtn');
  const pauseWorkoutBtn = document.getElementById('pauseWorkoutBtn');
  const restartWorkoutBtn = document.getElementById('restartWorkoutBtn');
  const timerInput = document.getElementById('timerInput');
  const remainingTimeDisplay = document.getElementById('remainingTimeDisplay');
  const repsInput = document.getElementById('reps');
  const exerciseSelect = document.getElementById('exercise');
  const actualRepDisplay = document.getElementById('actualRep');
  const phaseDisplay = document.getElementById('phase');

  function formatTime(totalSeconds) {
    const pad = (n) => String(n).padStart(2, '0');
    if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours > 0
      ? `${hours}:${pad(minutes)}:${pad(seconds)}`
      : `${minutes}:${pad(seconds)}`;
  }

  function updateDisplay() {
    remainingTimeDisplay.textContent = formatTime(timeLeft);
    actualRepDisplay.textContent = currentRep;
    phaseDisplay.textContent = workoutPhase;
  }

  function startTimer() {
    if (isPaused) {
      isPaused = false;
      startWorkoutBtn.textContent = "Ejercitándose";
      pauseWorkoutBtn.textContent = "Pausar";
      pauseWorkoutBtn.disabled = false;
      restartWorkoutBtn.disabled = false;
      return;
    }

    initialTimerValue = parseInt(timerInput.value, 10);
    timeLeft = initialTimerValue;
    totalReps = parseInt(repsInput.value, 10);

    if (isNaN(timeLeft) || timeLeft <= 0) return alert("Tiempo inválido");
    if (isNaN(totalReps) || totalReps <= 0) totalReps = 1;

    currentRep = 1;
    workoutPhase = `Realizando ${exerciseSelect.value}`;
    updateDisplay();

    startWorkoutBtn.disabled = true;
    pauseWorkoutBtn.disabled = false;
    pauseWorkoutBtn.textContent = "Pausar";
    restartWorkoutBtn.disabled = false;

    countdown = setInterval(() => {
      if (!isPaused) {
        timeLeft--;
        const cycle = (initialTimerValue - timeLeft - 1) % timePerRep;

        if (timeLeft < 0) {
          clearInterval(countdown);
          workoutPhase = "¡Ejercicio terminado!";
          updateDisplay();

          // Subir nivel
          fetch(`https://pablit-html.onrender.com/api/users/levelUp/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId })
          })
            .then(async res => {
              const data = await res.json();
              if (res.ok) {
                alert("¡Has subido de nivel!");
              } else {
                alert("No se pudo subir de nivel: " + JSON.stringify(data));
              }
            })
            .catch(err => {
              console.error("Error de red:", err);
              alert("Ocurrió un error de red");
            });

          return;
        }

        workoutPhase =
          cycle < exerciseTime
            ? `Realizando ${exerciseSelect.value}`
            : "Descanso";

        currentRep = Math.floor((initialTimerValue - timeLeft) / timePerRep) + 1;
        updateDisplay();
      }
    }, 1000);
  }

  function pauseTimer() {
    isPaused = true;
    clearInterval(countdown);
    startWorkoutBtn.textContent = "Continuar";
    pauseWorkoutBtn.textContent = "Pausado";
    pauseWorkoutBtn.disabled = true;
    workoutPhase = "Pausado";
    updateDisplay();
  }

  function restartTimer() {
    clearInterval(countdown);
    isPaused = false;
    timeLeft = parseInt(timerInput.value, 10) || 0;
    currentRep = 0;
    workoutPhase = "Inactivo";
    updateDisplay();

    startWorkoutBtn.textContent = "Iniciar entrenamiento";
    startWorkoutBtn.disabled = false;
    pauseWorkoutBtn.disabled = true;
    restartWorkoutBtn.disabled = true;
  }

  startWorkoutBtn.addEventListener('click', startTimer);
  pauseWorkoutBtn.addEventListener('click', pauseTimer);
  restartWorkoutBtn.addEventListener('click', restartTimer);

  timerInput.addEventListener('input', () => {
    const val = parseInt(timerInput.value, 10);
    timeLeft = isNaN(val) ? 0 : val;
    updateDisplay();
    restartWorkoutBtn.disabled = true;
  });

  // Estado inicial
  initialTimerValue = parseInt(timerInput.value, 10);
  timeLeft = initialTimerValue;
  updateDisplay();
  pauseWorkoutBtn.disabled = true;
  restartWorkoutBtn.disabled = true;
});
