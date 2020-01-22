import { PainterElement } from "../painter-element/base";

export interface PainterPathOption {
    type: string
    left?: number
    top?: number
}

export abstract class PainterPath {

    element: PainterElement
    left: number
    top: number

    constructor(element: PainterElement, option: PainterPathOption){
        this.element = element;
        this.left = option.left ?? 0;
        this.top  = option.top  ?? 0;
    }

    get painter(){
        return this.element.painter;
    }

    get pathX(){
        return this.element.elementX + this.left;
    }
    get pathY(){
        return this.element.elementY + this.top;
    }

    abstract paint(): void;
}
