import { lerp } from "./math.js";

export class Sector {
  constructor(
    x,
    y,
    radius,
    inner = 30,
    outer = 10,
    angleStart = 0,
    angle = 180,
    icons = 1,
    cardsSrc
  ) {
    // inner %, outer %, angle deg
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.inner = inner;
    this.outer = outer;
    this.angleStart = angleStart;
    this.angle = angle;
    this.icons = icons;
    this.cardsSrc = cardsSrc;
  }

  rotateTo(sector, frameCount = 20) {
    // frameCount always should be Int round Up
    // it makes this func independent from outside
    const deg = (1 / 180) * Math.PI;
    frameCount = Math.ceil(frameCount);
    for (let i = 1; i <= frameCount; i++) {
      this.angleStart = sector.angleStart + (deg * i) / frameCount / 100;
      this.angle = sector.angle + (deg * i) / frameCount / 100;
    }
  }

  draw(context, color) {
    const angleS = this.angleStart;
    const angleE = this.angle;
    const cosS = Math.cos(angleS);
    const sinS = Math.sin(angleS);
    const cosA = Math.cos(angleE);
    const sinA = Math.sin(angleE);

    const radiusOuter = this.radius * (1 - this.outer / 100);
    const radiusGroup = this.radius * (1 - this.outer / 2 / 100);
    const radiusInner = this.radius * (1 - (this.outer + this.inner) / 100);
    const radiusIcons = this.radius * (1 - (this.outer + this.inner / 2) / 100);

    const radiusStartX = this.x + this.radius * cosS;
    const radiusStartY = this.y + this.radius * sinS;
    const radiusOuterEndX =
      this.x + this.radius * cosA * (1 - this.outer / 100);
    const radiusOuterEndY =
      this.y + this.radius * sinA * (1 - this.outer / 100);

    context.beginPath();
    context.fillStyle = color[3];
    context.strokeStyle = color[1];
    context.moveTo(radiusStartX, radiusStartY);
    context.arc(this.x, this.y, this.radius, this.angleStart, this.angle);
    context.lineTo(radiusOuterEndX, radiusOuterEndY);
    context.arc(this.x, this.y, radiusOuter, this.angle, this.angleStart, true);
    context.lineTo(radiusStartX, radiusStartY);
    context.fill();
    context.stroke();

    context.beginPath();
    context.fillStyle = color[2];
    context.moveTo(radiusStartX, radiusStartY);
    context.arc(this.x, this.y, radiusOuter, this.angleStart, this.angle);
    context.lineTo(radiusOuterEndX, radiusOuterEndY);
    context.arc(this.x, this.y, radiusInner, this.angle, this.angleStart, true);
    context.lineTo(radiusStartX, radiusStartY);

    context.fill();
    context.stroke();

    context.fillStyle = color[0];
    context.font = "1rem Arial monospace";
    context.textBaseline = "middle";
    context.textAlign = "center";

    const textArr = this.cardsSrc.group.split("");
    for (let k = 0; k < textArr.length; k++) {
      const angleL = lerp(angleS, angleE, (k + 1) / (textArr.length + 1));
      const cosL = Math.cos(angleL);
      const sinL = Math.sin(angleL);

      if (angleS % (Math.PI * 2) >= 0 && angleS % (Math.PI * 2) <= Math.PI) {
        console.log(angleS, angleE, angleL);
        console.dir(textArr[textArr.length - k - 1].__proto__);

        context.fillText(
          textArr[textArr.length - k - 1],
          this.x + radiusGroup * cosL,
          this.y + radiusGroup * sinL
        );
        // Reset transformation matrix to the identity matrix
        context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        context.fillText(
          textArr[k],
          this.x + radiusGroup * cosL,
          this.y + radiusGroup * sinL
        );
      }
    }
    for (let i = 1; i <= this.icons; i++) {
      context.font = "0.75rem Arial";
      context.textBaseline = "middle";
      context.textAlign = "center";
      const angDDD = lerp(angleS, angleE, i / (this.icons + 1));
      const iconsX = Math.cos(angDDD) * radiusIcons;
      const iconsY = Math.sin(angDDD) * radiusIcons;
      context.fillStyle = color[0];
      const sizeXY = this.cardsSrc.lines[i - 1].viewBox.split(" ");
      const [sizeX, sizeY] = [sizeXY[2] - sizeXY[0], sizeXY[3] - sizeXY[1]];

      const size = (Math.max(sizeX, sizeY) / (radiusOuter - radiusInner)) * 3;

      const p1 = new Path2D(this.cardsSrc.lines[i - 1].path);
      const m = new DOMMatrix();

      const p = new Path2D();
      const t = m
        .scale(1 / size)
        .translate(
          (this.x + iconsX - sizeX / size / 2) * size,
          (this.y + iconsY - sizeY / size / 2) * size
        );
      const lineN = this.cardsSrc.lines[i - 1].text.length;
      for (let j = 0; j < lineN; j++) {
        context.fillText(
          this.cardsSrc.lines[i - 1].text[j],
          this.x + iconsX,
          this.y +
            iconsY -
            sizeY /
              size /
              ((j * (lineN === 1 ? 1 : 0.5) + 1) * (lineN === 1 ? 1.4 : 1))
        );
      }

      p.addPath(p1, t);
      context.stroke(p);
      context.fill(p);
    }
  }
}
