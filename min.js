const startPanel = document.getElementById('startPanel');
const playerSelectionPanel = document.getElementById('playerSelectionPanel');
const nameEntryPanel = document.getElementById('nameEntryPanel');
const gamePanel = document.getElementById('gamePanel');
const startButton = document.getElementById('startButton');
const creditsButton = document.getElementById('creditsButton');
const exitButton = document.getElementById('exitButton');
const onePlayerButton = document.getElementById('onePlayerButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const startGameButton = document.getElementById('startGameButton');
const quitButton = document.getElementById('quitButton');
const mainMenuButton = document.getElementById('mainMenuButton');
const player1NameContainer = document.getElementById('player1NameContainer');
const player2NameContainer = document.getElementById('player2NameContainer');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const statusElement = document.getElementById('gameStatus');
const winLossRatioElement = document.getElementById('winLossRatio');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const X_CLASS = 'x';
const O_CLASS = 'o';
let oTurn;
let player1Name = '';
let player2Name = 'Triple T';
let twoPlayers = false;
let player1Wins = 0;
let player2Wins = 0;
let draws = 0;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startButton.addEventListener('click', () => {
    startPanel.classList.remove('active');
    playerSelectionPanel.classList.add('active');
});

creditsButton.addEventListener('click', () => {
    alert('Credits: Game developed by KJ Creative Cohesion');
});

exitButton.addEventListener('click', () => {
    window.close();
});

onePlayerButton.addEventListener('click', () => {
    twoPlayers = false;
    playerSelectionPanel.classList.remove('active');
    nameEntryPanel.classList.add('active');
    player2NameContainer.style.display = 'none';
});

twoPlayerButton.addEventListener('click', () => {
    twoPlayers = true;
    playerSelectionPanel.classList.remove('active');
    nameEntryPanel.classList.add('active');
    player2NameContainer.style.display = 'block';
});

startGameButton.addEventListener('click', () => {
    player1Name = player1NameInput.value || 'Player 1';
    if (twoPlayers) {
        player2Name = player2NameInput.value || 'Player 2';
    }
    nameEntryPanel.classList.remove('active');
    gamePanel.classList.add('active');
    startGame();
});

restartButton.addEventListener('click', startGame);

quitButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to quit the game?')) {
        window.close();
    }
});

mainMenuButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to return to the main menu?')) {
        resetScores();
        resetPlayerNames();
        gamePanel.classList.remove('active');
        startPanel.classList.add('active');
    }
});

function startGame() {
    oTurn = false;
    updateStatus();
    updateWinLossRatio();
    enableCells();
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        if (oTurn) {
            player2Wins++;
        } else {
            player1Wins++;
        }
        statusElement.textContent = `${oTurn ? player2Name : player1Name} Wins!`;
        updateWinLossRatio();
        setTimeout(startGame, 2000);
    } else if (isDraw()) {
        draws++;
        statusElement.textContent = 'Draw!';
        updateWinLossRatio();
        setTimeout(startGame, 2000);
    } else {
        swapTurns();
        updateStatus();
        if (!twoPlayers && oTurn) {
            disableCells();
            statusElement.textContent = 'Triple T is thinking...';
            setTimeout(tripleTMove, 3000);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
}

function updateStatus() {
    statusElement.textContent = `${oTurn ? player2Name : player1Name}'s turn (${oTurn ? 'O' : 'X'})`;
}

function updateWinLossRatio() {
    winLossRatioElement.textContent = `${player1Name}: ${player1Wins} Wins, ${player2Name}: ${player2Wins} Wins, Draws: ${draws}`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function tripleTMove() {
    // Check if Triple T can win
    for (let combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (
            cells[a].classList.contains(O_CLASS) &&
            cells[b].classList.contains(O_CLASS) &&
            !cells[c].classList.contains(X_CLASS) &&
            !cells[c].classList.contains(O_CLASS)
        ) {
            placeMark(cells[c], O_CLASS);
            finalizeTripleTMove();
            return;
        } else if (
            cells[a].classList.contains(O_CLASS) &&
            !cells[b].classList.contains(X_CLASS) &&
            cells[c].classList.contains(O_CLASS) &&
            !cells[b].classList.contains(O_CLASS)
        ) {
            placeMark(cells[b], O_CLASS);
            finalizeTripleTMove();
            return;
        } else if (
            !cells[a].classList.contains(X_CLASS) &&
            cells[b].classList.contains(O_CLASS) &&
            cells[c].classList.contains(O_CLASS) &&
            !cells[a].classList.contains(O_CLASS)
        ) {
            placeMark(cells[a], O_CLASS);
            finalizeTripleTMove();
            return;
        }
    }

    // Check if Triple T needs to block Player 1
    for (let combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (
            cells[a].classList.contains(X_CLASS) &&
            cells[b].classList.contains(X_CLASS) &&
            !cells[c].classList.contains(X_CLASS) &&
            !cells[c].classList.contains(O_CLASS)
        ) {
            placeMark(cells[c], O_CLASS);
            finalizeTripleTMove();
            return;
        } else if (
            cells[a].classList.contains(X_CLASS) &&
            !cells[b].classList.contains(X_CLASS) &&
            cells[c].classList.contains(X_CLASS) &&
            !cells[b].classList.contains(O_CLASS)
        ) {
            placeMark(cells[b], O_CLASS);
            finalizeTripleTMove();
            return;
        } else if (
            !cells[a].classList.contains(X_CLASS) &&
            cells[b].classList.contains(X_CLASS) &&
            cells[c].classList.contains(X_CLASS) &&
            !cells[a].classList.contains(O_CLASS)
        ) {
            placeMark(cells[a], O_CLASS);
            finalizeTripleTMove();
            return;
        }
    }

    // If no win or block needed, make a random move
    const availableCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, O_CLASS);
    finalizeTripleTMove();
}

function finalizeTripleTMove() {
    if (checkWin(O_CLASS)) {
        player2Wins++;
        statusElement.textContent = `${player2Name} Wins!`;
        updateWinLossRatio();
        setTimeout(startGame, 2000);
    } else if (isDraw()) {
        draws++;
        statusElement.textContent = 'Draw!';
        updateWinLossRatio();
        setTimeout(startGame, 2000);
    } else {
        oTurn = false;
        updateStatus();
        enableCells();
    }
}

function resetScores() {
    player1Wins = 0;
    player2Wins = 0;
    draws = 0;
    updateWinLossRatio();
}

function resetPlayerNames() {
    player2Name = 'Triple T';
}

function disableCells() {
    cells.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
}

function enableCells() {
    cells.forEach(cell => {
        cell.style.pointerEvents = 'auto';
    });
}
