import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterElementOption, createElement } from "./index";

export interface PainterTransformElementOption extends PainterElementOption {
    type: "transform",
    /** 变换的内容 */
    content: BuiltInPainterElementOption
    /** 变换的选项 */
    transform: BuiltInPainterTransformOption[]
    /** 变换的原点、默认为元素的中心 */
    transformOrigin: PaitnerTransformOriginOption
}

type BuiltInPainterTransformOption = 
    PainterTransformTranslateOption |
    PainterTransformRotateOption    |
    PainterTransformScaleOption     |
    PainterTransformMatrixOption    ;

interface PainterTransformTranslateOption {
    type: "translate",
    x?: number,
    y?: number
}

interface PainterTransformRotateOption {
    type: "rotate",
    /** degree */
    rotate: number
}

interface PainterTransformScaleOption {
    type: "scale",
    scaleWidth?: number,
    scaleHeight?: number
}

interface PainterTransformMatrixOption {
    type: "set-matrix",
    translateX: number, translateY: number
    scaleX: number,     scaleY: number,
    skewX: number,      skewY: number,
}

type PaitnerTransformOriginOption = [
    PaitnerTransformOriginHorizontalOption,
    PaitnerTransformOriginVerticalOption
];
type PaitnerTransformOriginHorizontalOption = "left" | "center" | "right";
type PaitnerTransformOriginVerticalOption = "top" | "center" | "bottom";

/**
 * - fixme: Cascade transform not supported yet. 
 * Cause when we set tansform origin in `withTransformOrigin`,
 * We don't know the transform state of outer element. 
 */
export class PainterTransformElement extends PainterElement {

    transformOrigin:   PaitnerTransformOriginOption
    transformOptions:  BuiltInPainterTransformOption[]
    contentElement:    PainterElement

    constructor(painter: Painter, option: PainterTransformElementOption, parent?: PainterElement){
        super(painter, option, parent);
        this.contentElement = createElement(painter, option.content, this);
        this.transformOptions = option.transform ?? []
        this.transformOrigin = option.transformOrigin ?? ["center", "center"]
    }

    _layout(){
        return this.contentElement.layout();
    }

    async paint(){
        this.painter.ctx.save();
        this.withTransformOrigin(
            () => this.transform()
        );
        await this.contentElement.paint();
        this.painter.ctx.restore();
    }

    private transform(){
        this.transformOptions.forEach(option => this.singleTransform(option));
    }

    private singleTransform(option: BuiltInPainterTransformOption): void{
        switch(option.type){
            case "translate" : return this.painter.ctx.translate(
                this.painter.upx2px(option.x ?? 0), 
                this.painter.upx2px(option.y ?? 0)
            );

            case "rotate"    : return this.painter.ctx.rotate(
                option.rotate / 180 * Math.PI
            );
            
            case "scale"     : return this.painter.ctx.scale(
                option.scaleWidth  ?? 1,
                option.scaleHeight ?? 1
            );

            case "set-matrix": return this.painter.ctx.setTransform(
                option.scaleX,
                option.skewX,
                option.skewY,
                option.scaleY,
                this.painter.upx2px(option.translateX),
                this.painter.upx2px(option.translateY)
            );
            default:           throw  new Error("Unknown transform type.");
        }
    }

    private withTransformOrigin(cb: Function){
        const verticalKeywordScaleMap: Record<PaitnerTransformOriginVerticalOption, number> = {
            "top":     0,
            "center": .5,
            "bottom":  1            
        };
        const horizontalKeywordScaleMap: Record<PaitnerTransformOriginHorizontalOption, number> = {
            "left": 0,
            "center": .5,
            "right": 1
        };
        const transformOriginOffset = {
            x: this.elementX + this.contentWidth  * horizontalKeywordScaleMap[this.transformOrigin[0]],
            y: this.elementY + this.contentHeight * verticalKeywordScaleMap  [this.transformOrigin[1]],
        };

        this.singleTransform({
            type: "translate",
            x: transformOriginOffset.x,
            y: transformOriginOffset.y
        });

        cb();

        this.singleTransform({
            type: "translate",
            x: -transformOriginOffset.x,
            y: -transformOriginOffset.y
        });
    }
}
