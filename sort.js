import { Sector } from "./sector.js";
import {
  Events,
  Apps,
  Phone,
  Video,
  Webinars,
  TeamChat,
  MarketPlace,
  Solvvy,
  Whiteboard,
  Api,
  ZoomOI,
  DigitalSignage,
  ConferenceRooms,
  WorkSpace,
  ContactCenter,
  zoomText,
} from "./pathsSVG.js";

const size = Math.min(myCanvas.width * 0.6, window.outerHeight * 0.9);
const context = myCanvas.getContext("2d");
const margin = 10;
myCanvas.style.width = `${size}px`;
myCanvas.style.height = `${size}px`;
const scale = window.devicePixelRatio;
myCanvas.width = Math.floor(size * scale);
myCanvas.height = Math.floor(size * scale);

// Normalize coordinate system to use CSS pixels.
context.scale(scale, scale);

const cardsSrc = [
  {
    group: "Zoom One",
    lines: [Webinars, Phone, Video, TeamChat, Whiteboard, Events],
  },
  {
    group: "Zoom AI",
    lines: [ZoomOI],
  },
  { group: "Zoom Developers", lines: [(MarketPlace, Api, Apps)] },
  { group: "Zoom Contact Center", lines: [ContactCenter, Solvvy] },
  { group: "Zoom Spaces", lines: [WorkSpace, ConferenceRooms, DigitalSignage] },
];
const angleStart = 200; // deg
const [inner, outer] = [40, 15]; // %
const rectWidth = (1 - (1 - (inner + outer) / 100) * Math.cos(Math.PI / 4)) / 2;
function defineAngles(cardsSrc, angleStart) {
  const cards = cardsSrc.map((el) => el.lines.length);
  const sum = cards.reduce((acc, el) => {
    acc += el + margin / 100;
    return acc;
  }, 0);
  const angles = cards.reduce(
    (acc, num, i) => {
      acc = [...acc, ((num + margin / 100) / sum) * Math.PI * 2 + acc[i]];
      return acc;
    },
    [(angleStart * Math.PI) / 180]
  );
  return angles;
}

const angles = defineAngles(cardsSrc, angleStart);

const colors = [
  ["#274d83", "#5b98f0", "#b5d0f8", "#d7e6fc"],
  ["#407676", "#8be2e4", "#c4f3f3", "#dbf9f9"],
  ["#80384d", "#e47a98", "#f3c2d0", "#f9dfe6"],
  ["#815a30", "#f6c08b", "#fadbba", "#fcebd7"],
  ["#4a7d5c", "#9cedb7", "#cff7dc", "#e2fbea"],

  ["#80384d", "#e47a98", "#f3c2d0", "#f9dfe6"],
  ["#815a30", "#f6c08b", "#fadbba", "#fcebd7"],
  ["#4a7d5c", "#9cedb7", "#cff7dc", "#e2fbea"],
];

const coords = {
  x: 0,
  y: 0,
  canvasW: myCanvas.width,
  canvasH: myCanvas.height,
};
const sectors = [];

function init() {
  for (let i = 0; i < angles.length - 1; i++) {
    const [x, y] = [myCanvas.width / 2, myCanvas.height / 2];
    const radius = myCanvas.width / 2;
    sectors[i] = new Sector(
      x,
      y,
      radius,
      inner,
      outer,
      angles[i],
      angles[i + 1 < angles.length ? i + 1 : 0],
      cardsSrc[i].lines.length,
      cardsSrc[i]
    );
    // console.log(sectors[i]);
    sectors[i].draw(context, colors[i], coords, zoomText);
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
  }
}

init();

// document.addEventListener("focus", redraw, true);
// document.addEventListener("blur", redraw, true);
let timer;
myCanvas.addEventListener(
  "click",
  (e) => {
    if (timer) clearTimeout(timer);

    const clickCoords = handleClick(e);
    coords.x = clickCoords.x;
    coords.y = clickCoords.y;
    coords.canvasW = clickCoords.canvasW;
    coords.canvasH = clickCoords.canvasH;
    timer = setTimeout(() => {
      [coords.x, coords.y] = [0, 0];
    }, 100);

    context.clearRect(0, 0, myCanvas.width, myCanvas.height);

    for (let i = 0; i < sectors.length; i++) {
      sectors[i].draw(context, colors[i], coords, scale);
    }
  },
  false
);
// redraw();

function handleClick(e) {
  // Calculate click coordinates
  const { height, width, top } = myCanvas.getBoundingClientRect();
  const x = e.clientX - myCanvas.offsetLeft;
  const y = e.clientY - top;
  const canvasW = e.target.clientWidth;
  const canvasH = e.target.clientHeight;
  return { x, y, canvasW, canvasH };
}

function redraw() {
  context.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for (let i = 0; i < sectors.length; i++) {
    sectors[i].draw(context, colors[i], coords, zoomText);
    sectors[i].rotateTo(sectors[i]);
  }
}

animate();

function animate() {
  context.clearRect(0, 0, myCanvas.width * rectWidth, myCanvas.height);
  context.clearRect(
    myCanvas.width * (1 - rectWidth),
    0,
    myCanvas.width,
    myCanvas.height
  );
  context.clearRect(0, 0, myCanvas.width, myCanvas.height * rectWidth);
  context.clearRect(
    0,
    myCanvas.height * (1 - rectWidth),
    myCanvas.width,
    myCanvas.height
  );
  for (let i = 0; i < sectors.length; i++) {
    sectors[i].draw(context, colors[i], coords, scale);
    sectors[i].rotateTo(sectors[i]);
    // sectors[i].drawZoom(context, zoomText);
  }
  requestAnimationFrame(animate);
}
