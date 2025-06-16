const Pad = require("./Pad");
const Ball = require("./Ball");

module.exports = class GameArea {
    width = 600;
    height = 600
    padLeft = null;
    padRight = null;

    constructor() {
        this.startBall(300, 300, 600, 600);
    }

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

    startBall(x, y, areaWidth, areaHeight) {
        this.ball = new Ball(x, y, areaWidth, areaHeight);
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

    has_collision(pad, ball, side) {
        const has_collision_on_y = (
            pad,
            ball
        ) => pad.y <= ball.y && ball.y <= pad.y+pad.height;
        const has_collision_on_x_left = (
            pad,
            ball
        ) => ball.x + ball.speedX <= pad.x+pad.width;
        const has_collision_on_x_right = (
            pad,
            ball
        ) => ball.x + ball.width + ball.speedX >= pad.x;

        // FIXME: bug if speed if too high the collison happens before touching the pad
        if (side === "right") {
            return (
                has_collision_on_x_right(pad, ball) &&
                has_collision_on_y(pad, ball)
            );
        }
        return (
            has_collision_on_x_left(pad, ball) &&
            has_collision_on_y(pad, ball)
        );
    }
    collision() {
        if (this.padLeft && this.has_collision(this.padLeft, this.ball, "left")) {
            this.ball.collision(this.padLeft.speedY);
        }
        if (this.padRight && this.has_collision(this.padRight, this.ball, "right")) {
            this.ball.collision(this.padRight.speedY);
        }
    }
}