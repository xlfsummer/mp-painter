import Painter, { PaintBaseOption } from "../painter";

export interface CanvasLine extends PaintBaseOption {
    type: "line"
    dx: number
    dy: number
    color: string
    lineWidth: number
    dashPattern: number[],
    pixelFix: boolean
}

export default async function paintLine(this: Painter, line: CanvasLine){
    // this.debug("绘制直线")

    let {
      left,
      top,
      dx = 0,
      dy = 0,
      dashPattern = [1, 0],
      pixelFix = false,
      lineWidth = 1
    } = line;

    let x1 = this.upx2px(left);
    let y1 = this.upx2px(top);
    let x2 = this.upx2px(left + dx);
    let y2 = this.upx2px(top + dy);

    let color = line.color;
    
    dashPattern = dashPattern.map(n => this.upx2px(n));

    if(pixelFix){
      let fix = (d: number) => Math.floor(d) + 0.5;
      [x1, y1, x2, y2] = [x1, y1, x2, y2].map(fix);
    }

    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.setLineDash(dashPattern);
    this.setStrokeStyle(color);
    this.ctx.lineWidth = this.upx2px(lineWidth);
    this.ctx.stroke()

    return {
      width: dx,
      height: dy
    };
  }
