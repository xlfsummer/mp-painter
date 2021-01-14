import Painter from "../painter";
import { BaseLine, TextAlign } from "../value";
import { createExtendableContextProto } from "./helper";
import { PainterContext } from "./index";

export function adaptH5Context(painter: Painter, ctx: CanvasRenderingContext2D): PainterContext{

    const patch: Partial<PainterContext> = {
        async drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeight: number, dx?: number, dy?: number, dWidth?: number, dHeight?: number){
            let image = await normalizeImageResource(imageResource);

            if(dx && dy && dWidth && dHeight){
                ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);    
            } else {
                ctx.drawImage(image, sx, sy, sWidth, sHeight);
            }
        },
        setTextAlign(align: TextAlign){
            return ctx.textAlign = align;
        },
        setTextBaseline(baseline: BaseLine){
            return ctx.textBaseline = baseline === "normal" ? "alphabetic" : baseline;
        },
        setFontSize(fontSize: number){
            console.debug(
                "set font size for h5, before is %s after is %s",
                ctx.font,
                ctx.font?.replace(/\b\w+px\b/, `${painter.upx2px(fontSize)}px sans-serif`)
            );
            return ctx.font = ctx.font?.replace(/\b\w+px\b/, `${painter.upx2px(fontSize)}px`);
        }
    };

    return Object.setPrototypeOf(patch, createExtendableContextProto(ctx));
}

export function normalizeImageResource (src: string): Promise<HTMLImageElement> {
    let imageHtmlElement = new Image();
    imageHtmlElement.src = src;
    return new Promise(resolve => 
      imageHtmlElement.addEventListener(
        "load",
        _ => resolve(imageHtmlElement),
        { once: true }
      )
    );
}