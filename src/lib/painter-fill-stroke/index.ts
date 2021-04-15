import { Color } from "../value";
import { PainterLinearGradientOption, PainterLinearGradientStyle } from "./linear-gradient";
import { PainterElement } from "../painter-element/base";

export type BuiltInPainterFillStrokeOption = Color | PainterLinearGradientOption;

export function createFillStrokeStyle(
    element: PainterElement,
    option: BuiltInPainterFillStrokeOption
){
    // color string
    if(typeof option == "string") return option;
    
    switch(option.type){
        case "linear-gradient": return new PainterLinearGradientStyle(element, option).style;
        default:                throw new Error("Unkwon option type");
    }
}