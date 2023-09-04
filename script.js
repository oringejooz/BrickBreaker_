 // Get a reference to the HTML canvas element and create a 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define constants for the paddle, ball, and bricks
const paddleWidth = 100;
const paddleHeight = 10;
const ballRadius = 10;
const brickWidth = 70;
const brickHeight = 20;
const brickRowCount = 5;
const brickColumnCount = 10;
const brickGap = 5;

// Initialize the paddle's position and speed
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 8;

// Initialize the ball's position and speed
let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - ballRadius;
let ballSpeedX = 5;
let ballSpeedY = -5;

// Create an empty array to store information about the bricks
const bricks = [];

// Initialize the bricks array with their positions and status
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Listen for keyboard input to move the paddle
document.addEventListener("keydown", movePaddle);

// Initialize the game score
let score = 0;

// Get the last score from local storage or set it to 0
let lastScore = localStorage.getItem("lastScore") || 0;

// Function to update the score and display it
function updateScore() {
    score += 10;
    document.getElementById("score").textContent = "Score: " + score;
    localStorage.setItem("lastScore", score);
}

// Function to draw the paddle on the canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the ball on the canvas
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

// Function to draw the bricks on the canvas
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

// Function to detect collisions between the ball and bricks
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

// Function to move the paddle based on keyboard input
function movePaddle(e) {
    if (e.key === "ArrowLeft" && paddleX > 0) {
        paddleX -= paddleSpeed;
    } else if (e.key === "ArrowRight" && paddleX + paddleWidth < canvas.width) {
        paddleX += paddleSpeed;
    }
}

// Function to draw the game elements and handle game logic
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    collisionDetection();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 10, 20);

    ballX += ballSpeedX * 0.25;
    ballY += ballSpeedY * 0.25;

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            document.location.reload();
        }
    }

    // Request the next frame to continue the game loop
    requestAnimationFrame(draw);
}

// Function to initialize the game
function initGame() {
    draw();
}

// Event listener for starting the game
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initGame();
});

// Start the game loop by calling the draw function initially
draw();
