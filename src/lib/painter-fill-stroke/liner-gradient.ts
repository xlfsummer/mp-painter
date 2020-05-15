import { ColorStop } from "../value";
import { PainterGradientPatternOption, PainterGradientPatternStyle } from "./base";
import { PainterElement } from "../painter-element/base";

export interface PainterLinerGradientOption extends PainterGradientPatternOption{
    type: "liner-gradient"
    colorStops: ColorStop[],
    x1: number
    y1: number
    x2: number
    y2: number
}

export class PainterLinerGradientStyle extends PainterGradientPatternStyle {
    option: PainterLinerGradientOption
    constructor(element: PainterElement, option: PainterLinerGradientOption){
        super(element);
        this.option = option
    }
    get style(){
        const { ctx, upx2px } = this.painter;
        const { x1, x2, y1, y2 } = this.option;

        // 这里 uniapp 里声明的的类型错了，不应返回 CanvasContext 类型
        const gradient = ctx.createLinearGradient(
            upx2px(this.element.elementX + x1),
            upx2px(this.element.elementY + y1),
            upx2px(this.element.elementX + x2),
            // @ts-ignore 这里 uniapp 里声明的的类型错了
            upx2px(this.element.elementY + y2)
        );

        this.option.colorStops.forEach(stop => {
            gradient.addColorStop(stop.offset, stop.color);
        });

        return gradient as CanvasGradient;
    }
}