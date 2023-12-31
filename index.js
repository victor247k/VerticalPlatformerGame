const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

const floorCollisions2D = [];

for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol != 0) {
      collisionBlocks.push(
        new CollisionsBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});
// console.log(CollisionsBlocks);

const platformCollisions2D = [];

for (let i = 0; i < floorCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];

platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol != 0) {
      platformCollisionBlocks.push(
        new CollisionsBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

const gravity = 0.1;

const player = new Player({
  position: {
    x: 100,
    y: 350,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "./images/warrior/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./images/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 6,
    },
    IdleLeft: {
      imageSrc: "./images/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 6,
    },
    Run: {
      imageSrc: "images/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    RunLeft: {
      imageSrc: "images/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    Jump: {
      imageSrc: "images/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 6,
    },
    JumpLeft: {
      imageSrc: "images/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 6,
    },
    Fall: {
      imageSrc: "images/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 6,
    },
    FallLeft: {
      imageSrc: "images/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 6,
    },
  },
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "images/background.png",
});

const backgroundImageHeight = 432

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'white'
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(
    camera.position.x,
    camera.position.y
  );
  background.update();
  // collisionBlocks.forEach((CollisionsBlock) => {
  //   CollisionsBlock.update();
  // });
  // platformCollisionBlocks.forEach((block) => {
  //   block.update();
  // });
  player.checkForHorizontalCanvasCollision();
  player.update();

  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") player.switchSprite("Idle");
    else player.switchSprite("IdleLeft");
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({camera, canvas})
    if (player.lastDirection == "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  c.restore();
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      if (player.velocity.y === 0) player.velocity.y = -4;
      break;
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "ArrowUp":
      if (player.velocity.y === 0) player.velocity.y = -4;
      break;
    case " ":
      if (player.velocity.y === 0) player.velocity.y = -4;
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
  }
});
