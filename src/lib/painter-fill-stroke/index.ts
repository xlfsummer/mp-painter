import { Color } from "../value";
import { PainterLinerGradientOption, PainterLinerGradientStyle } from "./liner-gradient";
import { PainterElement } from "../painter-element/base";

export type BuiltInPainterFillStrokeOption = Color | PainterLinerGradientOption;

export function createFillStrokeStyle(
    element: PainterElement,
    option: BuiltInPainterFillStrokeOption
){
    // color string
    if(typeof option == "string") return option;
    
    switch(option.type){
        case "liner-gradient": return new PainterLinerGradientStyle(element, option).style;
        default:               throw new Error("Unkwon option type");
    }
}