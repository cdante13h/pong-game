// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const gameSpeed = 4;

let playerPaddle = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

let computerPaddle = {
    x: canvas.width - 30,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: gameSpeed,
    dy: gameSpeed,
    radius: ballSize,
    speed: gameSpeed
};

let scores = {
    player: 0,
    computer: 0
};

// Keyboard and mouse input
const keys = {};
let mouseY = canvas.height / 2;

// Keyboard events
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse events
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Arrow keys
    if (keys['ArrowUp']) {
        playerPaddle.y -= playerPaddle.speed;
    }
    if (keys['ArrowDown']) {
        playerPaddle.y += playerPaddle.speed;
    }
    
    // Mouse control
    playerPaddle.y = mouseY - playerPaddle.height / 2;
    
    // Boundary check
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    const ballCenter = ball.y;
    
    // Simple AI: follow the ball
    if (computerCenter < ballCenter - 35) {
        computerPaddle.y += computerPaddle.speed;
    } else if (computerCenter > ballCenter + 35) {
        computerPaddle.y -= computerPaddle.speed;
    }
    
    // Boundary check
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    }
    if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        // Keep ball in bounds
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
        } else {
            ball.y = canvas.height - ball.radius;
        }
    }
    
    // Paddle collision (Player)
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx = -ball.dx;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
        
        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (playerPaddle.y + playerPaddle.height / 2);
        ball.dy = (deltaY / (playerPaddle.height / 2)) * ball.speed;
    }
    
    // Paddle collision (Computer)
    if (ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;
        
        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (computerPaddle.y + computerPaddle.height / 2);
        ball.dy = (deltaY / (computerPaddle.height / 2)) * ball.speed;
    }
    
    // Out of bounds (Player scores)
    if (ball.x + ball.radius > canvas.width) {
        scores.player++;
        resetBall();
    }
    
    // Out of bounds (Computer scores)
    if (ball.x - ball.radius < 0) {
        scores.computer++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = gameSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = gameSpeed * (Math.random() > 0.5 ? 1 : -1);
    updateScoreboard();
}

// Draw functions
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawDashedLine() {
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw center line
    drawDashedLine();
    
    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, '#00ff00');
    drawRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, '#00ff00');
    
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#00ff00');
}

function updateScoreboard() {
    document.getElementById('playerScore').textContent = scores.player;
    document.getElementById('computerScore').textContent = scores.computer;
}

// Main game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
updateScoreboard();
gameLoop();
