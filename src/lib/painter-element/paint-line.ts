import Painter, { PainterElementBaseOption } from "../painter";
import PainterElement from "./paint-element";

export interface PainterLineElementOption extends PainterElementBaseOption {
    type: "line"
    dx: number
    dy: number
    color: string
    lineWidth: number
    dashPattern: number[],
}

export default async function paintLine(this: Painter, line: PainterLineElementOption){
  let l = new PainterLineElement(this, line);
  l.paint();
  return l.layout();
}


export class PainterLineElement extends PainterElement {
  option: Required<Omit<PainterLineElementOption, "type">>
  constructor(painter: Painter, option: Partial<PainterLineElementOption>){
    super(painter);
    this.option = {
      position:     option.position     ?? "static",
      dx:           option.dx           ?? 0,
      dy:           option.dy           ?? 0,
      left:         option.left         ?? 0,
      top:          option.top          ?? 0,
      color:        option.color        ?? "#000",
      dashPattern:  option.dashPattern  ?? [1, 0],
      lineWidth:    option.lineWidth    ?? 1
    }
  }
  layout(){
    return { width: this.option.dx, height: this.option.dy };
  }
  paint(){
    let x1 = this.painter.upx2px(this.option.left);
    let y1 = this.painter.upx2px(this.option.top);
    let x2 = this.painter.upx2px(this.option.left + this.option.dx);
    let y2 = this.painter.upx2px(this.option.top + this.option.dy);

    this.painter.ctx.moveTo(x1, y1);
    this.painter.ctx.lineTo(x2, y2);
    this.painter.ctx.setLineDash(this.option.dashPattern.map(this.painter.upx2px));
    this.painter.setStrokeStyle(this.option.color);
    this.painter.ctx.lineWidth = this.painter.upx2px(this.option.lineWidth);
    this.painter.ctx.stroke();
  }
}
