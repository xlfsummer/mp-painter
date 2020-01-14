import Painter, { PainterElementBaseOption } from "../painter";
import { downloadFileToLocal } from "../../utils/downloadFile";
import PainterElement from "./paint-element";
import { ObjectFit, OmitBaseOption, Rect } from "../value";

export interface PainterImageElementOption extends PainterElementBaseOption{
    type: "image";
    src: string;
    width: number;
    height: number;
    objectFit?: ObjectFit;
}

export class PainterImageElement extends PainterElement{
  option: OmitBaseOption<PainterImageElementOption>
  constructor(painter: Painter, option: PainterImageElementOption, parent?: PainterElement){
    super(painter, option, parent);
    this.option = {
      width:      option.width      ?? 100      ,
      height:     option.height     ?? 100      ,
      objectFit:  option.objectFit  ?? "fill"   ,
      src:        option.src
    };
  }
  _layout(){
    return { width: this.option.width, height: this.option.height }
  }
  async paint(){
    if(!this.option.src) return;

    // 图片内容的尺寸
    let contentDimention: Rect;
    if(this.option.objectFit == "contain"){
      contentDimention = await calculateContainSize(this.option);
    } else { // fill
      contentDimention = { 
        left:   0, 
        top:    0,
        width:  this.option.width,
        height: this.option.height
      }
    }

    let src = await normalizeImageSrc(this.painter, this.option);
    if(!src) return ;
    console.log("调用小程序drawImage，使用:", src);
    this.painter.ctx.drawImage(
      src,
      this.painter.upx2px(this.elementX + contentDimention.left),
      this.painter.upx2px(this.elementY + contentDimention.top),
      this.painter.upx2px(contentDimention.width),
      this.painter.upx2px(contentDimention.height),
    )
  }
}

async function normalizeImageSrc(painter: Painter, image: Pick<PainterImageElementOption, "src">) {
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
  
  const BASE64_URL_REG = /^data:image\//;
  /** 小程序本地文件路径 */
  const LOCAL_FILE_PATH_REG = /^\./;

  let isLocalFile =
      // 本地图片
      LOCAL_FILE_PATH_REG.test(image.src) ||
      // base64 图片
      BASE64_URL_REG.test(image.src) ||
      // 支付宝中需要先下载图片再绘制
      platform == "mp-alipay" && ALIPAY_LOCAL_RESOURCE_URL_REG.test(image.src) ||
      // 微信小程序开发者工具中不需要先下载再绘制, 但在手机中预览时需要
      platform == "mp-weixin" && WEIXIN_LOCAL_RESOURCE_URL_REG.test(image.src) ||
      // 百度小程序手机预览时不下载图片会导致背景变为黑色
      platform == "mp-baidu" && BAIDU_LOCAL_RESOURCE_URL_REG.test(image.src);
  
  if (isLocalFile) return image.src;

  console.log("绘制图片: 下载图片文件:", image.src);
  return await downloadFileToLocal(image.src).catch(err => (console.log("下载错误: ", err), ""));
}

async function calculateContainSize(image: Pick<PainterImageElementOption, "src" | "width" | "height">): Promise<Rect>{
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
    left: (image.width - originWidth * scale) / 2,
    top: (image.height - originHeight * scale) / 2,
    width: originWidth * scale,
    height: originHeight * scale
  };
}
