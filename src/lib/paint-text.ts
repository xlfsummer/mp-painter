import Painter, { CanvasBaseObj } from "./painter";

type fontWeight = "normal" | "bold";
type baseline = "top" | "middle" | "bottom" | "normal";
type align = "left" | "right" | "center";

export interface CanvasText extends CanvasBaseObj {
    type: "text";
    color: string
    fontSize: number;
    fontWeight: fontWeight;
    fontFamily: string;
    baseline: baseline;
    align: align;
    content: string;
    width?: number;
}

export default async function paintText(this: Painter, text: CanvasText){
    // this.debug("绘制文本")

    let {
      color = "#000",
      align = "left",
      fontWeight = "normal",
      fontFamily = "serial",
      fontSize = 30,
      baseline = "top",
      content = "",
      left = 0,
      top = 0,
      width = null,
    } = text;

    if(content === null) content = "";

    left = this.upx2px(left);
    top = this.upx2px(top);

    this.ctx.font = [
      ...(fontWeight == "normal" ? [] : [fontWeight]),
      this.upx2px(fontSize) + "px",
      fontFamily
    ].join(" ");

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