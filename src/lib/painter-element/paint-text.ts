import Painter, { PainterElementBaseOption } from "../painter";
import { FontWeight, BaseLine, TextAlign, OmitBaseOption } from "../value";
import PainterElement from "./paint-element";

export interface PainterTextElementOption extends PainterElementBaseOption {
    type: "text";
    color: string
    fontSize: number;
    fontWeight: FontWeight;
    fontFamily: string;
    baseline: BaseLine;
    align: TextAlign;
    content: string;
    width?: number;
}

export class PainterTextElement extends PainterElement {
  option: OmitBaseOption<PainterTextElementOption>
  constructor(painter: Painter, option: PainterTextElementOption, parent?: PainterElement){
    super(painter, option, parent);
    this.option = {
      color:      option.color      ??  "#000"  ,
      align:      option.align      ??  "left"  ,
      fontWeight: option.fontWeight ??  "normal",
      fontFamily: option.fontFamily ??  "serial",
      fontSize:   option.fontSize   ??  30      ,
      baseline:   option.baseline   ??  "top"   ,
      content:    option.content    ??  ""      ,
      width:      option.width      ??  void 0  ,
    }
  }
  _layout(){
    let textWidth = this.option.width ?? this.painter.measureText(this.option.content, this.option.fontSize);
    return {
      width: textWidth,
      height: this.option.fontSize
    }
  }
  paint(){
    this.painter.ctx.font = [
      this.option.fontWeight != "normal" && this.option.fontWeight,
      this.painter.upx2px(this.option.fontSize) + "px",
      this.option.fontFamily
    ].filter(Boolean).join(" ");

    this.painter.setFillStyle(this.option.color);
    this.painter.ctx.setFontSize(this.painter.upx2px(this.option.fontSize));
    this.painter.ctx.setTextBaseline(this.option.baseline);
    this.painter.ctx.setTextAlign(this.option.align);
    this.painter.ctx.fillText(
      this.option.content,
      this.painter.upx2px(this.elementX),
      this.painter.upx2px(this.elementY)
    );
  }
}
