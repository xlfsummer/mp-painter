import Painter, { PainterElementBaseOption } from "../painter";
import PainterElement from "./paint-element";
import { OmitBaseOption } from "../value";

export interface PainterRectagleElementOption extends PainterElementBaseOption {
    type: "rect",
    width: number,
    height: number,
    background?: string
}

export class PainterRectagleElement extends PainterElement {
  option: OmitBaseOption<PainterRectagleElementOption>;
  constructor(
    painter: Painter, 
    option: PainterRectagleElementOption,
    parent?: PainterElement
  ){
    super(painter, option, parent);
    this.option = option;
  }
  _layout(){
    return {
      width: this.option.width,
      height: this.option.height
    };
  }
  paint(){
    this.painter.setFillStyle(this.option.background ?? "#000");
    this.painter.ctx.fillRect(
      this.painter.upx2px(this.elementX), 
      this.painter.upx2px(this.elementY),
      this.painter.upx2px(this.option.width), 
      this.painter.upx2px(this.option.height)
    );
  }
}
