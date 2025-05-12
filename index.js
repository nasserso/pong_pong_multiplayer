const PAD_COLOR = "white";
const BALL_COLOR = "red";
const BALL_SPEED = 3;
const PAD_SPEED = 2;

function startGame() {
  pad = new pad();
  ball = new ball();
  gameArea.start();
}

var gameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    this.frame = 0;
    // border
    this.canvas.style.border = "1px solid";
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);

    // TODO: mobile
    // window.addEventListener('mousedown', function (e) {
    //   gameArea.key = "ArrowDown";
    // })
    // window.addEventListener('mouseup', function (e) {
    //   gameArea.key = false;
    // })
    // window.addEventListener('touchstart', function (e) {
    //   gameArea.key = "ArrowDown";
    // })
    // window.addEventListener('touchend', function (e) {
    //   gameArea.key = false;
    // })

    window.addEventListener('keydown', function (e) {
      gameArea.key = e.key;
    })
    window.addEventListener('keyup', function (e) {
      gameArea.key = false;
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

function ball(x, y) {
  this.width = 10;
  this.height = 10;
  this.x = x || 300;
  this.y = y || 300;
  this.speedX = BALL_SPEED;
  this.speedY = 0;
  this.update = function() {
    if (this.x + this.speedX <= pad.x+pad.width && pad.y <= this.y && this.y <= pad.y+pad.height) {
      this.speedX *= -1;
      if (pad.speedY === 0) {
        // do nothing
        this.speedY *= 1;
      } else if (pad.speedY > 0) {
        this.speedY = BALL_SPEED * Math.random();
      } else {
        this.speedY = -BALL_SPEED * Math.random();
      }
    }
    else if (this.x + this.width >= gameArea.canvas.width) {
      this.speedX = -BALL_SPEED;
    }
    else if (this.x <= 0) {
      this.speedX = BALL_SPEED;
    }
    else if (this.y + this.height >= gameArea.canvas.height) {
      this.speedY = -BALL_SPEED;
    }
    else if (this.y <= 0) {
      this.speedY = BALL_SPEED;
    }
    
    this.y += this.speedY;
    this.x += this.speedX;

    ctx = gameArea.context;
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function pad() {
  this.width = 10;
  this.height = 100;
  this.x = 10;
  this.y = 10;
  this.speedY = 0;
  this.update = function() {
    if (this.speedY < 0 && this.y > 0) {
      this.y += pad.speedY;
    }
    if (
      this.speedY > 0 &&
      this.y+100 < gameArea.canvas.height)
    {
      this.y += pad.speedY;
    }

    ctx = gameArea.context;
    ctx.fillStyle = PAD_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function move_up() {
  pad.speedY = -PAD_SPEED;
}

function move_down() {
  pad.speedY = PAD_SPEED;
}

function stop_move() {
  pad.speedY = 0;
}

function updateGameArea() {
  gameArea.frame += 1;
  gameArea.clear();

  stop_move();
  if (gameArea.key) {
    if (gameArea.key === "ArrowUp") {
      move_up();
    }
    if (gameArea.key == "ArrowDown") {
      move_down();
    }
  }
  ball.update();
  pad.update();
}

startGame();