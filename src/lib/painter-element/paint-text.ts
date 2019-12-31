import Painter, { PainterElementBaseOption } from "../painter";
import { FontWeight, BaseLine, TextAlign, Color } from "../value";

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

export default async function paintText(this: Painter, text: Partial<PainterTextElementOption>){
    // this.debug("绘制文本")

    let {
      color = "#000" as Color,
      align = "left" as TextAlign,
      fontWeight = "normal" as FontWeight,
      fontFamily = "serial",
      fontSize = 30,
      baseline = "top" as BaseLine,
      content = "",
      left = 0,
      top = 0,
      width = null,
    } = text;

    if(content === null) content = "";

    left = this.upx2px(left);
    top = this.upx2px(top);

    this.ctx.font = [
      fontWeight != "normal" && fontWeight,
      this.upx2px(fontSize) + "px",
      fontFamily
    ].filter(Boolean).join(" ");

    this.setFillStyle(color);
    this.ctx.setFontSize(this.upx2px(fontSize));
    this.ctx.setTextBaseline(baseline);
    this.ctx.setTextAlign(align);
    this.ctx.fillText(content, left, top);

    let textWidth = width || this.measureText(content, fontSize);
    
    return {
      width: textWidth,
      height: fontSize,
    };
}
