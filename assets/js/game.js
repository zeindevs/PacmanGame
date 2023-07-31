const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let pacman;
let fps = 30;
let score = 0;
let lives = 3;
let ghosts = [];
let ghostCount = 4;
let ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

let oneBlockSize = 20;
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "#181818";

let walls = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let drawWalls = () => {
  for (let i = 0; i < walls.length; i++) {
    for (let j = 0; j < walls[0].length; j++) {
      if (walls[i][j] == 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          "#342DCA",
        );
      }

      if (j > 0 && walls[i][j - 1] == 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          wallInnerColor,
        );
      }

      if (j < walls[0].length - 1 && walls[i][j + 1] == 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          wallInnerColor,
        );
      }

      if (i > 0 && walls[i - 1][j] == 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          wallInnerColor,
        );
      }

      if (i < walls.length - 1 && walls[i + 1][j] == 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          wallInnerColor,
        );
      }
    }
  }
};

let createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5,
  );
};

let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (walls.length - 2) * oneBlockSize },
  { x: (walls[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (walls[0].length - 2) * oneBlockSize,
    y: (walls.length - 2) * oneBlockSize,
  },
];

let createGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i,
    );
    ghosts.push(newGhost);
  }
};

let drawFoods = () => {
  for (let i = 0; i < walls.length; i++) {
    for (let j = 0; j < walls[0].length; j++) {
      if (walls[i][j] == 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 3,
          oneBlockSize / 3,
          "#FEB897",
        );
      }
    }
  }
};

let drawRemainingLives = () => {
  canvasContext.font = "18px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 300, oneBlockSize * (walls.length + 1));

  for (let i = 0; i < lives; i++) {
    canvasContext.drawImage(
      pacmanFrames,
      2 * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      355 + i * oneBlockSize,
      oneBlockSize * walls.length + 5,
      oneBlockSize,
      oneBlockSize,
    );
  }
};

let drawScore = () => {
  canvasContext.font = "18px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Score: " + score,
    5,
    oneBlockSize * (walls.length + 1),
  );
};

let draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "#181818");
  drawWalls();
  drawFoods();
  drawGhosts();
  pacman.draw();
  drawScore();
  drawRemainingLives();
};

let updateGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
};

let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
};

let drawGameOver = () => {
  canvasContext.font = "25px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Game Over!",
    oneBlockSize * (walls.length / 2) - oneBlockSize * 4,
    oneBlockSize * (walls.length / 2),
  );
  canvasContext.font = "16px Emulogic";
  canvasContext.fillText(
    "Press SPACE to Restart Game!",
    oneBlockSize * (walls.length / 2) - oneBlockSize * 6,
    oneBlockSize * (walls.length / 2) + oneBlockSize * 2 - 10,
  );
};

let drawGameWin = () => {
  canvasContext.font = "25px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "You Win!",
    oneBlockSize * (walls.length / 2) - oneBlockSize * 4 + 10,
    oneBlockSize * (walls.length / 2),
  );
};

let gameLoop = () => {
  draw();
  update();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let gameOver = () => {
  drawGameOver();
  clearInterval(gameInterval);
};

let restartPacmanAndGhosts = () => {
  createNewPacman();
  createGhosts();
};

let update = () => {
  pacman.moveProcess();
  pacman.eat();
  updateGhosts();
  if (pacman.checkGhostCollision(ghosts)) {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
      gameOver();
    }
  }

  if (score >= 219) {
    drawGameWin();
    clearInterval(gameInterval);
  }
};

let run = () => {
  lives = 3;
  score = 0;
  createNewPacman();
  createGhosts();
  gameLoop();
};

let gameRestart = () => {
  // redraw foods
  for (let i = 0; i < walls.length; i++) {
    for (let j = 0; j < walls[0].length; j++) {
      if (walls[i][j] == 3) {
        walls[i][j] = 2;
      }
    }
  }
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 1000 / fps);
  run();
};

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      // left arrow or a
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      // up arrow or w
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      // right arrow or d
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40 || k == 83) {
      // bottom arrow or s
      pacman.nextDirection = DIRECTION_BOTTOM;
    } else if (k == 32) {
      gameRestart();
    }
  }, 1);
});

run();
