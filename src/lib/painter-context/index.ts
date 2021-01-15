import Painter from "../painter";
import { PainterH5Context } from "./context-h5";
import { PainterUniMpAlipayContext } from "./context-uni-mp-alipay";
import { PainterUniMpBaiduContext } from "./context-uni-mp-baidu";
import { PainterUniMpWeixinContext } from "./context-uni-mp-weixin";

export type CompatableContext = CanvasContext | CanvasRenderingContext2D;

export type PainterContext = Pick<CanvasContext, 
    | "arcTo"
    | "clip"
    | "draw"
    | "fillStyle"
    | "font"
    | "lineTo"
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
    measureTextWidth(text: string, fontSize: number): number
    drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number): Promise<void>
    drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx: number, dy: number, dWidth: number, dHeight: number): Promise<void>
};

export function adaptContext(painter: Painter, ctx: CompatableContext): PainterContext{
    switch (painter.platform) {
        case "h5":
            return new PainterH5Context(painter, ctx as CanvasRenderingContext2D);
        case "mp-weixin":
            return new PainterUniMpWeixinContext(painter, ctx as CanvasContext);
        case "mp-alipay":
            return new PainterUniMpAlipayContext(painter, ctx as CanvasContext);
        case "mp-baidu":
            return new PainterUniMpBaiduContext(painter, ctx as CanvasContext);    
        default:
            throw new Error("mp-painter: unexpect platform :" + painter.platform);
    }
}
