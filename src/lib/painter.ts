import { delay } from "../utils/delay";

import paintLine, { PainterLineElementOption } from "./painter-element/paint-line";
import paintRect, { PainterRectagleElementOption } from "./painter-element/paint-rect";
import paintImage, { PainterImageElementOption } from "./painter-element/paint-image";
import paintText, { PainterTextElementOption } from "./painter-element/paint-text";
import paintTextBlock, { PainterTextBlockElementOption } from "./painter-element/paint-text-block";
import paintContainer, { PainterContainerElementOption } from "./painter-element/paint-container";
import { PLATFORM, UniPlatforms } from "../utils/platform";
import { Size } from "./value";
import { CHAR_WIDTH_SCALE_MAP } from "./const";

interface IPanterOption {
  upx2px?: (upx: number) => number
  platform?: UniPlatforms
}

export interface PainterElementBaseOption {
  type: string
  position: "static" | "absolute"
  left: number
  top: number
}

export type PainterElementOption =
  PainterTextElementOption |
  PainterTextBlockElementOption |
  PainterImageElementOption |
  PainterLineElementOption |
  PainterRectagleElementOption |
  PainterContainerElementOption;

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

  async draw(element: PainterElementOption){
    let size = await this._drawObj(element);

    // debug("call context draw method");
    await new Promise(resolve => this.ctx.draw(true, resolve));
    // debug("context draw method done");
    
    // 在 draw 的 callback 中, canvas 还没有真正绘制完成，此时 resolve 会导致文字错乱
    await delay(100);

    return size;
  }

  async _drawObj(paintObj: PainterElementOption){
    switch(paintObj.type){
      case "text":        return paintText      .call(this, paintObj);
      case "text-block":  return paintTextBlock .call(this, paintObj);
      case "image":       return paintImage     .call(this, paintObj);
      case "line":        return paintLine      .call(this, paintObj);
      case "rect":        return paintRect      .call(this, paintObj);
      case "container":   return paintContainer .call(this, paintObj);
      default: throw new TypeError("Unkown painter element type");
    }
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
