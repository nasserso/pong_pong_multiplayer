const PAD_COLOR = "white";
const BALL_COLOR = "red";
const BALL_SPEED = 3;
const PAD_SPEED = 2;

const socket = io(
  "http://localhost:3000", {
  extraHeaders: {
    "Access-Control-Allow-Origin": "*"
  }
}
);

// [x] add second pad
// [ ] add socket
// [ ] add AI?

let side = "";

socket.on("pad", (side_choice) => side = side_choice);

function startGame() {
  padLeft = new Pad();
  padRight = new Pad(580);
  ball = new Ball();
  gameArea.start();
}

socket.on("update", (data) => {
  padLeft.x = data.padLeft.x;
  padLeft.y = data.padLeft.y;
  padRight.x = data.padRight.x;
  padRight.y = data.padRight.y;
})

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
  has_collision: function(pad, ball, side) {
    const is_ball_pad_same_height = () => pad.y <= ball.y && ball.y <= pad.y+pad.height;

    // FIXME: bug if speed if too high the collison happens before touch the pad
    if (side === "right") {
      return ball.x + ball.width + ball.speedX >= pad.x && is_ball_pad_same_height();
    }
    return ball.x + ball.speedX <= pad.x+pad.width && is_ball_pad_same_height();
  },
  collision: function() {
    if (this.has_collision(padLeft, ball, "left")) {
      ball.collision(padLeft.speedY);
    }
    if (this.has_collision(padRight, ball, "right")) {
      ball.collision(padRight.speedY);
    }
  }
}

function Ball(x, y) {
  this.width = 10;
  this.height = 10;
  this.x = x || 300;
  this.y = y || 300;
  this.speedX = BALL_SPEED;
  this.speedY = 0;

  this.collision = function(speedY) {
    this.speedX *= -1;
    if (speedY === 0) {
      // do nothing
      this.speedY *= 1;
    } else if (speedY > 0) {
      this.speedY = BALL_SPEED * Math.random();
    } else {
      this.speedY = -BALL_SPEED * Math.random();
    };
  }

  this.update = function() {
    if (this.x + this.width >= gameArea.canvas.width) {
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

function Pad(x) {
  this.width = 10;
  this.height = 100;
  this.x = x || 10;
  this.y = 10;
  this.speedY = 0;
  this.update = function() {
    ctx = gameArea.context;
    ctx.fillStyle = PAD_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.move_up = function() {
    socket.emit("up-" + side, null);
  }

  this.move_down = function() {
    socket.emit("down-" + side, null);
  }
}

function updateGameArea() {
  gameArea.frame += 1;
  gameArea.clear();

  gameArea.collision();

  if (gameArea.key) {
    if (gameArea.key === "ArrowUp") {
      if (side == "left")
        padLeft.move_up();
      else
        padRight.move_up();
    }
    if (gameArea.key == "ArrowDown") {
      if (side == "left")
        padLeft.move_down();
      else
        padRight.move_down();
    }
  }
  ball.update();
  padLeft.update();
  padRight.update();
}

startGame();