import { HSLColor, hslToHex } from "@utils/color";
import { getNormalizedPoints } from "@utils/math";
import { Point } from "@utils/math";
export class ChartCanvas {
  public maxX!: number;
  public maxY!: number;
  public minX!: number;
  public minY!: number;

  private ctx!: CanvasRenderingContext2D;
  private figurePaddingPercentage = 10;
  private numberOfMarks = 10;
  private markLength = 10;
  private decimalDigits = 1;
  private initialColor = { h: 32, s: 60, l: 80 };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.fillStyle = "#ffffff";
    this.ctx.lineWidth = 0.5;
    this.ctx.font = "16px Cascadia Code";
  }

  //TODO: change functions visibility

  public clear() {
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public figures(vectors: Point[][]) {
    vectors.forEach((vector, index) => {
      if (vector.length >= 2) {
        this.figure(vector, 2, {
          h: (this.initialColor.h + index * 50) % 360,
          l: this.initialColor.l,
          s: this.initialColor.s,
        });
      }
    });
  }

  public figure(
    vector: Point[],
    strokeWidth: number = 2,
    color: HSLColor = { h: 32, s: 100, l: 50 }
  ) {
    let horizontalPadding =
      (this.figurePaddingPercentage / 100) * this.ctx.canvas.width;
    let verticalPadding =
      (this.figurePaddingPercentage / 100) * this.ctx.canvas.height;

    this.axis(
      horizontalPadding,
      verticalPadding,
      this.ctx.canvas.width - horizontalPadding,
      this.ctx.canvas.height - verticalPadding
    );
    let hexColor = hslToHex(color);
    this.ctx.strokeStyle = `#${hexColor.r}${hexColor.g}${hexColor.b}`;
    let previousStrokeWidth = this.ctx.lineWidth;
    this.ctx.lineWidth = strokeWidth;
    this.path(
      horizontalPadding,
      verticalPadding,
      this.ctx.canvas.width - horizontalPadding,
      this.ctx.canvas.height - verticalPadding,
      vector
    );
    this.ctx.lineWidth = previousStrokeWidth;
  }

  public path(x1: number, y1: number, x2: number, y2: number, points: Point[]) {
    let normalizedPoints = getNormalizedPoints(points, x2 - x1, y2 - y1);
    this.ctx.translate(x1, y1);
    this.ctx.beginPath();
    this.ctx.moveTo(normalizedPoints[0].x, normalizedPoints[0].y);
    normalizedPoints.slice(1).forEach((point) => {
      this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();
    this.ctx.translate(-x1, -y1);
  }

  public axis(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.strokeStyle = "#000000";
    this.line(x1, y1, x1, y2);
    this.verticalAxisMarks(x1, y1, y2, this.numberOfMarks);
  }

  private verticalAxisMarks(x1: number, y1: number, y2: number, n: number) {
    let spacing = (y2 - y1) / n;
    for (let i = 0; y1 + i * spacing <= y2; i++) {
      this.line(x1, y1 + i * spacing, x1 + this.markLength, y1 + i * spacing);
      this.ctx.fillStyle = "#000";
      this.ctx.fillText(
        (this.maxY - ((this.maxY - this.minY) / n) * i).toFixed(
          this.decimalDigits
        ),
        x1 - 70,
        y1 + i * spacing + 10
      );
      this.ctx.fillStyle = "#fff";
    }
  }

  private horizontalAxisMarks(x1: number, y1: number, x2: number, n: number) {
    let spacing = (x2 - x1) / n;
    for (let i = 0; x1 + i * spacing < x2 + spacing; i++) {
      this.line(x1 + i * spacing, y1, x1 + i * spacing, y1 - this.markLength);
      this.ctx.fillStyle = "#000";
      this.ctx.fillText(
        (this.maxX - ((this.maxX - this.minX) / n) * i).toFixed(
          this.decimalDigits
        ),
        x1 + i * spacing - spacing / 2,
        y1 + 30
      );
      this.ctx.fillStyle = "#fff";
    }
  }

  private line(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
}
