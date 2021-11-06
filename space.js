// Canvas
const canvas = document.getElementById("space-canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const context = canvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height);

window.onresize = () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

// Constants
const warpZ = 12;
const speed = 0.075;
const velocity = { x: 0, y: 0, z: -speed };

// Utils

const half = (x) => x / 2;
const range = (n) => [...Array(n).keys()];
const centerOf = ({ width, height }) => [half(width), half(height)];
const random = (x, y) => Math.floor(Math.random() * y * 2) + x;
const getColor = () => "hsla(200,100%, " + random(50, 100) + "%, 1)";

const outside = ({ x, y }) =>
  x < -half(canvas.width) ||
  x > half(canvas.width) ||
  y < -half(canvas.height) ||
  y > half(canvas.height);

const addVector = (v1, v2) => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
  z: v1.z + v2.z,
});

// Star

const newStarVector = () => ({
  x: random(-half(canvas.width), half(canvas.width)),
  y: random(-half(canvas.height), half(canvas.height)),
  z: random(1, warpZ),
});

const starToDrawable = (star) => ({ ...star, ...star.dv });

const drawStar = ({ x, y, dx, dy, color }) => {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(dx, dy);
  context.stroke();
};

const getNextStarVector = ({ v, velocity, speed }) => {
  const nextVector = addVector(v, velocity);
  const { x: x2, y: y2, z: z2 } = nextVector;

  return {
    x: x2 / z2,
    y: y2 / z2,
    dx: x2 / (z2 + speed * 0.5),
    dy: y2 / (z2 + speed * 0.5),
    nextVector,
  };
};

const resetStar = (star) => {
  const {
    dv: { x, y, nextVector },
  } = star;

  if (outside({ x, y })) {
    return { ...star, v: newStarVector() };
  } else {
    return { ...star, v: nextVector };
  }
};

const updateStar = (star) => {
  // star.dv = getNextStarVector(star);
  return { ...star, dv: getNextStarVector(star) };
};

const Star = ({ color, velocity, speed, v }) => {
  const { x, y, z } = v;

  return {
    velocity,
    color,
    speed,
    x,
    y,
    z,
    v,
  };
};

const render = (stars) => () => {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "rgba(0,0,0,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.translate(...centerOf(canvas));

  const nextStars = stars.map(updateStar).map(resetStar);

  nextStars.map(starToDrawable).forEach(drawStar);

  requestAnimationFrame(render(nextStars));
};

const stars = range(250).map((_) =>
  Star({
    velocity,
    speed,
    color: getColor(),
    v: newStarVector(),
  })
);

render(stars)();
