import { delay } from "../utils/delay";

import { PLATFORM, UniPlatforms } from "../utils/platform";
import { BuiltInPainterElementOption, createElement } from "./painter-element/index";
import { upx2px as defaultUpx2px } from "../utils/upx2px";
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

  /** 支持将 painter 的实例保存在 this 上 */
  toJSON(){ return "Painter Instance" }
}
