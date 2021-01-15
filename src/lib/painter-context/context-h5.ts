import Painter from "../painter";
import { BaseLine, FillStrokeStyle, TextAlign } from "../value";
import { createClass } from "./helper";
import { PainterContext } from "./index";

export class PainterH5Context extends createClass<CanvasRenderingContext2D>() implements PainterContext {

    private painter: Painter

    constructor(painter: Painter, context: CanvasRenderingContext2D){
        super(context);
        this.painter = painter;
    }
    draw(reserve: boolean, callback: () => void): void {
        callback();
    }

    setFillStyle(color: FillStrokeStyle): void {
        super.fillStyle = color;
    }

    setStrokeStyle(color: FillStrokeStyle): void {
        super.strokeStyle = color;
    }

    async drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeight: number, dx?: number, dy?: number, dWidth?: number, dHeight?: number){
        let image = await normalizeImageResource(imageResource);

        if(dx && dy && dWidth && dHeight){
            super.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);    
        } else {
            super.drawImage(image, sx, sy, sWidth, sHeight);
        }
    }

    setTextAlign(align: TextAlign){
        super.textAlign = align;
    }

    setTextBaseline(baseline: BaseLine){
        super.textBaseline = baseline === "normal" ? "alphabetic" : baseline;
    }
    
    setFontSize(fontSize: number){
        console.debug(
            "set font size for h5, before is %s after is %s",
            super.font,
            super.font?.replace(/\b\w+px\b/, `${this.painter.upx2px(fontSize)}px sans-serif`)
        );
        super.font = super.font?.replace(/\b\w+px\b/, `${this.painter.upx2px(fontSize)}px`);
    }

    measureTextWidth(text: string, fontSize: number){
        this.setFontSize(fontSize);
        let width = this.measureText(text).width;
        console.debug("measureText: result of measure text \"%s\" with font size %s is %s", text, this.font, width);
        return width ?? 0;
    }
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
