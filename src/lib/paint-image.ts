import Painter, { PaintBaseOption } from "./painter";

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

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

    // 图片内容的尺寸
    let contentSize: Rect;
    if(objectFit == "contain"){
      // console.time("calculateContainSize");
      contentSize = await calculateContainSize(image)
      // console.timeEnd("calculateContainSize");
    } else { // fill
      contentSize = { left, top, width, height }
    }

    this.ctx.drawImage(
      image.src,
      this.upx2px(contentSize.left),
      this.upx2px(contentSize.top),
      this.upx2px(contentSize.width),
      this.upx2px(contentSize.height),
    )

    return {
      width,
      height
    };
}

async function calculateContainSize(image: CanvasImage): Promise<Rect>{
  let [, res] = await uni.getImageInfo({ src: image.src }) as unknown as [void, GetImageInfoSuccessData];
  let { width: originWidth = 100, height: originHeight = 100 } = res;
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