import Painter from "../painter";
import {PainterTextElementOption, PainterTextElement} from "./element-text";
import LineSpliterContext from "../line-spliter";
import { PainterElement } from "./base";
import { OmitBaseOption } from "../value";
import { createFillStrokeStyle } from "../painter-fill-stroke/index";
import { removeLineFeed } from "../../utils/string";

export interface PainterTextBlockElementOption extends Omit<PainterTextElementOption, "type"> {
    type: "text-block",
    /** 行高 */
    lineHeight: number
    /** 文本块的最大行数 */
    lineClamp: number
    /** 文本块的宽度 */
    width: number;
    height: number | "auto";
}

export class PainterTextBlockElement extends PainterElement {
    option: OmitBaseOption<Partial<PainterTextBlockElementOption> & Pick<
      PainterTextBlockElementOption,
      "fontSize" | "width" | "height" | "lineClamp" | "content" | "lineHeight" | "top" | "color"
    >>
    lines: string[]
    constructor(painter: Painter, option: PainterTextBlockElementOption, parent?: PainterElement){
      super(painter, option, parent);
      this.option = {
        ...option,
        width:      option.width      ??  100,
        height:     option.height     ??  "auto",
        fontSize:   option.fontSize   ??  30,
        content:    option.content    ??  "",
        lineHeight: option.lineHeight ??  40,
        lineClamp:  option.lineClamp  ??  0,
        color:      option.color      ??  "black"
      }
      this.lines = [];

      /** 不支持换行，应去掉换行符，否则会导致 iPhone 微信小程序中测量文本宽度错误，断行位置错误 */
      this.option.content = removeLineFeed(this.option.content);
    }
    _layout(){
      this.lines = new LineSpliterContext({
        fontSize: this.option.fontSize,
        lineClamp: this.option.lineClamp,
        width:   this.option.width,
        painter: this.painter,
        content: this.option.content
      }).split();

      return {
        width: this.option.width,
        height: this.option.height == "auto"
          ? (this.lines.length - 1) * this.option.lineHeight + this.option.fontSize
          : this.option.height
      };
    }
    async paint(){
      // 这里给文本块统一设置填充，而不是每行文字单独地设置
      // 如果单独设置，则计算渐变填充坐标时会相对于每一行的文本来计算
      this.painter.ctx.setFillStyle(createFillStrokeStyle(this, this.option.color));

      this.lines.map((line, row) => {

        const option = {
          ...this.option,
          type: "text",
          top: this.elementY + row * this.option.lineHeight,
          left: this.elementX,
          position: this.position,
          content: line
        } as PainterTextElementOption
        
        return new PainterTextElement(this.painter, option);

      }).forEach(text => text.paint({ inTextBlock: true }));
    }
  }
