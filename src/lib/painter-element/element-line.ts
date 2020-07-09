import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption } from "../value";
import { BuiltInPainterFillStrokeOption, createFillStrokeStyle } from "../painter-fill-stroke/index";
import { pixelFix } from "../../utils/pixelFix";

export interface PainterLineElementOption extends PainterElementOption {
    type: "line"
    /** 直线终点距离起点在水平方向上的距离 */
    dx: number
    /** 直线终点距离起点在垂直方向上的距离 */
    dy: number
    /** 直线的颜色 */
    color: BuiltInPainterFillStrokeOption
    /** 直线的宽度 */
    lineWidth: number
    /** 虚线样式，默认为实线 */
    dashPattern: number[]
}

export class PainterLineElement extends PainterElement {
  option: OmitBaseOption<PainterLineElementOption>
  constructor(painter: Painter, option: Partial<PainterLineElementOption>, parent?: PainterElement){
    super(painter, option, parent);
    this.option = {
      dx:           option.dx           ?? 0,
      dy:           option.dy           ?? 0,
      color:        option.color        ?? "#000",
      dashPattern:  option.dashPattern  ?? [1, 0],
      lineWidth:    option.lineWidth    ?? 1
    }
  }
  _layout(){
    return { width: this.option.dx, height: this.option.dy };
  }
  paint(){
    let x1 = this.painter.upx2px(this.elementX);
    let y1 = this.painter.upx2px(this.elementY);
    let x2 = this.painter.upx2px(this.elementX + this.option.dx);
    let y2 = this.painter.upx2px(this.elementY + this.option.dy);
    let lineWidth = this.painter.upx2px(this.option.lineWidth);

    this.painter.ctx.beginPath();
    this.painter.ctx.moveTo(...pixelFix(x1, y1, lineWidth));
    this.painter.ctx.lineTo(...pixelFix(x2, y2, lineWidth));
    this.painter.ctx.setLineDash(this.option.dashPattern.map(x => this.painter.upx2px(x)));
    this.painter.setStrokeStyle(createFillStrokeStyle(this, this.option.color));
    this.painter.ctx.lineWidth = lineWidth;
    this.painter.ctx.stroke();
  }
}
