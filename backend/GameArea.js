const Pad = require("./Pad");

module.exports = class GameArea {
    width = 600;
    height = 600
    padLeft = null;
    padRight = null;

    addPad() {
        if (!this.padLeft) {
            this.padLeft = new Pad();
            return "left";
        } else if (!this.padRight) {
            this.padRight = new Pad(580);
            return "right";
        }
        return "full";
    }

    removeLeft() {
        this.padLeft = null;
    }
    removeRight() {
        this.padRight = null;
    }

    moveLeftUp() {
        this.padLeft.move_up();
    }
    moveLeftDown() {
        this.padLeft.move_down();
    }
    moveRightUp() {
        this.padRight.move_up();
    }
    moveRightDown() {
        this.padRight.move_down();
    }
}