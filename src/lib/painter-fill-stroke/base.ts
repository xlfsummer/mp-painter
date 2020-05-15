import { PainterLinerGradientOption } from "./liner-gradient";
import { PainterElement } from "../painter-element/base";


export interface PainterGradientPatternOption {
    type: string
}

export type BuiltInPainterGradientPatternOption = PainterLinerGradientOption;

export abstract class PainterGradientPatternStyle {
    element: PainterElement
    constructor(element: PainterElement){
        this.element = element;
    }
    get painter(){
        return this.element.painter;
    }
    abstract get style(): CanvasGradient | CanvasPattern
}