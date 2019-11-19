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

    if(!image.src) return { width, height };

    // 图片内容的尺寸
    let contentSize: Rect;
    if(objectFit == "contain"){
      contentSize = await calculateContainSize(image);
    } else { // fill
      contentSize = { left, top, width, height }
    }

    let src = await getDrawableImageSrc(this, image);
    if(!src) return { width, height };
    console.log("调用小程序drawImage，使用:", src);
    this.ctx.drawImage(
      src,
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

async function getDrawableImageSrc(painter: Painter, image: CanvasImage) {
  let platform = painter.platform;
  /** 
   * @expample "https://resource/1573628995676.jpg" 开发者工具
   * @expample "https://resource/apmlxxxxx" 手机预览
  */
  const ALIPAY_LOCAL_RESOURCE_URL_REG = /^https:\/\/resource\//;
  const WEIXIN_LOCAL_RESOURCE_URL_REG = /^wxfile:/;
  /**
   * @example "bdfile://tmp/program/bf0738...9143805.png" 开发者工具（当前百度开发者工具中会绘制失败）
   * @example "bdfile://tmp_xxxxx" 手机预览
   */
  const BAIDU_LOCAL_RESOURCE_URL_REG = /^bdfile:\/\/tmp/;

  let shouldDownload = 
    // 支付宝中需要先下载图片再绘制
    platform == "mp-alipay" && !ALIPAY_LOCAL_RESOURCE_URL_REG.test(image.src) ||
    // 微信小程序开发者工具中不需要先下载再绘制, 但在手机中预览时需要
    platform == "mp-weixin" && !WEIXIN_LOCAL_RESOURCE_URL_REG.test(image.src) ||
    // 百度小程序手机预览时不下载图片会导致背景变为黑色
    platform == "mp-baidu" && !BAIDU_LOCAL_RESOURCE_URL_REG.test(image.src)
  ;

  if (!shouldDownload) return image.src;

  console.log("绘制图片: 下载图片文件:", image.src);
  return await downloadFileToLocal(image.src).catch(err => (console.log("下载错误: ", err), ""));
}

async function calculateContainSize(image: CanvasImage): Promise<Rect>{
  let res: Partial<Record<"width"|"height", number>> = {};
  try {
    [, res] = await uni.getImageInfo({ src: image.src }) as unknown as [void, GetImageInfoSuccessData];
  }catch(e){
    console.log(e)
  }

  let { width: originWidth = 100, height: originHeight = 100 } = (res || {});
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