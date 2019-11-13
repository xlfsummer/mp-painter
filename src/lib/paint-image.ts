import Painter, { PaintBaseOption } from "./painter";
import { downloadFileToLocal } from "../utils/downloadFile";

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
      contentSize = await calculateContainSize(image);
    } else { // fill
      contentSize = { left, top, width, height }
    }
    let src = await getDrawableImageSrc(this, image);
    console.log("调用小程序绘制，使用:", src);
    if(src){
      this.ctx.drawImage(
        src,
        this.upx2px(contentSize.left),
        this.upx2px(contentSize.top),
        this.upx2px(contentSize.width),
        this.upx2px(contentSize.height),
      )
    }

    return {
      width,
      height
    };
}

async function getDrawableImageSrc(painter: Painter, image: CanvasImage) {
  let platform = painter.platform;
  /** @expample "https://resource/1573628995676.jpg" */
  const ALIPAY_LOCAL_RESOURCE_URL_REG = /^https:\/\/resource\/\d+\.\w+$/;
  const WEIXIN_LOCAL_RESOURCE_URL_REG = /^wxfile:/;
  let shouldDownload = 
    // 支付宝中需要先下载图片再绘制
    platform == "mp-alipay" && !ALIPAY_LOCAL_RESOURCE_URL_REG.test(image.src) ||
    // 微信小程序开发者工具中不需要先下载再绘制, 但在手机中预览时需要
    platform == "mp-weixin" && !WEIXIN_LOCAL_RESOURCE_URL_REG.test(image.src)
    // 百度小程序开发者工具/手机中不需要下载文件即可绘制
  ;

  if (!shouldDownload) return image.src;

  console.log("绘制图片: 下载图片文件:", image.src);
  return await downloadFileToLocal(image.src).catch(err => console.log("下载错误: ", err)) || "";
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