import Painter, { CanvasBaseObj } from "./painter";

export interface CanvasImage extends CanvasBaseObj{
    type: "image";
    src: string;
    width: number;
    height: number;
    // objectFit: "fill" | "contain" | "cover" | "scale-down" | "none";
}

export default async function paintImage(this: Painter, image: CanvasImage){
    // this.debug("绘制图片")

    let {
      left,
      top,
      width,
      height
    } = image;

    this.ctx.drawImage(
      image.src,
      this.upx2px(left),
      this.upx2px(top),
      this.upx2px(width),
      this.upx2px(height),
    )

    return {
      width,
      height
    };
  }