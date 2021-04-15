import { ColorStop } from "../value";
import { PainterGradientPatternOption, PainterGradientPatternStyle } from "./base";
import { PainterElement } from "../painter-element/base";

export interface PainterLinearGradientOption extends PainterGradientPatternOption{
    type: "linear-gradient"
    colorStops: ColorStop[],
    x1: number
    y1: number
    x2: number
    y2: number
}

export class PainterLinearGradientStyle extends PainterGradientPatternStyle {
    option: PainterLinearGradientOption
    constructor(element: PainterElement, option: PainterLinearGradientOption){
        super(element);
        this.option = option
    }
    get style(){
        const { ctx, upx2px } = this.painter;
        const { x1, x2, y1, y2 } = this.option;

        const gradient = ctx.createLinearGradient(
            upx2px(this.element.elementX + x1),
            upx2px(this.element.elementY + y1),
            upx2px(this.element.elementX + x2),
            upx2px(this.element.elementY + y2)
        );

        this.option.colorStops.forEach(stop => {
            gradient.addColorStop(stop.offset, stop.color);
        });

        return gradient;
    }
}