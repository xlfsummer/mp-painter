import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterElementOption, createElement } from "./index";

export interface PainterTransformElementOption extends PainterElementOption {
    type: "transform",
    content: BuiltInPainterElementOption
    transform: BuiltInPainterTransformOption[]
    transformOrigin: PaitnerTransformOriginOption
}

type BuiltInPainterTransformOption = 
    PainterTransformTranslateOption |
    PainterTransformRotateOption    |
    PainterTransformScaleOption     |
    PainterTransformMatrixOption    ;

interface PainterTransformTranslateOption {
    type: "translate",
    x: number,
    y: number
}

interface PainterTransformRotateOption {
    type: "rotate",
    /** degree */
    rotate: number
}

interface PainterTransformScaleOption {
    type: "scale",
    scaleWidth: number,
    scaleHeight: number
}

interface PainterTransformMatrixOption {
    type: "set-matrix",
    translateX: number, translateY: number
    scaleX: number,     scaleY: number,
    skewX: number,      skewY: number,
}

type PaitnerTransformOriginOption = [PaitnerTransformOriginHorizontalOption, PaitnerTransformOriginVerticalOption];
type PaitnerTransformOriginHorizontalOption = "left" | "center" | "right";
type PaitnerTransformOriginVerticalOption = "top" | "center" | "bottom";

export class PainterTransformElement extends PainterElement {

    transformOrigin:   PaitnerTransformOriginOption
    transformOptions:  BuiltInPainterTransformOption[]
    contentElement:    PainterElement

    constructor(painter: Painter, option: PainterTransformElementOption, parent?: PainterElement){
        super(painter, option, parent);
        this.contentElement = createElement(painter, option.content, this);
        this.transformOptions = option.transform ?? []
        this.transformOrigin = option.transformOrigin
    }

    _layout(){
        return this.contentElement.layout();
    }

    async paint(){
        this.painter.ctx.save();
        this.transform();
        await this.contentElement.paint();
        this.painter.ctx.restore();
    }

    private transform(){
        this.transformOptions.forEach(option => this.singleTransform(option));
    }

    private singleTransform(option: BuiltInPainterTransformOption): void{
        switch(option.type){
            case "translate" : return this.painter.ctx.translate(
                this.painter.upx2px(option.x), 
                this.painter.upx2px(option.y)
            );

            case "rotate"    : return this.painter.ctx.rotate(
                option.rotate / 180 * Math.PI
            );

            case "scale"     : return this.painter.ctx.scale(
                option.scaleWidth,
                option.scaleHeight
            );

            case "set-matrix": return this.painter.ctx.setTransform(
                option.scaleX,
                option.skewX,
                option.scaleY,
                option.scaleY,
                this.painter.upx2px(option.translateX),
                this.painter.upx2px(option.translateY)
            );
            default:           throw  new Error("Unknown transform type.");
        }
    }
}
