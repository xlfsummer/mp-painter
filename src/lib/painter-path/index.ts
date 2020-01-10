import PainterElement from "../painter-element/paint-element";
import { PainterRoundedRectanglePath } from "./rounded-rect";

let PainterPathMap = {
    "rounded-rect": PainterRoundedRectanglePath
}

interface PainterPathMap {
    "rounded-rect": PainterRoundedRectanglePath,
}

export function createPath<k extends keyof PainterPathMap>(
    element: PainterElement,
    option: ConstructorParameters<typeof PainterPathMap[k]>[1]
): PainterPathMap[k] {
    let Ctor = PainterPathMap[option.type]
    if(Ctor) return new (Ctor)(element, option);
    throw new Error("Unkwon option type");
}
