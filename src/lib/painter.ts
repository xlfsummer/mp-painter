import { delay } from "../utils/delay";

import { PLATFORM, UniPlatforms } from "../utils/platform";
import { CHAR_WIDTH_SCALE_MAP } from "./const";
import { BuiltInPainterElementOption, createElement } from "./painter-element/index";
import { upx2px as defaultUpx2px } from "../utils/upx2px";
import { BaseLine, FillStrokeStyle, TextAlign, Size } from "./value";
import { adaptContext, PainterContext } from "./painter-context/index";

interface IPanterOption {
  platform?: UniPlatforms
  upx2px?: (upx: number) => number
}

/** 单次绘制选项 */
interface IDrawOption {
}

export default class Painter {
  ctx: PainterContext;
  upx2px: NonNullable<IPanterOption["upx2px"]>
  platform: NonNullable<IPanterOption["platform"]>

  constructor(ctx: CanvasContext, {
    platform = PLATFORM,
    upx2px
  }: IPanterOption = {}){
    this.platform = platform;
    
    this.upx2px = upx2px ?? defaultUpx2px;
    if(platform == "mp-alipay"){
      this.upx2px = (x: number) => (upx2px ?? defaultUpx2px)(x * 2);
    }

    this.ctx = adaptContext(this, ctx);
  }

  async draw(elementOption: BuiltInPainterElementOption, drawOption: IDrawOption = {}){

    let element = createElement(this, elementOption);
    let size = await element.layout();
    await element.paint();

    await new Promise<void>(resolve => this.ctx.draw(true, resolve));

    // 在 draw 的 callback 中, canvas 还没有真正绘制完成，此时 resolve 会导致文字错乱
    await delay(100);
    
    return size;
  }

  /** 创建元素对象 */
  createElement(elementOption: BuiltInPainterElementOption){
    return createElement(this, elementOption);
  }

  /** 获取指定元素的尺寸 */
  async layout(elementOption: BuiltInPainterElementOption){
    return await this.createElement(elementOption).layout();
  }

  /**
   * 兼容设置填充样式
   */
  setFillStyle(color: FillStrokeStyle){
    if(this.platform == "mp-baidu"){
      this.ctx.setFillStyle(color);
    }else{
      this.ctx.fillStyle = color;
    }
  }

  /** 
   * 兼容设置描边样式
   */
  setStrokeStyle(color: FillStrokeStyle){
    if(this.platform == "mp-baidu"){
      this.ctx.setStrokeStyle(color);
    }else{
      this.ctx.strokeStyle = color;
    }
  }
  
  /** 测量文本宽度 */
  measureText(text: string, fontSize: number){
    if(this.platform == "mp-weixin" && (text.includes("\n") || text.includes("\r"))){
      console.warn(`mp-painter:measureText:字符串 "${text}" 中包含换行符，结果在 iPhone 上可能不准确`);
    }

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
      console.debug("measureText: result of measure text \"%s\" with font size %s is %s", text, this.ctx.font, width);
      if(width) return width;
    }
    return text.length * fontSize;
  }

  /** 兼容地，根据控制点和半径绘制圆弧路径 */
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number){
    // fix issue #9, 微信中, 如果 radius < 2, arcTo 命令会被忽略
    if(radius < 2){
      return this.ctx.lineTo(x1, y1);
    }

    return this.ctx.arcTo(x1, y1, x2, y2, radius);
  }

  /** 兼容绘制图片 */
  drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number): void
  drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx: number, dy: number, dWidth: number, dHeight: number): void
  
  drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx?: number, dy?: number, dWidth?: number, dHeight?: number){
    // 小程序中绘制
    if(dx && dy && dWidth && dHeight){
      if(this.platform == "mp-baidu"){
        return this.ctx.drawImageWithSrc(imageResource, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeigt);
      }else{
        return this.ctx.drawImageWithSrc(imageResource, sx, sy, sWidth, sHeigt, dx, dy, dWidth, dHeight);
      }
    }else{
      return this.ctx.drawImageWithSrc(imageResource, sx, sy, sWidth, sHeigt);
    }
  }
}
