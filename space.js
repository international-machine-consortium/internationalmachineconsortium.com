// Canvas
const canvas = document.getElementById("space-canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const context = canvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height);

// Constants
const warpZ = 12;
const speed = 0.075;

// Utils

const half = (x) => x / 2;
const range = (n) => [...Array(n).keys()];
const centerOf = ({ width, height }) => [half(width), half(height)];
const random = (x, y) => Math.floor(Math.random() * y * 2) + x;
const calculateVelocity = () => vec3.fromValues(0, 0, -speed);
const getColor = () => "hsla(200,100%, " + random(50, 100) + "%, 1)";
const outside = ({ x, y }) =>
  x < -half(canvas.width) ||
  x > half(canvas.width) ||
  y < -half(canvas.height) ||
  y > half(canvas.height);
const newStarVector = () =>
  vec3.fromValues(
    random(-half(canvas.width), half(canvas.width)),
    random(-half(canvas.height), half(canvas.height)),
    random(1, warpZ)
  );

const drawStar = ({ x, y, dx, dy, color }) => {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(dx, dy);
  context.stroke();
};

const starObjectToMap = (star) => ({
  ...star.dv,
  color: star.color,
});

const getNextStarVector = ({ v, velocity, speed }) => {
  const nextVector = vec3.add(vec3.create(), v, velocity);
  const [x2, y2, z2] = nextVector;

  return {
    x: x2 / z2,
    y: y2 / z2,
    dx: x2 / (z2 + speed * 0.5),
    dy: y2 / (z2 + speed * 0.5),
    nextVector,
  };
};

const resetStar = (star) => {
  const { x, y, nextVector } = star.dv;

  if (outside({ x, y })) {
    star.v = newStarVector();
    star.x = star.v[0];
    star.y = star.v[1];
  } else {
    star.v = nextVector;
  }
};

const updateStar = (star) => {
  star.dv = getNextStarVector({
    v: star.v,
    velocity: star.velocity,
    speed: star.speed,
  });
};

const Star = function ({ color, velocity, speed }) {
  this.color = color;
  this.v = newStarVector();
  this.dv = getNextStarVector({ v: this.v, velocity, speed });
  this.x = this.v[0];
  this.y = this.v[1];
  this.z = this.v[2];
  this.velocity = velocity;
  this.speed = speed;
};

const render = (stars) => () => {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "rgba(0,0,0,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.translate(...centerOf(canvas));
  stars.forEach(updateStar);

  stars.map(starObjectToMap).forEach(drawStar);

  stars.forEach(resetStar);

  requestAnimationFrame(render(stars));
};

const stars = range(250).map(
  (_) =>
    new Star({
      color: getColor(),
      velocity: calculateVelocity(),
      speed,
    })
);

render(stars)();

window.onresize = function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};
