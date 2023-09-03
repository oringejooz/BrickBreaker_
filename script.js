// Constants
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

// Paddle properties
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 8;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - ballRadius;
let ballSpeedX = 5;
let ballSpeedY = -5;

// Brick properties
const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Event listeners
document.addEventListener("keydown", movePaddle);

// Functions
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#e74c3c";
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

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collisions
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            // Game over
            document.location.reload();
        }
    }

    requestAnimationFrame(draw);
}

// Start the game loop
draw();