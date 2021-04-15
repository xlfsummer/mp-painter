import { PainterUniContext } from "./context-uni";
import { PainterContext } from "./index";

export class PainterUniMpBaiduContext extends PainterUniContext implements PainterContext {
    // 百度测量的字号是以 10 为基准的，不会根据字号设置而变化
    measureTextWidth(text: string, fontSize: number){
        text == "top" && console.log("measureText(" + text + ").width=", super.measureText(text).width);
        let width = super.measureText(text).width ?? 0;
        return width / 10 * fontSize;
    }

    async drawImageWithSrc(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx?: number, dy?: number, dWidth?: number, dHeight?: number){
        if (typeof dx === "number"
            && typeof dy === "number"
            && typeof dWidth === "number"
            && typeof dHeight === "number"
        ){
            super.drawImageWithSrc(imageResource, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeigt);
        } else {
            super.drawImageWithSrc(imageResource, sx, sy, sWidth, sHeigt);
        }
    }
}