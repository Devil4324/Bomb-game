const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
let score = 0;
let obstacleInterval;
let gameActive = false;
let playerPosX = 185;
const playerSpeed = 10;
const buttonSpeed = 20;
let targetPosX = playerPosX;
let obstacleSpeed = 4;

// Smooth movement function using requestAnimationFrame
function smoothMove() {
    const currentPosX = playerPosX;
    const diff = targetPosX - currentPosX;
    const step = diff * 0.1;  // Smoothing factor

    if (Math.abs(diff) > 1) {
        playerPosX += step;
        player.style.left = `${playerPosX}px`;
        requestAnimationFrame(smoothMove);
    } else {
        playerPosX = targetPosX;
        player.style.left = `${playerPosX}px`;
    }
}

function moveLeft() {
    if (gameActive && playerPosX > 0) {
        targetPosX = Math.max(0, playerPosX - buttonSpeed);
        requestAnimationFrame(smoothMove);
    }
}

function moveRight() {
    if (gameActive && playerPosX < gameArea.offsetWidth - player.offsetWidth) {
        targetPosX = Math.min(gameArea.offsetWidth - player.offsetWidth, playerPosX + buttonSpeed);
        requestAnimationFrame(smoothMove);
    }
}

window.addEventListener('deviceorientation', (event) => {
    if (gameActive) {
        const tilt = event.gamma;
        targetPosX += tilt * 0.5;
        targetPosX = Math.max(0, Math.min(gameArea.offsetWidth - player.offsetWidth, targetPosX));
        requestAnimationFrame(smoothMove);
    }
});

document.addEventListener('keydown', (e) => {
    if (gameActive) {
        if (e.key === 'ArrowLeft' && playerPosX > 0) {
            targetPosX -= playerSpeed;
            requestAnimationFrame(smoothMove);
        } else if (e.key === 'ArrowRight' && playerPosX < gameArea.offsetWidth - player.offsetWidth) {
            targetPosX += playerSpeed;
            requestAnimationFrame(smoothMove);
        }
    }
});

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 30)) + 'px';
    gameArea.appendChild(obstacle);

    let obstaclePosY = 0;

    function moveObstacle() {
        obstaclePosY += obstacleSpeed;
        obstacle.style.top = obstaclePosY + 'px';

        if (checkCollision(player, obstacle)) {
            endGame();
        }

        if (obstaclePosY > gameArea.offsetHeight) {
            obstacle.remove();
            score++;
            scoreDisplay.innerText = `Score: ${score}`;

            if (score % 20 === 0) {
                obstacleSpeed += 1;
                changeBackground();
            }
        } else if (gameActive) {
            requestAnimationFrame(moveObstacle);
        }
    }
    moveObstacle();
}

function checkCollision(player, obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        playerRect.top > obstacleRect.bottom ||
        playerRect.bottom < obstacleRect.top ||
        playerRect.right < obstacleRect.left ||
        playerRect.left > obstacleRect.right
    );
}

function changeBackground() {
    gameArea.style.backgroundColor = '#222';  // Background color when score reaches 20
}

function endGame() {
    gameActive = false;
    clearInterval(obstacleInterval);
    restartBtn.style.display = 'block';
    alert(`Game Over! Your score: ${score}`);
}

function startGame() {
    score = 0;
    obstacleSpeed = 4;
    scoreDisplay.innerText = `Score: ${score}`;
    playerPosX = 185;
    targetPosX = playerPosX;
    player.style.left = playerPosX + 'px';
    gameActive = true;
    restartBtn.style.display = 'none';

    document.querySelectorAll('.obstacle').forEach((obstacle) => obstacle.remove());

    obstacleInterval = setInterval(createObstacle, 1000);
}

startGame();