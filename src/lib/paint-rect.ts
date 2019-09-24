import Painter, { PaintBaseOption } from "./painter";

export interface CanvasRect extends PaintBaseOption {
    type: "rect",
    width: number,
    height: number,
    background: string
}

export default async function paintRect(this: Painter, rect: CanvasRect){
    // this.debug("绘制矩形");
    this.setFillStyle(rect.background);
    this.ctx.fillRect(
      this.upx2px(rect.left), 
      this.upx2px(rect.top), 
      this.upx2px(rect.width), 
      this.upx2px(rect.height)
    );
    return { width: rect.width, height: rect.height };
}