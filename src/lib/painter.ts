import { delay } from "../utils/delay";

import paintLine, { CanvasLine } from "./paint-line";
import paintRect, { CanvasRect } from "./paint-rect";
import paintImage, { CanvasImage } from "./paint-image";
import paintText, { CanvasText } from "./paint-text";
import paintTextBlock, { CanvasTextBlock } from "./paint-text-block";
import paintContainer, { CanvasContainer } from "./paint-container";

type UniPlatforms =  "mp-weixin" | "mp-alipay" | "mp-baidu";

interface IPanterOption {
  upx2px: (upx: number) => number
  platform?: UniPlatforms
}

export interface CanvasBaseObj {
  type: string
  position?: "static" | "absolute"
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

interface ISize {
  width: number,
  height: number
}

interface DrawMethod {
  (
    /** 要绘制的对象 */
    paintObj: CanvasBaseObj,
  ): Promise<ISize>
}

// 开启会导致支付宝小程序报错
const debug = (...v: any[]) => void 0; //console.log(...v);

export default class Painter {

  ctx: CanvasContext;
  upx2px: (upx: number) => number
  platform: UniPlatforms

  constructor(ctx: CanvasContext, option: IPanterOption){
    this.ctx = ctx;
    this.upx2px = option.upx2px;
    this.platform = option.platform || "mp-weixin";
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
    } else {
      this.ctx.setFontSize(fontSize);
      let width = this.ctx.measureText(text).width;
      if(width) return width;
    }
    return text.length * fontSize;
  }
}