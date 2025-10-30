// ========================================
// GAME.JS - Mushin Slash Challenge Game
// ========================================

(function() {
  'use strict';
  
  // Game state
  let gameState = {
    score: 0,
    combo: 0,
    timeLeft: 30,
    isPlaying: false,
    enemies: [],
    maxEnemies: 3,
    spawnRate: 1500,
    difficulty: 'normal'
  };
  
  // Canvas setup
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Game elements
  const gameContainer = document.getElementById('game-container');
  const startGameBtn = document.getElementById('start-game-btn');
  const closeGameBtn = document.getElementById('close-game-btn');
  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  const gameTutorial = document.getElementById('game-tutorial');
  const gameOver = document.getElementById('game-over');
  const replayBtn = document.getElementById('replay-btn');
  const closeGameOverBtn = document.getElementById('close-game-over-btn');
  
  // Score elements
  const scoreElement = document.getElementById('game-score');
  const timeElement = document.getElementById('game-time');
  const comboElement = document.getElementById('game-combo');
  const finalScoreElement = document.getElementById('final-score');
  const rankMessageElement = document.getElementById('rank-message');
  const leaderboardList = document.getElementById('leaderboard-list');
  
  // Enemy class
  class Enemy {
    constructor() {
      this.x = Math.random() * (canvas.width - 80) + 40;
      this.y = Math.random() * (canvas.height - 80) + 40;
      this.radius = 30;
      this.speed = 0.5 + Math.random() * 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.health = 1;
      this.opacity = 1;
      this.isDying = false;
    }
    
    update() {
      if (this.isDying) {
        this.opacity -= 0.05;
        this.radius += 2;
        return this.opacity <= 0;
      }
      
      // Gentle floating movement
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      
      // Bounce off walls
      if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.angle = Math.PI - this.angle;
      }
      if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.angle = -this.angle;
      }
      
      // Keep within bounds
      this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
      this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
      
      return false; // Not removed
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      // Shadow enemy with burgundy glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(139, 0, 0, 0.8)';
      
      // Enemy body
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();
      
      // Enemy outline
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Enemy symbol (X)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      const symbolSize = this.radius * 0.4;
      ctx.beginPath();
      ctx.moveTo(this.x - symbolSize, this.y - symbolSize);
      ctx.lineTo(this.x + symbolSize, this.y + symbolSize);
      ctx.moveTo(this.x + symbolSize, this.y - symbolSize);
      ctx.lineTo(this.x - symbolSize, this.y + symbolSize);
      ctx.stroke();
      
      ctx.restore();
    }
    
    isClicked(mouseX, mouseY) {
      const distance = Math.sqrt(
        Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2)
      );
      return distance <= this.radius;
    }
    
    hit() {
      this.isDying = true;
      this.health = 0;
    }
  }
  
  // Particle effect for slashes
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 10;
      this.speedY = (Math.random() - 0.5) * 10;
      this.life = 1;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= 0.02;
      this.speedY += 0.3; // Gravity
      return this.life > 0;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  let particles = [];
  let lastSpawn = Date.now();
  let gameTimer = null;
  let gameLoop = null;
  let highScores = [];
  
  // Load high scores from memory (using a module-level variable instead of localStorage)
  function loadHighScores() {
    // Initialize with some default scores if empty
    if (highScores.length === 0) {
      highScores = [
        { score: 500, date: new Date().toLocaleDateString() },
        { score: 350, date: new Date().toLocaleDateString() },
        { score: 200, date: new Date().toLocaleDateString() }
      ];
    }
    return highScores;
  }
  
  // Save high scores to memory
  function saveHighScore(score) {
    const newScore = {
      score: score,
      date: new Date().toLocaleDateString()
    };
    
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // Keep only top 5
  }
  
  // Display leaderboard
  function displayLeaderboard() {
    const scores = loadHighScores();
    leaderboardList.innerHTML = '';
    
    scores.forEach((entry) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${entry.score} points</span><span>${entry.date}</span>`;
      leaderboardList.appendChild(li);
    });
  }
  
  // Initialize game
  function initGame() {
    gameState.score = 0;
    gameState.combo = 0;
    gameState.timeLeft = 30;
    gameState.enemies = [];
    gameState.isPlaying = true;
    particles = [];
    lastSpawn = Date.now();
    
    updateScore();
    updateTime();
    updateCombo();
  }
  
  // Update UI
  function updateScore() {
    scoreElement.textContent = gameState.score;
  }
  
  function updateTime() {
    timeElement.textContent = gameState.timeLeft;
  }
  
  function updateCombo() {
    comboElement.textContent = gameState.combo;
    if (gameState.combo > 0) {
      comboElement.style.color = '#FFD700';
      comboElement.style.transform = 'scale(1.2)';
      setTimeout(() => {
        comboElement.style.transform = 'scale(1)';
      }, 200);
    }
  }
  
  // Spawn enemies
  function spawnEnemy() {
    if (gameState.enemies.length < gameState.maxEnemies && gameState.isPlaying) {
      gameState.enemies.push(new Enemy());
    }
  }
  
  // Game loop
  function update() {
    if (!gameState.isPlaying) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background pattern
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Update and draw enemies
    gameState.enemies = gameState.enemies.filter(enemy => {
      const shouldKeep = !enemy.update();
      if (shouldKeep) {
        enemy.draw();
      }
      return shouldKeep;
    });
    
    // Update and draw particles
    particles = particles.filter(particle => {
      const shouldKeep = particle.update();
      if (shouldKeep) {
        particle.draw();
      }
      return shouldKeep;
    });
    
    // Spawn new enemies
    const now = Date.now();
    if (now - lastSpawn > gameState.spawnRate) {
      spawnEnemy();
      lastSpawn = now;
    }
    
    gameLoop = requestAnimationFrame(update);
  }
  
  // Handle canvas click
  canvas.addEventListener('click', (e) => {
    if (!gameState.isPlaying) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    let hit = false;
    
    // Check if any enemy was clicked
    gameState.enemies.forEach(enemy => {
      if (!enemy.isDying && enemy.isClicked(mouseX, mouseY)) {
        enemy.hit();
        hit = true;
        
        // Add score with combo multiplier
        const points = 10 * (1 + gameState.combo * 0.5);
        gameState.score += Math.floor(points);
        gameState.combo++;
        
        updateScore();
        updateCombo();
        
        // Create particles
        for (let i = 0; i < 15; i++) {
          particles.push(new Particle(mouseX, mouseY));
        }
      }
    });
    
    // Reset combo if missed
    if (!hit) {
      gameState.combo = 0;
      updateCombo();
    }
  });
  
  // Start game timer
  function startTimer() {
    gameTimer = setInterval(() => {
      gameState.timeLeft--;
      updateTime();
      
      if (gameState.timeLeft <= 0) {
        endGame();
      }
      
      // Increase difficulty over time
      if (gameState.timeLeft === 20) {
        gameState.maxEnemies = 4;
        gameState.spawnRate = 1200;
      } else if (gameState.timeLeft === 10) {
        gameState.maxEnemies = 5;
        gameState.spawnRate = 1000;
      }
    }, 1000);
  }
  
  // End game
  function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameTimer);
    cancelAnimationFrame(gameLoop);
    
    // Save score
    saveHighScore(gameState.score);
    
    // Display results
    finalScoreElement.textContent = gameState.score;
    
    // Determine rank message
    let rankMessage = '';
    if (gameState.score >= 500) {
      rankMessage = '🏆 Legendary Samurai! Your blade is unmatched!';
    } else if (gameState.score >= 350) {
      rankMessage = '⚔️ Master Warrior! Your skills are formidable!';
    } else if (gameState.score >= 200) {
      rankMessage = '🎯 Skilled Fighter! You show great promise!';
    } else if (gameState.score >= 100) {
      rankMessage = '🌸 Apprentice Samurai! Keep training!';
    } else {
      rankMessage = '🍃 Novice! The path to mastery begins with a single step.';
    }
    
    rankMessageElement.textContent = rankMessage;
    displayLeaderboard();
    
    gameOver.classList.remove('hidden');
  }
  
  // Event listeners
  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      gameContainer.classList.remove('hidden');
      gameTutorial.style.display = 'flex';
      gameOver.classList.add('hidden');
    });
  }
  
  if (closeGameBtn) {
    closeGameBtn.addEventListener('click', () => {
      gameContainer.classList.add('hidden');
      gameState.isPlaying = false;
      clearInterval(gameTimer);
      cancelAnimationFrame(gameLoop);
    });
  }
  
  if (startTutorialBtn) {
    startTutorialBtn.addEventListener('click', () => {
      gameTutorial.style.display = 'none';
      initGame();
      startTimer();
      update();
    });
  }
  
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      gameOver.classList.add('hidden');
      gameTutorial.style.display = 'none';
      initGame();
      startTimer();
      update();
    });
  }
  
  if (closeGameOverBtn) {
    closeGameOverBtn.addEventListener('click', () => {
      gameContainer.classList.add('hidden');
      gameOver.classList.add('hidden');
    });
  }
  
  // Handle window resize
  function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
})();