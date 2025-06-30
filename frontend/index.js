const PAD_COLOR = "white";
const BALL_COLOR = "red";
const BALL_SPEED = 3;
const PAD_SPEED = 2;
const INTERPOLATION = true;
const HERTZ = 1000/40;

const socket = io(
  "http://localhost:3000", {
    extraHeaders: {
      "Access-Control-Allow-Origin": "*"
    }
  }
);

// [x] add second pad
// [x] add socket
//    [x] anti lag
//    [ ] better collision
// [ ] add AI?

let side = "";

socket.on("pad", (side_choice) => side = side_choice);

function startGame() {
  padLeft = new Pad();
  padRight = new Pad(580);
  ball = new Ball();
  gameArea.start();
}

const lerp = (start, end, ratio) => start + ((end - start) * ratio);

socket.on("update", (data) => {
  if (INTERPOLATION) {
    padLeft.x_next = data.padLeft.x;
    padLeft.y_next = data.padLeft.y;
    padRight.x_next = data.padRight.x;
    padRight.y_next = data.padRight.y;
    // TODO: add ball interpoltion
    // ball.x_next = data.ball.x;
    // ball.y_next = data.ball.y;
    ball.x = data.ball?.x;
    ball.y = data.ball?.y;
  } else {
    padLeft.x = data.padLeft.x;
    padLeft.y = data.padLeft.y;
    padRight.x = data.padRight.x;
    padRight.y = data.padRight.y;
    ball.x = data.ball?.x;
    ball.y = data.ball?.y;
  }
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
    this.interval = setInterval(updateGameArea, HERTZ);

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

function Ball(x, y) {
  this.width = 10;
  this.height = 10;
  this.x = x || 300;
  this.y = y || 300;
  this.speedX = BALL_SPEED;
  this.speedY = 0;
  this.position_buffer = [];
  this.x_next = 0;
  this.y_next = 0;

  this.update = function() {
    ctx = gameArea.context;
    ctx.fillStyle = BALL_COLOR;
    // if (INTERPOLATION) {
    //   this.x = lerp(this.x, this.x_next, 0.1);
    //   this.y = lerp(this.y, this.y_next, 0.1);
    // }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function Pad(x) {
  this.width = 10;
  this.height = 100;
  this.x = x || 10;
  this.y = 10;
  this.speedY = 0;
  this.position_buffer = [];
  this.x_next = 0;
  this.y_next = 0;

  this.update = function() {
    ctx = gameArea.context;
    ctx.fillStyle = PAD_COLOR;
    if (INTERPOLATION) {
      if (this.x_next - this.x <= 0.001) {
        this.x = this.x_next;
      } else {
        this.x = lerp(this.x, this.x_next, 0.1);
      }
      if (this.y_next - this.y <= 0.001) {
        this.y = this.y_next;
      } else {
        this.y = lerp(this.y, this.y_next, 0.1);
      }
    }
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