let numberToGuess;
let attempts = 0;
let max = 100;
let maxAttempts = 10;
let playerName = "";
let progressBar, leaderboardEl;

function startGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) {
    alert("Please enter your name first.");
    return;
  }

  document.getElementById("welcomeArea").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  document.getElementById("greetingText").textContent = `Hello, ${playerName}! Let's play!`;

  setDifficulty();
  renderLeaderboard();
}

function setDifficulty() {
  const difficulty = document.getElementById('difficulty').value;
  const body = document.body;

  body.className = ""; // Reset all background classes

  if (difficulty === 'easy') {
    max = 10;
    maxAttempts = 5;
    body.classList.add('easy-level');
  } else if (difficulty === 'medium') {
    max = 100;
    maxAttempts = 10;
    body.classList.add('medium-level');
  } else if (difficulty === 'hard') {
    max = 500;
    maxAttempts = 15;
    body.classList.add('hard-level');
  } else if (difficulty === 'harder') {
    max = 1000;
    maxAttempts = 20;
    body.classList.add('harder-level');
  } else if (difficulty === 'hardest') {
    max = 5000;
    maxAttempts = 25;
    body.classList.add('hardest-level');
  }

  resetGame();
}

function generateNumber() {
  return Math.floor(Math.random() * max) + 1;
}

function checkGuess() {
  const guessInput = document.getElementById('guessInput');
  const guess = Number(guessInput.value);
  const message = document.getElementById('message');
  const attemptsDisplay = document.getElementById('attempts');

  if (!guess || guess < 1 || guess > max) {
    message.textContent = `⚠️ Enter a number between 1 and ${max}.`;
    return;
  }

  attempts++;
  updateProgressBar();

  if (guess === numberToGuess) {
    message.textContent = `🎉 Great job, ${playerName}! Number was ${numberToGuess}. Attempts: ${attempts}`;
    attemptsDisplay.textContent = "";
    updateLeaderboard(attempts);
  } else if (guess < numberToGuess) {
    message.textContent = "📉 Too low!";
    attemptsDisplay.textContent = `Attempts: ${attempts}`;
  } else {
    message.textContent = "📈 Too high!";
    attemptsDisplay.textContent = `Attempts: ${attempts}`;
  }

  guessInput.value = '';
  guessInput.focus();
}

function updateProgressBar() {
  const percent = Math.min((attempts / maxAttempts) * 100, 100);
  progressBar.style.width = percent + '%';
}

function resetGame() {
  numberToGuess = generateNumber();
  attempts = 0;
  document.getElementById('message').textContent = '';
  document.getElementById('attempts').textContent = '';
  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').focus();
  progressBar.style.width = '0%';
}

function updateLeaderboard(score) {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push(score);
  leaderboard.sort((a, b) => a - b);
  leaderboard = leaderboard.slice(0, 3);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboardEl.innerHTML = '';
  leaderboard.forEach((score, index) => {
    const li = document.createElement('li');
    li.textContent = `#${index + 1}: ${score} attempt(s)`;
    leaderboardEl.appendChild(li);
  });
}

window.onload = () => {
  progressBar = document.getElementById('progressBar');
  leaderboardEl = document.getElementById('leaderboard');
  // Restore saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}
};

function clearLeaderboard() {
  localStorage.removeItem('leaderboard');
  renderLeaderboard();
  alert("Leaderboard cleared!");
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-mode");

  // Save theme preference
  const currentTheme = body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
}

function showHint() {
  const guessInput = document.getElementById('guessInput');
  const message = document.getElementById('message');
  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > max) {
    message.textContent = `⚠️ Enter a number between 1 and ${max} to get a hint.`;
    return;
  }

  if (guess === numberToGuess) {
    message.textContent = `🎉 You already guessed it right! Number was ${numberToGuess}.`;
  } else if (guess < numberToGuess) {
    message.textContent = `💡 Hint: Try a bigger number than ${guess}.`;
  } else {
    message.textContent = `💡 Hint: Try a smaller number than ${guess}.`;
  }
}
