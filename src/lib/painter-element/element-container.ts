import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption } from "../value";
import { BuiltInPainterElementOption, createElement } from "./index";

export interface PainterContainerElementOption extends PainterElementOption {
    type: "container"
    /** 子元素的排列方式 */
    direction: "vertical" | "horizontal"
    width: number | "auto"
    height: number | "auto"
    /** 子元素 */
    children: BuiltInPainterElementOption[]
};

export class PainterContainerElement extends PainterElement {
  option: OmitBaseOption<PainterContainerElementOption>
  children: PainterElement[]
  childOffsetTop: number = 0
  childOffsetLeft: number = 0

  constructor(painter: Painter, option: PainterContainerElementOption, parent?: PainterElement){
    super(painter, option, parent);
    this.option = {
      direction:  option.direction??  "vertical",
      width:      option.width    ??  "auto"    ,
      height:     option.height   ??  "auto"    ,
      children:   option.children ??  []
    }

    this.children = this.option.children.map(
      childElementOption => createElement(this.painter, childElementOption, this)
    );
  }
  async _layout(){
    await this.layoutChildren();
    return {
      width: this.calcContainerWidth(),
      height: this.calcContainerHeight()
    };
  }

  private async layoutChildren() {
    for (let child of this.children) await this.layoutChild(child);
  }
  private async layoutChild(childElement: PainterElement){
    await childElement.layout();

    if (childElement.position == "absolute") return;

    if (this.option.direction == "vertical") {
      childElement.offsetTop = this.childOffsetTop;
      this.childOffsetTop += childElement.offsetHeight;
    }
    else /* (direction == "horizontal") */ {
      childElement.offsetLeft = this.childOffsetLeft;
      this.childOffsetLeft += childElement.offsetWidth;
    }
  }
  private calcContainerWidth(){
    if(typeof this.option.width == "number")
      return this.option.width;

    // width == "auto"
    switch (this.option.direction){
      case "vertical":    return this.childrenMaxWidth();
      case "horizontal":  return this.childOffsetLeft;
      default: throw new TypeError("Unknown direction");
    }
  }
  private calcContainerHeight(){
    if(typeof this.option.height == "number")
    return this.option.height;

    // height == "auto"
    switch (this.option.direction){
      case "vertical":    return this.childOffsetTop;
      case "horizontal":  return this.childrenMaxHeight();
      default: throw new TypeError("Unknown direction");
    }
  }

  async paint(){
    for(let child of this.children) await child.paint();
  }
  childrenMaxWidth(){
    return Math.max(...this.children.map(el => el.offsetWidth))
  }
  childrenMaxHeight(){
    return Math.max(...this.children.map(el => el.offsetHeight))
  }
}
