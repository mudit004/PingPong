const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth / 1.5;
canvas.height = window.innerHeight / 1.5;

const BLOCK_WIDTH = canvas.height / 20;
const BLOCK_HEIGHT = canvas.height / 5;

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);
function drawLine(c) {
  c.setLineDash([20, 8]);
  c.beginPath();
  c.moveTo(canvas.width / 2, 0);
  c.lineTo(canvas.width / 2, canvas.height);
  c.lineWidth = 10;
  c.strokeStyle = "grey";
  c.stroke();
  c.moveTo(0, 0);
}
class Block {
  constructor({ position, velocity, controls }) {
    this.position = position;
    this.velocity = velocity;
    this.controls = controls;
    this.dimensions = {
      w: BLOCK_WIDTH,
      h: BLOCK_HEIGHT,
    };
  }

  draw() {
    c.fillStyle = "white";
    c.beginPath();
    c.roundRect(
      this.position.x,
      this.position.y,
      this.dimensions.w,
      this.dimensions.h,
      [3]
    );
    c.fillStyle = "green";
    c.fill();
  }

  update() {
    this.draw();
    if (
      keys[this.controls.down].pressed &&
      this.position.y + this.dimensions.h <= canvas.height
    ) {
      this.position.y += this.velocity.y;
    } else if (keys[this.controls.up].pressed && this.position.y >= 0) {
      this.position.y -= this.velocity.y;
    }
  }
}

class Ball {
  constructor({ position, velocity, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.acceleration = 0.2;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
    c.fillStyle = "white";
    c.fill();
  }

  reflectX() {
    this.velocity.y = -this.velocity.y;
  }
  reflectY() {
    this.velocity.x = -this.velocity.x;
  }

  reset() {
    this.position.x = canvas.width / 2;
    this.position.y = canvas.height / 2;
    this.velocity.x = 2;
    this.velocity.y = 2;
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (
      this.position.y + this.radius >= canvas.height ||
      this.position.y - this.radius <= 0
    )
      this.reflectX();
    if (
      (BLOCK_WIDTH + this.radius >= this.position.x &&
        this.position.y >= p1.position.y &&
        this.position.y <= p1.position.y + p1.dimensions.h) ||
      (canvas.width - BLOCK_WIDTH - this.radius <= this.position.x &&
        this.position.y >= p2.position.y &&
        this.position.y <= p2.position.y + p2.dimensions.h)
    ) {
      this.reflectY();
      if (this.velocity.x <= 0) {
        this.velocity.x -= this.acceleration;
      }
      if (this.velocity.x > 0) {
        this.velocity.x += this.acceleration;
      }
      if (this.velocity.y > 0) {
        this.velocity.y += this.acceleration;
      }
      if (this.velocity.y <= 0) {
        this.velocity.y -= this.acceleration;
      }
    } else {
      if (this.radius >= this.position.x) {
        scores.p2 += 1;
        document.getElementById("score2").innerHTML = scores.p2;
        this.reset();
      } else if (this.radius + this.position.x >= canvas.width) {
        scores.p1 += 1;
        document.getElementById("score1").innerHTML = scores.p1;
        this.reset();
      }
      if (scores.p1 >= 5) {
        alert("p1 wins!");
        this.reset();
        document.getElementById("score1").innerHTML = 0;
        document.getElementById("score2").innerHTML = 0;
        restart();
      } else if (scores.p2 >= 5) {
        alert("p2 wins!");
        this.reset();
        restart();
      }
    }
  }
}
function restart() {
  scores = {
    p1: 0,
    p2: 0,
  };
  p2.position = {
    x: canvas.width - BLOCK_WIDTH,
    y: canvas.height / 2 - BLOCK_HEIGHT / 2,
  };
  p1.position = { x: 0, y: canvas.height / 2 - BLOCK_HEIGHT / 2 };
}

let scores = {
  p1: 0,
  p2: 0,
};

let keys = {
  w: { pressed: false },
  s: { pressed: false },
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
};

let p1 = new Block({
  position: { x: 0, y: canvas.height / 2 - BLOCK_HEIGHT / 2 },
  velocity: { x: 0, y: 5 },
  controls: { down: "s", up: "w" },
});

let p2 = new Block({
  position: {
    x: canvas.width - BLOCK_WIDTH,
    y: canvas.height / 2 - BLOCK_HEIGHT / 2,
  },
  velocity: { x: 0, y: 5 },
  controls: { down: "ArrowDown", up: "ArrowUp" },
});

let ball = new Ball({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 2, y: 2 },
  radius: 20,
});

function animate() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  drawLine(c);
  p1.update();
  p2.update();
  ball.update();
  window.requestAnimationFrame(animate);
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      keys.ArrowDown.pressed = true;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      break;
    case "w":
      keys.w.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
  }
});
