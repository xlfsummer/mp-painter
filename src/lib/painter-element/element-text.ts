import Painter from "../painter";
import { FontWeight, BaseLine, TextAlign, OmitBaseOption, FontStyle, TextDecoration } from "../value";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterFillStrokeOption, createFillStrokeStyle } from "../painter-fill-stroke/index";
import { PainterLineElement } from "./element-line";

export interface PainterTextElementOption extends PainterElementOption {
    type: "text";
    /** 文字的颜色 */
    color: BuiltInPainterFillStrokeOption
    /** 文字的字号 */
    fontSize: number;
    /** 文字的字重 */
    fontWeight: FontWeight;
    /** 文字的字型 */
    fontStyle: FontStyle;
    /** 文字的字体 */
    fontFamily: string;
    /** 锚点在垂直方向相对文字的位置 */
    baseline: BaseLine;
    /** 锚点在水平方向相对文字的位置 */
    align: TextAlign;
    /** 文本内容 */
    content: string;
    /** 文字的宽度，为空则根据文本内容及字号自动计算宽度 */
    width?: number;
    textDecoration: TextDecoration;
}

export class PainterTextElement extends PainterElement {
  option: OmitBaseOption<PainterTextElementOption>
  constructor(painter: Painter, option: PainterTextElementOption, parent?: PainterElement){
    super(painter, option, parent);
    this.option = {
      color:      option.color      ??  "#000"  ,
      align:      option.align      ??  "left"  ,
      fontWeight: option.fontWeight ??  "normal",
      fontStyle:  option.fontStyle  ??  "normal",
      fontFamily: option.fontFamily ??  "serial",
      fontSize:   option.fontSize   ??  30      ,
      baseline:   option.baseline   ??  "top"   ,
      content:    option.content    ??  ""      ,
      width:      option.width      ??  void 0  ,
      textDecoration: option.textDecoration ?? "none"
    }
  }
  _layout(){
    let textWidth = this.option.width ?? this.painter.measureText(this.option.content, this.option.fontSize);
    return {
      width: textWidth,
      height: this.option.fontSize
    }
  }
  paint({ inTextBlock = false } = {}){

    this.painter.ctx.font = [
      this.option.fontWeight  != "normal" && this.option.fontWeight,
      this.option.fontStyle   != "normal" && this.option.fontStyle,
      this.painter.upx2px(this.option.fontSize) + "px",
      this.option.fontFamily
    ].filter(Boolean).join(" ");

    if(inTextBlock){
      // 不重设文字的颜色，多行文本统一设置渐变填充
    } else {
      this.painter.setFillStyle(createFillStrokeStyle(this, this.option.color));
    }
    
    this.painter.ctx.setFontSize(this.painter.upx2px(this.option.fontSize));
    this.painter.ctx.setTextBaseline(this.option.baseline);
    this.painter.ctx.setTextAlign(this.option.align);
    this.painter.ctx.fillText(
      this.option.content,
      this.painter.upx2px(this.elementX),
      this.painter.upx2px(this.elementY)
    );

    this.paintTextDecoration();
  }
  private paintTextDecoration(){
    if(this.option.textDecoration == "line-through"){
      new PainterLineElement(this.painter, {
        // 0.4 的位置刚好和 css 里 line-through 的效果差不多
        top: this.elementY + this.option.fontSize * .4,
        left: this.elementX,
        dx: this.contentWidth,
        dy: 0,
        color: this.option.color,
      }).paint();
    }
  }
}
