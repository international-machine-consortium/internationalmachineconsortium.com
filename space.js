// Canvas
const canvas = document.getElementById("space-canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const context = canvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height);

// Utils

const half = (x) => x / 2;
const range = (n) => [...Array(n).keys()];
const centerOf = ({ width, height }) => [half(width), half(height)];
const rnd = (x, y) => Math.floor(Math.random() * y * 2) + x;
const random = (x, y) => Math.floor(Math.random() * y * 2) + x;
const calculateVelocity = () => vec3.fromValues(0, 0, -speed);

const getColor = () => "hsla(200,100%, " + rnd(50, 100) + "%, 1)";

var halfw = canvas.width / 2,
  halfh = canvas.height / 2,
  step = 2,
  warpZ = 12,
  speed = 0.075;
var stampedDate = new Date();

var star = function ({ color, velocity }) {
  let v = vec3.fromValues(
    random(-half(canvas.width), half(canvas.width)),
    random(-half(canvas.height), half(canvas.height)),
    random(1, warpZ)
  );

  this.x = v[0];
  this.y = v[1];
  this.z = v[2];

  this.reset = function () {
    v = vec3.fromValues(
      random(-half(canvas.width), half(canvas.width)),
      random(-half(canvas.height), half(canvas.height)),
      random(1, warpZ)
    );

    this.x = v[0];
    this.y = v[1];
  };

  this.draw = function () {
    const next = vec3.add(vec3.create(), v, velocity);
    const [x2, y2, z2] = next;

    var x = x2 / z2;
    var y = y2 / z2;
    var dx = x2 / (z2 + speed * 0.5);
    var dy = y2 / (z2 + speed * 0.5);

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(dx, dy);
    context.stroke();

    v = next;

    if (
      x < -half(canvas.width) ||
      x > half(canvas.width) ||
      y < -half(canvas.height) ||
      y > half(canvas.height)
    ) {
      this.reset();
    }
  };
};

const Starfield = function () {
  const stars = range(250).map(
    (x) =>
      new star({
        color: getColor(),
        velocity: calculateVelocity(),
      })
  );

  this.draw = function () {
    context.translate(...centerOf(canvas));
    stars.forEach((x) => x.draw());
  };
};

const render = (starfield) => () => {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "rgba(0,0,0,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  starfield.draw();

  requestAnimationFrame(render(starfield));
};

render(new Starfield())();

window.onresize = function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  halfw = canvas.width / 2;
  halfh = canvas.height / 2;
};
