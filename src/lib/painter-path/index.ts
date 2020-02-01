import { PainterElement } from "../painter-element/base";
import { PainterRoundedRectanglePath, PainterRoundedRectanglePathOption } from "./path-rounded-rect";

export type BuiltInPainterPathOption = PainterRoundedRectanglePathOption;

export function createPath (
    element: PainterElement,
    option: BuiltInPainterPathOption
) {
    switch(option.type){
        case "rounded-rect":  return new PainterRoundedRectanglePath(element, option);
        default:              throw new Error("Unkwon option type");
    }
}
