import { promiseQueue } from "../utils/promiseQueue";
import { delay } from "../utils/delay";

// 开启会导致支付宝小程序报错
const debug = (...v) => void 0; //console.log(...v);

let lineSplitCache = {};

export default class Painter {

    ctx: CanvasContext;

    upx2px: (upx: number) => number

    constructor(ctx, option){
      /** @type {CanvasContext} */
      this.ctx = ctx;
  
      // #ifdef MP-ALIPAY
      // @ts-ignore
      this.upx2px = length => uni.upx2px(length) * 2;
      // #endif
  
      // #ifndef MP-ALIPAY
      this.upx2px = uni.upx2px;
      // #endif

      this.upx2px = option.upx2px;
  
    }
  
    /** @param {CanvasObj} paintObj */
    draw(paintObj){
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
  
    _drawObj(paintObj){
  
      /** @type {{[type: keyof CanvasObjTypeMap]: CanvasObjTypeMap}} */
      let drawMethod = {
        "text": this._drawText,
        "image": this._drawImage,
        "text-block": this._drawTextBlock,
        "line": this._drawLine,
        "container": this._drawContainer
      }[paintObj.type];
  
      if(!drawMethod){
        throw new TypeError("Unkown paint obj type: " + paintObj.type);
      }
      
      return drawMethod.call(this, paintObj);
    }
  
    /** @param {CanvasText} text */
    _drawText(text){
      return new Promise((resolve, reject)=>{
        debug("绘制文本")
    
        let {
          color = "#000",
          align = "left",
          fontWeight = "normal",
          fontFamily = "serial",
          fontSize = 20,
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
    
        this.ctx.fillStyle = color;
        this.ctx.setFontSize(this.upx2px(fontSize));
        this.ctx.setTextBaseline(baseline);
        this.ctx.setTextAlign(align);
        this.ctx.fillText(content, left, top);
  
        
        let textWidth = width 
          ? width : (
            this.ctx.setFontSize(fontSize),
            this.ctx.measureText(content).width
          );
        
        resolve({
          width: textWidth,
          height: fontSize,
        });
      });
    }
    
    /** @param {CanvasImage} image */
    _drawImage(image){
      return new Promise((resolve)=>{
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
    
        return resolve({
          width,
          height
        })
      });
    }
  
    /** @param {CanvasTextBlock} textblock */
    _drawTextBlock(textblock){
      debug("绘制文本块")
      return new Promise((resolve, reject)=>{
        let {
          width = 100,
          fontSize = 20,
          content = "",
          lineHeight = 20,
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
  
        promiseQueue(
          lines.map((line, row) => () => this._drawText({
              ...textblock,
              top: textblock.top + row * lineHeight,
              content: line
            }))
        ).then(() => {
          return resolve({
            width: width,
            height: (lines.length - 1 ) * lineHeight + fontSize
          });
        });
      });
    }
  
    /** @param {CanvasLine} line */
    _drawLine(line){
      return new Promise((resolve, reject)=>{
  
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
          let fix = d => Math.floor(d) + 0.5;
          [x1, y1, x2, y2] = [x1, y1, x2, y2].map(fix);
        }
    
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.setLineDash(dashPattern);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.upx2px(lineWidth);
        this.ctx.stroke()
    
        return resolve({
          width: dx,
          height: dy
        });
      });
    }
  
    /** @param {CanvasContainer} container*/
    _drawContainer(container){
      return new Promise((resolve, reject)=>{
  
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
    
        let drawChild = child => {
  
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
  
        /** @param {CanvasObj} child */
        function setChildPositionOffset(child){
    
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
  
        promiseQueue(children.map(child => () => drawChild(child)))
          .then(()=>{
            let containerWidth, containerHeight;
        
            if(direction == "vertical"){
              containerWidth = isAutoWidth ? childrenMaxWidth : width;
              containerHeight = isAutoHeight ? offsetTop - top : height;
            } else
            if(direction == "horizontal"){
              containerWidth = isAutoWidth ? offsetLeft - left : width;
              containerHeight = isAutoHeight ? childrenMaxHeight : height;
            }
            
            return resolve({
              width: containerWidth,
              height: containerHeight
            });
          })
      })
    }
  }