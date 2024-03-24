//Variables

const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;
let currentAudio = null;

let isGameOver = false;
let isWinner = false;
let winner = "";
let strikeClass = "";


//Elements

const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgainButton = document.getElementById("play-again");
playAgainButton.addEventListener("click", startNewGame);

const clickSound = new Audio("sounds/click.wav");
const gameOverSound = new Audio("sounds/win.mp3");


// Preparing board

const boardState = Array(tiles.length);
boardState.fill("");
tiles.forEach((tile) => tile.addEventListener("click", tileClick));
setHoverText();


// Methods

function setHoverText(show) {
    tiles.forEach((tile) => {
        tile.classList.remove("o-hover");
        tile.classList.remove("x-hover");
    });
    if (show) {
        const hoverClass = `${turn.toLowerCase()}-hover`;

        tiles.forEach((tile) => {
            if (tile.innerText == "") {
                tile.classList.add(hoverClass);
            }
        });
    }
};

function tileClick(event) {
    if (gameOverArea.classList.contains("visable")) {
        return;
    }
    else {
        const tile = event.target;
        const tileNr = tile.id;

        if (tile.innerText != "") {
            return;
        }
        if (turn == PLAYER_O) {
            makeAMove(tile, tileNr, PLAYER_O, PLAYER_X);
        }
        else {
            makeAMove(tile, tileNr, PLAYER_X, PLAYER_O);
        }
        checkWinner();
    }
};

function makeAMove(tile, tileNr, currentPlayer, nextPlayer) {
    tile.innerText = currentPlayer;
    boardState[tileNr - 1] = currentPlayer;
    turn = nextPlayer;
}

function playSound(sound) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    sound.play();
    currentAudio = sound;
}

function checkWinner() {
    fetch('http://localhost:8080/tic-tac-toe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            boardState: boardState,
            turn: turn
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data);
            updateGameState(data.gameOver, data.win, data.strike, data.winner);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
};


function updateGameState(gameOver, win, strikeClass, winner) {
    if (gameOver) {
        if (win) {
            strike.classList.add(strikeClass);
        }
        gameOverScreen(win, winner)
    }
    else {
        playSound(clickSound);
        setHoverText(true);
    }
};

function gameOverScreen(win, winner) {
    setHoverText(false);
    let text = 'Draw!';
    if (win) {
        text = `The Winner is ${winner}!`;
    }
    gameOverArea.className = "visable";
    gameOverText.innerText = text;
    playSound(gameOverSound);
}

function startNewGame() {
    strike.className = "strike";
    gameOverArea.className = "hidden";
    boardState.fill("");
    tiles.forEach((tile) => tile.innerText = "");
    turn = PLAYER_X;
    setHoverText(true);
};
