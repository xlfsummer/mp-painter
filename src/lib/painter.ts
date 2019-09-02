import { promiseQueue } from "../utils/promiseQueue";
import { delay } from "../utils/delay";

type UniPlatforms =  "mp-weixin" | "mp-alipay" | "mp-baidu";

interface IPanterOption {
  upx2px: (upx: number) => number
  platform?: UniPlatforms
}

interface CanvasBaseObj {
  type: string
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

type fontWeight = "normal" | "bold";
type baseline = "top" | "middle" | "bottom" | "normal";
type align = "left" | "right" | "center";

interface CanvasImage extends CanvasBaseObj{
  type: "image";
  src: string;
  width: number;
  height: number;
  // objectFit: "fill" | "contain" | "cover" | "scale-down" | "none";
}

interface CanvasText extends CanvasBaseObj {
  type: "text";
  color: string
  fontSize: number;
  fontWeight: fontWeight;
  fontFamily: string;
  baseline: baseline;
  align: align;
  content: string;
  width?: number;
}

interface CanvasTextBlock extends CanvasBaseObj {
  type: "text-block",

  color: string,
  fontSize: number
  fontWeight: fontWeight
  fontFamily: string
  lineHeight: number
  lineClamp: number
  baseline: baseline
  align: align
  
  width: number;
  height: number | "auto";

  content: string;
}

interface CanvasLine extends CanvasBaseObj {
  type: "line"
  dx: number
  dy: number
  color: string
  lineWidth: number
  dashPattern: number[],
  pixelFix: boolean
}

interface CanvasRect extends CanvasBaseObj {
  type: "rect",
  width: number,
  height: number,
  background: string
}

interface CanvasContainer extends CanvasBaseObj {
  type: "container"
  direction?: "vertical" | "horizontal"
  width: number | "auto"
  height: number | "auto"
  children: CanvasObj[]
};

type CanvasObj = CanvasText | CanvasTextBlock | CanvasImage | CanvasLine | CanvasContainer | CanvasRect;

interface ISize {
  width: number,
  height: number
}

interface DrawMethod {
  (
    /** 要绘制的对象 */
    paintObj: any,
  ): Promise<ISize>
}


// 开启会导致支付宝小程序报错
const debug = (...v: any[]) => void 0; //console.log(...v);

let lineSplitCache: Record<string, string[]> = {};

export default class Painter {

  ctx: CanvasContext;
  upx2px: (upx: number) => number
  platform: UniPlatforms

  constructor(ctx: CanvasContext, option: IPanterOption){
    this.ctx = ctx;
    this.upx2px = option.upx2px;
    this.platform = option.platform || "mp-weixin";
  }

  draw(paintObj: CanvasObj){
    return this._drawObj(paintObj)
      .then(size => {
        debug("call context draw method");
        return new Promise(resolve => {
          this.ctx.draw(true, () => {
            debug("context draw method done");
            resolve();
          })
        })
        // 在 draw 的 callback 中, canvas 还没有真正绘制完成，此时 resolve 会导致文字错乱
        .then(() => delay(100))
        .then(() => size)
    });
  }

  async _drawObj<T extends CanvasObj>(paintObj: T){
    let drawMethod: ((canvasObj: any) => Promise<ISize>) = {
      "text": this._drawText,
      "image": this._drawImage,
      "text-block": this._drawTextBlock,
      "line": this._drawLine,
      "rect": this._drawRect,
      "container": this._drawContainer
    }[paintObj.type];

    if(!drawMethod){
      throw new TypeError("Unkown paint obj type: " + paintObj.type);
    }
    
    return await drawMethod.call(this, paintObj);
  }

  async _drawText(text: CanvasText){
      debug("绘制文本")
  
      let {
        color = "#000",
        align = "left",
        fontWeight = "normal",
        fontFamily = "serial",
        fontSize = 30,
        baseline = "top",
        content = "",
        left = 0,
        top = 0,
        width = null,
      } = text;
  
      if(content === null) content = "";
  
      left = this.upx2px(left);
      top = this.upx2px(top);
  
      this.ctx.font = [
        ...(fontWeight == "normal" ? [] : [fontWeight]),
        this.upx2px(fontSize) + "px",
        fontFamily
      ].join(" ");
  
      this.setFillStyle(color);
      this.ctx.setFontSize(this.upx2px(fontSize));
      this.ctx.setTextBaseline(baseline);
      this.ctx.setTextAlign(align);
      this.ctx.fillText(content, left, top);

      
      let textWidth = width || this.measureText(content, fontSize);
      
      return {
        width: textWidth,
        height: fontSize,
      };
  }
  
  async _drawImage(image: CanvasImage){
    debug("绘制图片")

    let {
      left,
      top,
      width,
      height
    } = image;

    this.ctx.drawImage(
      image.src,
      this.upx2px(left),
      this.upx2px(top),
      this.upx2px(width),
      this.upx2px(height),
    )

    return {
      width,
      height
    };
  }

  async _drawTextBlock(textblock: CanvasTextBlock){
    debug("绘制文本块");

    let {
      width = 100,
      fontSize = 30,
      content = "",
      lineHeight = 40,
      lineClamp = 0
    } = textblock;

    if(content === null) content = "";

    let cacheKey = JSON.stringify({fontSize, lineClamp, width, content});
    if(!lineSplitCache[cacheKey]){
      lineSplitCache[cacheKey] = new LineSpliterContext({
        fontSize, lineClamp, width,
        ctx: this.ctx,
        content
      }).split();
    }

    let lines = lineSplitCache[cacheKey];

    await promiseQueue(
      lines.map((line, row) => () => this._drawText({
          ...textblock,
          type: "text",
          top: textblock.top + row * lineHeight,
          content: line
        }))
    );

    return {
      width: width,
      height: (lines.length - 1 ) * lineHeight + fontSize
    };
  }

  async _drawLine(line: CanvasLine){
    debug("绘制直线")

    let {
      left,
      top,
      dx = 0,
      dy = 0,
      dashPattern = [1],
      pixelFix = false,
      lineWidth = 1
    } = line;

    let x1 = this.upx2px(left);
    let y1 = this.upx2px(top);
    let x2 = this.upx2px(left + dx);
    let y2 = this.upx2px(top + dy);

    let color = line.color;
    
    dashPattern = dashPattern.map(n => this.upx2px(n));

    if(pixelFix){
      let fix = (d: number) => Math.floor(d) + 0.5;
      [x1, y1, x2, y2] = [x1, y1, x2, y2].map(fix);
    }

    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.setLineDash(dashPattern);
    this.setStrokeStyle(color);
    this.ctx.lineWidth = this.upx2px(lineWidth);
    this.ctx.stroke()

    return {
      width: dx,
      height: dy
    };
  }

  async _drawRect(rect: CanvasRect){
    debug("绘制矩形");
    this.setFillStyle(rect.background);
    this.ctx.fillRect(
      this.upx2px(rect.left), 
      this.upx2px(rect.top), 
      this.upx2px(rect.width), 
      this.upx2px(rect.height)
    );
    return { width: rect.width, height: rect.height };
  }

  async _drawContainer(container: CanvasContainer){1
    debug("绘制容器")
    let {
      direction,
      children,
      left = 0,
      top = 0,
      height = "auto",
      width = "auto",
    } = container;

    let offsetLeft = left;
    let offsetTop = top;
    let isAutoHeight = height == "auto";
    let isAutoWidth = width == "auto";

    let childrenMaxWidth = 0;
    let childrenMaxHeight = 0;

    direction = direction || "vertical"
    children = children || [];

    let drawChild = (child: CanvasObj) => {

      setChildPositionOffset(child);

      return this._drawObj(child)
        .then(size => {
          let {
            width: childContentWidth,
            height: childContentHeight,
          } = size;

          if(child.position == "absolute") return;

          if(direction == "vertical"){
            offsetTop += childContentHeight;
            childrenMaxWidth = Math.max(childrenMaxWidth, child.left - left + childContentWidth);  
          }else
          if(direction == "horizontal"){
            offsetLeft += childContentWidth;
            childrenMaxHeight = Math.max(childrenMaxHeight, child.top - top + childContentHeight);
          }
        });
    }

    function setChildPositionOffset(child: CanvasObj){

      let position = child.position = child.position || "static";

      if(position == "static"){
        if(direction == "vertical"){
          offsetTop += child.top || 0;
          child.top = offsetTop;
          child.left = left + (child.left || 0);
        } else
        if(direction == "horizontal"){
          offsetLeft += child.left || 0;
          child.left = offsetLeft;
          child.top = top + (child.top || 0)
        }
      } else if(position == "absolute"){
        child.top = top + (child.top || 0)
        child.left = left + (child.left || 0)
      }
    }

    await promiseQueue(children.map(child => () => drawChild(child)));
    let containerWidth, containerHeight;

    if(direction == "vertical"){
      containerWidth = (isAutoWidth ? childrenMaxWidth : width) as number;
      containerHeight = (isAutoHeight ? offsetTop - top : height) as number;
    } else /* (direction == "horizontal") */ {
      containerWidth = (isAutoWidth ? offsetLeft - left : width) as number;
      containerHeight = (isAutoHeight ? childrenMaxHeight : height) as number;
    }
    
    return {
      width: containerWidth,
      height: containerHeight
    };
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
