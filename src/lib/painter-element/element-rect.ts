import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption, BorderRadius } from "../value";
import { debug as createDebug } from "debug";
import { createPath } from "../painter-path";

let debug = createDebug("mp-painter:rect-element:");
// debug.enabled = true;

export interface PainterRectagleElementOption extends PainterElementOption {
    type: "rect",
    width: number,
    height: number,
    /** 
     * 圆角
     * 
     * - `number` 一个数字，四个角的圆角都使用设置的值
     * - `[number, number, number, number]` 四个数字的元组分别代表 **左上**、**右上**、**右下** 和 **左下** 的圆角值。
     */
    borderRadius: BorderRadius,
    /**
     * 背景颜色
     */
    background: string
}

export class PainterRectagleElement extends PainterElement {
  option: OmitBaseOption<PainterRectagleElementOption>;
  constructor(
    painter: Painter, 
    option: PainterRectagleElementOption,
    parent?: PainterElement
  ){
    super(painter, option, parent);
    this.option = {
      width:        option.width        ??    100,
      height:       option.height       ??    100,
      borderRadius: option.borderRadius ??      0,
      background:   option.background   ?? "#000"
    };
    debug("constructor:", "option.borderRadius=", this.option.borderRadius);
  }
  _layout(){
    debug("layout:", "width=", this.option.width);
    debug("layout:", "height=", this.option.height);
    return {
      width: this.option.width,
      height: this.option.height
    };
  }
  paint(){
    this.option.borderRadius
      ? this.paintByPath()
      : this.paintByFillRect();
  }

  private paintByFillRect(){
    this.painter.setFillStyle(this.option.background);
    this.painter.ctx.fillRect(
      this.painter.upx2px(this.elementX), 
      this.painter.upx2px(this.elementY),
      this.painter.upx2px(this.option.width), 
      this.painter.upx2px(this.option.height)
    );
  }

  private paintByPath(){

    createPath(this, {
      type: "rounded-rect",
      height: this.option.height,
      width: this.option.width,
      borderRadius: this.option.borderRadius
    }).paint();

    this.painter.setFillStyle(this.option.background);
    this.painter.ctx.fill();
  }
}
