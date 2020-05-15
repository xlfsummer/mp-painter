import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption, BorderRadius, BorderStyle, Color, cssBorderStyleToLinePattern } from "../value";
import { createPath } from "../painter-path/index";
import { BuiltInPainterFillStrokeOption, createFillStrokeStyle } from "../painter-fill-stroke/index";

let debug: import("debug").Debugger;

if(process.env.NODE_ENV == "development"){
  debug =  require("debug")("mp-painter:rect-element:");
}

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
    background: BuiltInPainterFillStrokeOption,

    borderWidth: number,
    borderStyle: BorderStyle,
    borderColor: Color
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
      width:        option.width        ?? 100,
      height:       option.height       ?? 100,
      borderRadius: option.borderRadius ?? 0,
      background:   option.background   ?? "transparent",
      borderStyle:  option.borderStyle  ?? "solid",
      borderWidth:  option.borderWidth  ?? 0,
      borderColor:  option.borderColor  ?? "#000",
    };
    if(process.env.NODE_ENV == "development"){
      debug("constructor:", "option.borderRadius=", this.option.borderRadius);
    }
  }
  _layout(){
    if(process.env.NODE_ENV == "development"){
      debug("layout:", "width=", this.option.width);
      debug("layout:", "height=", this.option.height);
    }
    return {
      width: this.option.width,
      height: this.option.height
    };
  }
  paint(){
    if(!this.shouldFill && !this.shouldStroke) return;

    this.option.borderRadius
      ? this.paintByPath()
      : this.paintByRect();
  }

  private get shouldFill(){
    return this.option.background !== "trasparent";
  }

  private get shouldStroke(){
    return this.option.borderWidth > 0;
  }

  private applyFillStyle(){
    this.painter.setFillStyle(createFillStrokeStyle(this, this.option.background));
  }

  private applyStrokeStyle(){
    this.painter.ctx.setLineDash(cssBorderStyleToLinePattern(this.option.borderStyle, this.option.borderWidth));
    this.painter.ctx.lineWidth = this.painter.upx2px(this.option.borderWidth);
    this.painter.setStrokeStyle(this.option.borderColor);
  }

  private paintByRect(){
    let rectLayoutParam = [
      this.painter.upx2px(this.elementX), 
      this.painter.upx2px(this.elementY),
      this.painter.upx2px(this.option.width), 
      this.painter.upx2px(this.option.height)
    ];;


    if(this.shouldFill){
      this.applyFillStyle();
      this.painter.ctx.fillRect(...rectLayoutParam);
    }

    if(this.shouldStroke){
      this.applyStrokeStyle();
      this.painter.ctx.strokeRect(...rectLayoutParam);
    }
  }

  private paintByPath(){
    createPath(this, {
      type: "rounded-rect",
      height: this.option.height,
      width: this.option.width,
      borderRadius: this.option.borderRadius
    }).paint();

    if(this.shouldFill){
      this.painter.setFillStyle(createFillStrokeStyle(this, this.option.background));
      this.painter.ctx.fill();
    }

    if(this.shouldStroke){
      this.applyStrokeStyle();
      this.painter.ctx.stroke();
    }
  }
}
