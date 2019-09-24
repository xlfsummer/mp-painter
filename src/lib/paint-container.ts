import Painter, {PaintBaseOption, CanvasObj} from "./painter";
import { promiseQueue } from "../utils/promiseQueue";

export interface CanvasContainer extends PaintBaseOption {
    type: "container"
    direction?: "vertical" | "horizontal"
    width: number | "auto"
    height: number | "auto"
    children: CanvasObj[]
};

export default async function _drawContainer(this: Painter, container: CanvasContainer){
    // this.debug("绘制容器")
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