import { PainterTextElementOption, PainterTextElement } from "./element-text";
import { PainterTextBlockElementOption, PainterTextBlockElement } from "./element-text-block";
import { PainterImageElementOption, PainterImageElement } from "./element-image";
import { PainterLineElementOption, PainterLineElement } from "./element-line";
import { PainterRectagleElementOption, PainterRectagleElement } from "./element-rect";
import { PainterContainerElementOption, PainterContainerElement } from "./element-container";
import { PainterClipElementOption, PainterClipElement } from "./element-clip";
import { PainterTransformElementOption, PainterTransformElement } from "./element-transform";

import Painter from "../painter";
import { PainterElement } from "./base";

export type BuiltInPainterElementOption =
  PainterTextElementOption |
  PainterTextBlockElementOption |
  PainterImageElementOption |
  PainterLineElementOption |
  PainterRectagleElementOption |
  PainterContainerElementOption |
  PainterClipElementOption |
  PainterTransformElementOption;

export function createElement(
    painter: Painter,
    option: BuiltInPainterElementOption,
    parent?: PainterElement
){
    switch(option.type){
        case "text":        return new PainterTextElement      (painter, option, parent);
        case "text-block":  return new PainterTextBlockElement (painter, option, parent);
        case "image":       return new PainterImageElement     (painter, option, parent);
        case "line":        return new PainterLineElement      (painter, option, parent);
        case "rect":        return new PainterRectagleElement  (painter, option, parent);
        case "container":   return new PainterContainerElement (painter, option, parent);
        case "clip":        return new PainterClipElement      (painter, option, parent);
        case "transform":   return new PainterTransformElement (painter, option, parent);
        default: throw new TypeError("Unkown painter element type");
    }
}
