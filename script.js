const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;
const brickWidth = 70;
const brickHeight = 20;
const brickRowCount = 5;
const brickColumnCount = 10;
const brickGap = 5;

let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 8;

let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - ballRadius;
let ballSpeedX = 5;
let ballSpeedY = -5;

const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", movePaddle);

let score = 0;

let lastScore = localStorage.getItem("lastScore") || 0;

function updateScore() {
    score += 10;
    document.getElementById("score").textContent = "Score: " + score;
    localStorage.setItem("lastScore", score);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, ballRadius);
    gradient.addColorStop(0, "#e74c3c");
    gradient.addColorStop(1, "#c0392b");
    ctx.fillStyle = gradient;
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.shadowColor = "#c0392b";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickGap);
                const brickY = r * (brickHeight + brickGap);
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#3498db";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                    updateScore();
                }
            }
        }
    }
}

function movePaddle(e) {
    if (e.key === "ArrowLeft" && paddleX > 0) {
        paddleX -= paddleSpeed;
    } else if (e.key === "ArrowRight" && paddleX + paddleWidth < canvas.width) {
        paddleX += paddleSpeed;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    collisionDetection();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 10, 20);

    ballX += ballSpeedX * 0.5;
    ballY += ballSpeedY * 0.5;

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            // Show "You Lose" screen
            document.getElementById("loseScreen").style.display = "block";
            document.getElementById("finalScore").textContent = score;
        }
    }

    requestAnimationFrame(draw);
}

function initGame() {
    draw();
}

function restartGame() {
    // Hide "You Lose" screen and reset game variables
    document.getElementById("loseScreen").style.display = "none";
    paddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height - paddleHeight - ballRadius;
    ballSpeedX = 5;
    ballSpeedY = -5;
    score = 0;
    updateScore();
    initGame();
}

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initGame();
});

document.getElementById("restartButton").addEventListener("click", restartGame);

