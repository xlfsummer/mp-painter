import { delay } from "../utils/delay";

import paintLine, { CanvasLine } from "./painter-element/paint-line";
import paintRect, { CanvasRect } from "./painter-element/paint-rect";
import paintImage, { CanvasImage } from "./painter-element/paint-image";
import paintText, { CanvasText, PaintTextObject } from "./painter-element/paint-text";
import paintTextBlock, { CanvasTextBlock } from "./painter-element/paint-text-block";
import paintContainer, { CanvasContainer } from "./painter-element/paint-container";
import { PLATFORM, UniPlatforms } from "../utils/platform";
import { Size } from "./value";
import { CHAR_WIDTH_SCALE_MAP } from "./const";

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
export type PainterElement = CanvasImage | CanvasText | CanvasTextBlock | CanvasLine | CanvasContainer | CanvasRect;

type BasePaintObject = [string, Partial<PaintBaseOption>];
type PaintObject = PaintTextObject;

interface PaintMethod<T extends PaintBaseOption> {
  (paintOption: T): Promise<Size>
}

// 开启会导致支付宝小程序报错
const debug = (...v: any[]) => void 0; //console.log(...v);

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

  async draw(element: PainterElement){
    let size = await this._drawObj(element);

    // debug("call context draw method");
    await new Promise(resolve => this.ctx.draw(true, resolve));
    // debug("context draw method done");
    
    // 在 draw 的 callback 中, canvas 还没有真正绘制完成，此时 resolve 会导致文字错乱
    await delay(100);

    return size;
  }

  async _drawObj<T extends PainterElement>(paintObj: T){
    let drawMethod: ((canvasObj: any) => Promise<Size>) = {
      "text": paintText,
      "image": paintImage,
      "text-block": paintTextBlock,
      "line": paintLine,
      "rect": paintRect,
      "container": paintContainer
    }[paintObj.type];

    if(!drawMethod){
      throw new TypeError("Unkown painter element type: " + paintObj.type);
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

    } else if(this.platform == "mp-alipay") {
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
