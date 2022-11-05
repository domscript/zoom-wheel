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
} from "./pathsSVG.js";

myCanvas.height = Math.min(myCanvas.width * 0.6, window.outerHeight * 0.9);
myCanvas.width = myCanvas.height;
const context = myCanvas.getContext("2d");
const margin = 10;

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
const angleStart = 200;
const [inner, outer] = [40, 15];

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
    sectors[i].draw(context, colors[i]);
  }
}

init();

// animate();

function animate() {
  context.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for (let i = 0; i < sectors.length; i++) {
    sectors[i].draw(context, colors[i]);
    sectors[i].rotateTo(sectors[i]);
  }
  const img = new Image();
  img.src = "ZoomLogo.png";
  img.onload = () => {
    context.drawImage(img, 0, 0, myCanvas.width, myCanvas.height);
  };

  requestAnimationFrame(animate);
}
