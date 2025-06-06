module.exports = class Pad {
  width = 10;
  height = 100;
  speedY = 2;
  max_height = 600;
  x = 10;
  y = 10;

  constructor(x, y, max_height) {
    if (x) {
      this.x = x;
    }
    if (y) {
      this.y = y;
    }
    if (max_height) {
      this.max_height = max_height;
    }
  }

  move_up = function() {
    if (this.y > 0) {
      this.y -= this.speedY;
    }
  }

  move_down = function() {
    if (this.y + this.height < this.max_height) {
      this.y += this.speedY;
    }
  }
}