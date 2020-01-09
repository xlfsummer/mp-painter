import Painter, { PainterElementBaseOption } from "../painter";
import PainterElement from "./paint-element";
import { OmitBaseOption, BorderRadius } from "../value";
import { debug as createDebug } from "debug";

let debug = createDebug("mp-painter:rect-element:");
debug.enabled = true;

export interface PainterRectagleElementOption extends PainterElementBaseOption {
    type: "rect",
    width: number,
    height: number,
    borderRadius: BorderRadius,
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
    if(this.isRoundCorner){
      this.assertBorderRadius();
    }
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
    debug("paint:", "isRoundCorner=", this.isRoundCorner);
    this.isRoundCorner
      ? this.paintByPath()
      : this.paintByFillRect();
  }

  private get isRoundCorner(){
    return this.normalizedBorderRadius.some(radius => radius != 0);
  }

  private assertBorderRadius(){
    if(this.normalizedBorderRadius.some(radius => radius < 0)){
      console.warn("border radius must greater than 0, got:", this.normalizedBorderRadius.join(","));
      this.option.borderRadius = 0;
    }
  }

  private get normalizedBorderRadius(): [number, number, number, number]{
    if(typeof this.option.borderRadius == "number"){
      return Array.from({ length: 4 }).fill(this.option.borderRadius) as [number, number, number, number];
    } else {
      return [...this.option.borderRadius] as [number, number, number, number];
    }
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
    this.reduceBorderRadius();
    this.painter.setFillStyle(this.option.background);

    let [leftTopRadius, rightTopRadius, rightBottomRaidus, leftBottomRadius] = this.normalizedBorderRadius;
    let { ctx, upx2px } = this.painter;

    ctx.beginPath();

    ctx.moveTo(
      upx2px(this.elementX),
      upx2px(this.elementY + leftTopRadius)
    );

    // left top
    ctx.arcTo(
      upx2px(this.elementX),
      upx2px(this.elementY),
      upx2px(this.elementX + leftTopRadius),
      upx2px(this.elementY),
      upx2px(leftTopRadius)
    );

    // right top
    ctx.arcTo(
      upx2px(this.elementX + this.option.width),
      upx2px(this.elementY),
      upx2px(this.elementX + this.option.width),
      upx2px(this.elementY + rightTopRadius),
      upx2px(rightTopRadius)
    );

    // right bottom
    ctx.arcTo(
      upx2px(this.elementX + this.option.width),
      upx2px(this.elementY + this.option.height),
      upx2px(this.elementX + this.option.width - rightBottomRaidus),
      upx2px(this.elementY + this.option.height),
      upx2px(rightBottomRaidus)
    );

    // left bottom
    ctx.arcTo(
      upx2px(this.elementX),
      upx2px(this.elementY + this.option.height),
      upx2px(this.elementX),
      upx2px(this.elementY + this.option.height - leftBottomRadius),
      upx2px(leftBottomRadius)
    )
    
    ctx.closePath();
    ctx.fill();
  }
  
  /**
   * @see https://www.w3.org/TR/css-backgrounds-3/#corner-overlap
   * Corner curves must not overlap: When the sum of any two adjacent border
   * radii exceeds the size of the border box, UAs must proportionally reduce
   * the used values of all border radii until none of them overlap.
  */
  private reduceBorderRadius(){
    let [leftTopRadius, rightTopRadius, rightBottomRaidus, leftBottomRadius] = this.normalizedBorderRadius;
    let f = Math.min(
      // top
      this.contentWidth / (leftTopRadius + rightTopRadius),
      // right
      this.contentHeight / (rightTopRadius + rightBottomRaidus),
      // bottom
      this.contentWidth / (leftBottomRadius + rightBottomRaidus),
      // left
      this.contentHeight / (leftTopRadius + leftBottomRadius)
    );

    debug("reduceBorderRadius:", "f=", f);

    if(f >= 1) return;

    this.option.borderRadius = this.normalizedBorderRadius.map(radius => radius * f) as [number, number, number, number];
  }
}

