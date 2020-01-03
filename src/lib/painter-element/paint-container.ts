import Painter, { PainterElementBaseOption, PainterElementOption } from "../painter";
import PainterElement from "./paint-element";

export interface PainterContainerElementOption extends PainterElementBaseOption {
    type: "container"
    direction?: "vertical" | "horizontal"
    width: number | "auto"
    height: number | "auto"
    children: PainterElementOption[]
};

export class PainterContainerElement extends PainterElement {
  option: PainterContainerElementOption
  children: PainterElement[]
  offsetX: number = 0
  offsetY: number = 0
  childrenMaxWidth: number = 0
  childrenMaxHeight: number = 0
  constructor(painter: Painter, option: PainterContainerElementOption){
    super(painter, option);
    this.option = {
      type:     "container",
      position:   option.position ??  "static"  ,
      left:       option.left     ??  0         ,
      top:        option.top      ??  0         ,
      direction:  option.direction??  "vertical",
      width:      option.width    ??  "auto"    ,
      height:     option.height   ??  "auto"    ,
      children:   option.children ??  []
    }
    this.children = [];
  }
  async layout(){
    let { direction, children, left, top, height, width, } = this.option;

    let offsetLeft = left;
    let offsetTop = top;
    let isAutoHeight = height == "auto";
    let isAutoWidth = width == "auto";

    let drawChild = async (child: PainterElementOption) => {

      setChildPositionOffset(child);

      let childElement = this.painter.createElement(child);
      this.children.push(childElement);

      let size = await childElement.layout()

      let {
        width: childContentWidth,
        height: childContentHeight,
      } = size;

      if(child.position == "absolute") return;

      if(direction == "vertical"){
        offsetTop += childContentHeight;
        this.childrenMaxWidth = Math.max(this.childrenMaxWidth, child.left - left + childContentWidth);  
      }else
      if(direction == "horizontal"){
        offsetLeft += childContentWidth;
        this.childrenMaxHeight = Math.max(this.childrenMaxHeight, child.top - top + childContentHeight);
      }
    }

    function setChildPositionOffset(child: PainterElementBaseOption){

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

    for(let child of children) await drawChild(child);

    let containerWidth, containerHeight;

    if(direction == "vertical"){
      containerWidth = (isAutoWidth ? this.childrenMaxWidth : width) as number;
      containerHeight = (isAutoHeight ? offsetTop - top : height) as number;
    } else /* (direction == "horizontal") */ {
      containerWidth = (isAutoWidth ? offsetLeft - left : width) as number;
      containerHeight = (isAutoHeight ? this.childrenMaxHeight : height) as number;
    }
    
    return {
      width: containerWidth,
      height: containerHeight
    };
  }
  paint(){
    this.children.forEach(e => e.paint());
  }
}
