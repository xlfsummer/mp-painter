import Painter, { PaintBaseOption } from "./painter";

export interface CanvasImage extends PaintBaseOption{
    type: "image";
    src: string;
    width: number;
    height: number;
    objectFit?: "fill" | "contain"; //| "cover" | "scale-down" | "none";
}

export default async function paintImage(this: Painter, image: CanvasImage){

    let {
      left,
      top,
      width,
      height,
      objectFit = "fill"
    } = image;

    if(objectFit != "fill"){
      { left, top, width, height } = await calculateSize(image)
    }

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

async function calculateSize(image: CanvasImage): Promise<{ left: number, top: number, width: number, height: number }>{
  let { width: originWidth = 100, height: originHeight = 100 } = (await uni.getImageInfo({ src: image.src })) as unknown as GetImageInfoSuccessData;
  //contain
  let originRatio = originWidth / originHeight;
  let clientRatio = image.width / image.height;
  let scale = originRatio > clientRatio
    ? image.width / originWidth
    : image.height / originHeight;
  return {
    left: image.left + (image.width - originWidth * scale) / 2,
    top: image.top + (image.height - originHeight * scale) / 2,
    width: originWidth * scale,
    height: originHeight * scale
  };
}