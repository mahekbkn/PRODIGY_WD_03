const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const popup = document.getElementById('popupMessage');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');
const modePvP = document.getElementById('modePvP');
const modeAI = document.getElementById('modeAI');

let currentPlayer = "X";
let gameActive = true;
let board = Array(9).fill("");
let isAI = false;
let scores = { X: 0, O: 0, Draw: 0 };

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleClick(e) {
  const cell = e.target;
  const index = [...cells].indexOf(cell);

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkResult();

  if (isAI && currentPlayer === "O" && gameActive) {
    setTimeout(computerMove, 500);
  }
}

function checkResult() {
  let roundWon = false;

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      [a, b, c].forEach(i => cells[i].classList.add("win"));
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    showPopup(`${currentPlayer} wins! 🎉`);
    statusText.textContent = `${currentPlayer} wins! 🎉`;
    gameActive = false;
    scores[currentPlayer]++;
    updateScore();
    return;
  }

  if (!board.includes("")) {
    showPopup("It's a Draw! 🤝");
    statusText.textContent = "It's a Draw! 🤝";
    scores.Draw++;
    updateScore();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `It's ${currentPlayer}'s turn`;
}

function computerMove() {
  const emptyCells = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  if (randomIndex != null) {
    board[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;
    checkResult();
  }
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `It's ${currentPlayer}'s turn`;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
}

function showPopup(message) {
  popup.textContent = message;
  popup.classList.add("popup-show");

  setTimeout(() => {
    popup.classList.remove("popup-show");
  }, 2500);
}

function updateScore() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.Draw;
}

// Mode Toggle
modePvP.onclick = () => {
  isAI = false;
  restartGame();
};

modeAI.onclick = () => {
  isAI = true;
  restartGame();
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
statusText.textContent = `It's ${currentPlayer}'s turn`;
