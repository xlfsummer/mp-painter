import Painter from "../painter";
import { downloadFileToLocal } from "../../utils/downloadFile";
import { PainterElementOption, PainterElement } from "./base";
import { ObjectFit, OmitBaseOption, Rect, Size, ObjectPosition } from "../value";
import { promisify } from "../../utils/promisify";
import { calculateConcreteRect } from "../core/object-sizing";
import { memorize } from "../../utils/memorize";

const getImageOriginSize = memorize(async function (src: string): Promise<Size>{
  try {
    let { width = 100, height = 100 } = await promisify(uni.getImageInfo)({ src });
    return { width, height };
  }catch(e){
    console.log("mp-painter:getImageOriginSize: fail, use default size: width = 100, height = 100");
    return { width: 100, height: 100 };
  }
});

export interface PainterImageElementOption extends PainterElementOption{
    type: "image";
    /** 
     * 图片地址
     * 
     * 可以使用网络图片地址或下载后的临时图片地址
     */
    src: string;
    width: number;
    height: number;
    /**
     * 图片的适应方式
     * - fill 拉伸图片以铺满容器
     * - contain 等比缩放，使图片刚好能完整显示出来
     * - cover 等比缩放，使图片更好能占满容器
     */
    objectFit?: ObjectFit;
    /**
     * 图片的位置
     * 默认为 `["center","center"]`
     */
    objectPosition?: ObjectPosition;
}

export class PainterImageElement extends PainterElement{
  option: OmitBaseOption<PainterImageElementOption>
  constructor(painter: Painter, option: PainterImageElementOption, parent?: PainterElement){
    super(painter, option, parent);
    this.option = {
      width:          option.width          ?? 100                  ,
      height:         option.height         ?? 100                  ,
      objectFit:      option.objectFit      ?? "fill"               ,
      objectPosition: option.objectPosition ?? ["center", "center"] ,
      src:            option.src
    };
  }
  _layout(){
    return { width: this.option.width, height: this.option.height }
  }
  async paint(){
    let upx2px = this.painter.upx2px;

    if(!this.option.src) return;

    let src = await normalizeImageSrc(this.painter, this.option);
    if(!src) return ;

    console.log("mp-painter:调用小程序drawImage，使用:", src);

    if(this.option.objectFit != "fill"){
      let { sx, sy, sh, sw, dx, dy, dh, dw } = calculateConcreteRect({
        objectFit: this.option.objectFit,
        objectPosition: this.option.objectPosition
      }, 
        await getImageOriginSize(src),
      {
        width: this.option.width,
        height: this.option.height
      });

      this.painter.drawImage(src, sx, sy, sw, sh,
        upx2px(dx + this.elementX),
        upx2px(dy + this.elementY),
        upx2px(dw),
        upx2px(dh)
      );
    } else {
      this.painter.ctx.drawImage(src,
        upx2px(this.elementX),
        upx2px(this.elementY),
        upx2px(this.option.width),
        upx2px(this.option.height)
      )
    }
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
  /** 小程序本地文件相对路径 */
  const LOCAL_FILE_RELATIVE_PATH_REG = /^\./;
  /** 小程序本地文件绝对路径, 暂时限制为 static 开头, 微信小程序预览时可以支持 */
  const LOCAL_FILE_ABSOLUTE_PATH_REG = /^\/static/;

  let isLocalFile =
      // 本地图片
      LOCAL_FILE_RELATIVE_PATH_REG.test(image.src) ||
      LOCAL_FILE_ABSOLUTE_PATH_REG.test(image.src) ||
      // base64 图片
      BASE64_URL_REG.test(image.src) ||
      // 支付宝中需要先下载图片再绘制
      platform == "mp-alipay" && ALIPAY_LOCAL_RESOURCE_URL_REG.test(image.src) ||
      // 微信小程序开发者工具中不需要先下载再绘制, 但在手机中预览时需要
      platform == "mp-weixin" && WEIXIN_LOCAL_RESOURCE_URL_REG.test(image.src) ||
      // 百度小程序手机预览时不下载图片会导致背景变为黑色
      platform == "mp-baidu" && BAIDU_LOCAL_RESOURCE_URL_REG.test(image.src);
  
  if (isLocalFile) return image.src;

  console.log("mp-painter:绘制图片: 下载图片文件:", image.src);
  return await downloadFileToLocal(image.src).catch(err => (console.log("mp-painter:下载错误: ", err), ""));
}
