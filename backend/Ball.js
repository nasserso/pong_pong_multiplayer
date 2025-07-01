const BALL_SPEED = 3;

module.exports = class Ball {
  width = 10;
  height = 10;
  x = 300;
  y = 300;
  speedX = BALL_SPEED;
  speedY = 1;

  constructor(x, y, areaWidth, areaHeight) {
    this.x = x;
    this.y = y;
    this.areaHeight = areaHeight;
    this.areaWidth = areaWidth;
  }

  collision = function(direction = 0) {
    // change x direction
    this.speedX *= -1;
  
    // change y direction
    if (direction > 0) {
      this.speedY = BALL_SPEED * Math.random();
    } else if (direction < 0) {
      this.speedY = -BALL_SPEED * Math.random();
    };
  }

  update = function() {
    if (this.x + this.width >= this.areaWidth) {
      this.speedX = -BALL_SPEED;
    }
    if (this.x <= 0) {
      this.speedX = BALL_SPEED;
    }
    if (this.y + this.height >= this.areaHeight) {
      this.speedY = -BALL_SPEED;
    }
    if (this.y <= 0) {
      this.speedY = BALL_SPEED;
    }

    this.y += this.speedY;
    this.x += this.speedX;
  }
}