import { HSLColor, hslToHex } from "@utils/color";
import { LineFigure } from "@components/ChartMenu/ChartElement";
export class ChartCanvas {
  public max!: number;
  public min!: number;

  private ctx!: CanvasRenderingContext2D;
  private figurePaddingPercentage = 10;
  private numberOfMarks = 10;
  private markLength = 10;
  private decimalDigits = 1;
  private numberOfPoints = 200;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.fillStyle = "#ffffff";
    this.ctx.lineWidth = 0.5;
    this.ctx.font = "16px Cascadia Code";
  }

  public clear() {
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public figures(lines: LineFigure[]) {
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

    lines.forEach((line) => {
      if (line.vector.length >= 2) {
        this.figure(line.vector, line.color);
      }
    });
  }

  private figure(
    vector: number[],
    color: HSLColor = { h: 32, s: 100, l: 50 },
    strokeWidth: number = 2
  ) {
    let hexColor = hslToHex(color);
    this.ctx.strokeStyle = `#${hexColor.r}${hexColor.g}${hexColor.b}`;
    let previousStrokeWidth = this.ctx.lineWidth;
    this.ctx.lineWidth = strokeWidth;

    this.drawInFigureRect((width, height) => {
      this.path(vector, width, height);
    });

    this.ctx.lineWidth = previousStrokeWidth;
  }

  private drawInFigureRect(
    drawFigure: (width: number, height: number) => void
  ) {
    let horizontalPadding =
      (this.figurePaddingPercentage / 100) * this.ctx.canvas.width;
    let verticalPadding =
      (this.figurePaddingPercentage / 100) * this.ctx.canvas.height;

    this.ctx.scale(1, -1);
    this.ctx.translate(0, -this.ctx.canvas.height);
    this.ctx.translate(horizontalPadding, verticalPadding);
    drawFigure(
      this.ctx.canvas.width - 2 * horizontalPadding,
      this.ctx.canvas.height - 2 * verticalPadding
    );
    this.ctx.translate(-horizontalPadding, -verticalPadding);
    this.ctx.translate(0, this.ctx.canvas.height);
    this.ctx.scale(1, -1);
  }

  private path(points: number[], width: number, height: number) {
    this.ctx.beginPath();
    this.moveToStartHeight(this.normalizePoint(points[0], height), height);

    for (let i = 1; i < points.length; i++) {
      let normalizedPoint = this.normalizePoint(points[i], height);
      let xpos = i * (width / (this.numberOfPoints - 1));
      if (this.max != this.min) {
        this.ctx.lineTo(xpos, normalizedPoint);
      } else {
        this.ctx.lineTo(xpos, height / 2);
      }
    }

    this.ctx.stroke();
  }

  private normalizePoint(point: number, height: number): number {
    return ((point - this.min) / (this.max - this.min)) * height;
  }

  private moveToStartHeight(initialY: number, height: number) {
    if (this.max != this.min) {
      this.ctx.moveTo(0, initialY);
    } else {
      this.ctx.moveTo(0, height / 2);
    }
  }

  private axis(x1: number, y1: number, x2: number, y2: number) {
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
        (this.max - ((this.max - this.min) / n) * i).toFixed(
          this.decimalDigits
        ),
        x1 - 70,
        y1 + i * spacing + 10
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
