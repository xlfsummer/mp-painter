import Painter from "../painter";
import { PainterH5Context } from "./context-h5";
import { PainterUniContext } from "./context-uni";

export type CompatableContext = CanvasContext | CanvasRenderingContext2D;

export type PainterContext = Pick<CanvasContext, 
    | "arcTo"
    | "clip"
    | "draw"
    | "fillStyle"
    | "font"
    | "lineTo"
    | "measureText"
    | "restore"
    | "save"
    | "setFillStyle"
    | "setFontSize"
    | "setStrokeStyle"
    | "setTextAlign"
    | "setTextBaseline" 
    | "strokeStyle"
    | "beginPath"
    | "closePath"
    | "moveTo"
    | "createLinearGradient"
    | "stroke"
    | "fill"
    | "strokeRect"
    | "fillRect"
    | "lineWidth"
    | "setLineDash"
    | "fillText"
    | "setTransform"
    | "scale"
    | "rotate"
    | "translate"
    > & {
    drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number): Promise<void>
    drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx: number, dy: number, dWidth: number, dHeight: number): Promise<void>
};

export function adaptContext(painter: Painter, ctx: CompatableContext): PainterContext{

    if(ctx instanceof CanvasRenderingContext2D){
        return new PainterH5Context(painter, ctx);
    }

    // if(painter.platform === "mp-weixin"){
    //     return new PainterUniContext(painter, ctx);
    // }

    return new PainterUniContext(painter, ctx);
}
