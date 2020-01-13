import PainterElement from "../painter-element/paint-element";
import { PainterRoundedRectanglePath, PainterRoundedRectanglePathOption } from "./rounded-rect";

type PainterPathOption = PainterRoundedRectanglePathOption;

export function createPath (
    element: PainterElement,
    option: PainterPathOption
){
    switch(option.type){
        case "rounded-rect":  return new PainterRoundedRectanglePath(element, option);
        default:              throw new Error("Unkwon option type");
    }
}
