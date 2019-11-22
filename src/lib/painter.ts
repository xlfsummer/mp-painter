import { delay } from "../utils/delay";

import paintLine, { CanvasLine } from "./paint-line";
import paintRect, { CanvasRect } from "./paint-rect";
import paintImage, { CanvasImage } from "./paint-image";
import paintText, { CanvasText, PaintTextObject } from "./paint-text";
import paintTextBlock, { CanvasTextBlock } from "./paint-text-block";
import paintContainer, { CanvasContainer } from "./paint-container";
import { PLATFORM, UniPlatforms } from "../utils/platform";

interface IPanterOption {
  upx2px?: (upx: number) => number
  platform?: UniPlatforms
}

export interface PaintBaseOption {
  position: "static" | "absolute"
  left: number
  top: number
}

interface CanvasObjTypeMap {
  "text": CanvasText,
  "text-block": CanvasTextBlock,
  "image": CanvasImage,
  "line": CanvasLine,
  "rect": CanvasRect,
  "container": CanvasContainer
}

type CanvasObjType<T extends keyof CanvasObjTypeMap> = CanvasObjTypeMap[T];

export type CanvasObj = CanvasImage | CanvasText | CanvasTextBlock | CanvasLine | CanvasContainer | CanvasRect;

type BasePaintObject = [string, Partial<PaintBaseOption>];
type PaintObject = PaintTextObject;

interface ISize {
  width: number,
  height: number
}

interface PaintMethod<T extends PaintBaseOption> {
  (paintOption: T): Promise<ISize>
}

interface DrawMethod {
  (
    /** 要绘制的对象 */
    paintObj: PaintBaseOption,
  ): Promise<ISize>
}

// 开启会导致支付宝小程序报错
const debug = (...v: any[]) => void 0; //console.log(...v);

/** 从 0x20 开始到 0x80 的字符宽度数据 */
const CHAR_WIDTH_SCALE_MAP = [0.296, 0.313, 0.436, 0.638, 0.586, 0.89, 0.87, 0.256, 0.334, 0.334, 0.455, 0.742, 0.241, 0.433, 0.241, 0.427, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.241, 0.241, 0.742, 0.742, 0.742, 0.483, 1.031, 0.704, 0.627, 0.669, 0.762, 0.55, 0.531, 0.744, 0.773, 0.294, 0.396, 0.635, 0.513, 0.977, 0.813, 0.815, 0.612, 0.815, 0.653, 0.577, 0.573, 0.747, 0.676, 1.018, 0.645, 0.604, 0.62, 0.334, 0.416, 0.334, 0.742, 0.448, 0.295, 0.553, 0.639, 0.501, 0.64, 0.567, 0.347, 0.64, 0.616, 0.266, 0.267, 0.544, 0.266, 0.937, 0.616, 0.636, 0.639, 0.64, 0.382, 0.463, 0.373, 0.616, 0.525, 0.79, 0.507, 0.529, 0.492, 0.334, 0.269, 0.334, 0.742, 0.296];

export default class Painter {

  ctx: CanvasContext;
  upx2px: (upx: number) => number
  platform: UniPlatforms

  constructor(ctx: CanvasContext, {
    platform = PLATFORM,
  }: IPanterOption = {}){    
    this.ctx = ctx;
    this.platform = platform;
    this.upx2px = uni.upx2px;
    if(platform == "mp-alipay"){
      this.upx2px = (x: number) => uni.upx2px(x * 2);
    }
  }

  async draw(paintObj: CanvasObj){
    let size = await this._drawObj(paintObj);

    // debug("call context draw method");
    await new Promise(resolve => this.ctx.draw(true, resolve));
    // debug("context draw method done");
    
    // 在 draw 的 callback 中, canvas 还没有真正绘制完成，此时 resolve 会导致文字错乱
    await delay(100);

    return size;
  }

  async _drawObj<T extends CanvasObj>(paintObj: T){
    let drawMethod: ((canvasObj: any) => Promise<ISize>) = {
      "text": paintText,
      "image": paintImage,
      "text-block": paintTextBlock,
      "line": paintLine,
      "rect": paintRect,
      "container": paintContainer
    }[paintObj.type];

    if(!drawMethod){
      throw new TypeError("Unkown paint obj type: " + paintObj.type);
    }
    
    return await drawMethod.call(this, paintObj);
  }

  /**
   * 兼容设置填充样式
   */
  setFillStyle(color: string){
    if(this.platform == "mp-baidu"){
      this.ctx.setFillStyle(color);
    }else{
      this.ctx.fillStyle = color;
    }
  }

  /** 
   * 兼容设置描边样式
   */
  setStrokeStyle(color: string){
    if(this.platform == "mp-baidu"){
      this.ctx.setStrokeStyle(color);
    }else{
      this.ctx.strokeStyle = color;
    }
  }

  measureText(text: string, fontSize: number){
    if(this.platform == "mp-baidu"){
      // 百度测量的字号是以 10 为基准的，不会根据字号设置而变化
      let width = this.ctx.measureText(text).width;
      if(width) return width / 10 * fontSize;
    } if(this.platform == "mp-alipay") {
      // 在支付宝 iOS 中获取字符串宽度时, 如果字符串数量较多，可能获取不到正确的宽度
      // 获取到的宽度会始终比换行所需的宽度小，无法正确换行。
      return text.split("").reduce((widthScaleSum, char) => {
        let code = char.charCodeAt(0);
        let widthScale = CHAR_WIDTH_SCALE_MAP[code - 0x20] || 1;
        return widthScaleSum + widthScale;
      }, 0) * fontSize;
    } else {
      this.ctx.setFontSize(fontSize);
      let width = this.ctx.measureText(text).width;
      if(width) return width;
    }
    return text.length * fontSize;
  }
}
