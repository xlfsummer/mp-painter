import { PainterElement } from "../painter-element/base";

export interface PainterPathBaseOption {
    type: string
}

export abstract class PainterBasePath {

    element: PainterElement

    constructor(element: PainterElement){
        this.element = element;
    }

    get painter(){
        return this.element.painter;
    }

    get elementX(){
        return this.element.elementX;
    }
    get elementY(){
        return this.element.elementY
    }

    abstract paint(): void;
}
