import Painter from "../painter";
import { createClass } from "./helper";
import { PainterContext } from "./index";

const CanvasContext = createClass<CanvasContext>();

export class PainterUniContext extends CanvasContext implements PainterContext {

    private painter: Painter

    constructor(painter: Painter, context: CanvasContext){
        super(context);
        this.painter = painter;
    }

    async drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeight: number, dx?: number, dy?: number, dWidth?: number, dHeight?: number){
        if(dx && dy && dWidth && dHeight){
            super.drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);    
        } else {
            super.drawImage(imageResource, sx, sy, sWidth, sHeight);
        }
    }

    measureTextWidth(text: string, fontSize: number){
        this.setFontSize(fontSize);
        return this.measureText(text).width ?? 0
    }
}