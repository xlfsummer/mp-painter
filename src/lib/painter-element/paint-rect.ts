import Painter, { PainterElementBaseOption } from "../painter";
import PainterElement from "./paint-element";

export interface PainterRectagleElementOption extends PainterElementBaseOption {
    type: "rect",
    width: number,
    height: number,
    background?: string
}

export class PainterRectagleElement extends PainterElement {
  option: PainterRectagleElementOption;
  constructor(
    painter: Painter, 
    option: PainterRectagleElementOption
  ){
    super(painter, option);
    this.option = option;
  }
  layout(){
    return {
      width: this.option.width,
      height: this.option.height
    };
  }
  paint(){
    this.painter.setFillStyle(this.option.background ?? "#000");
    this.painter.ctx.fillRect(
      this.painter.upx2px(this.option.left), 
      this.painter.upx2px(this.option.top),
      this.painter.upx2px(this.option.width), 
      this.painter.upx2px(this.option.height)
    );
  }
}
