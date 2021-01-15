import { PainterUniContext } from "./context-uni";
import { PainterContext } from "./index";

export class PainterUniMpWeixinContext extends PainterUniContext implements PainterContext {
    /** 兼容地，根据控制点和半径绘制圆弧路径 */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number){
        // fix issue #9, 微信中, 如果 radius < 2, arcTo 命令会被忽略
        if(radius < 2){
        return this.lineTo(x1, y1);
        }

        return super.arcTo(x1, y1, x2, y2, radius);
    }

    measureTextWidth(text: string, fontSize: number){
        if(text.includes("\n") || text.includes("\r")){
            console.warn(`mp-painter:measureText:字符串 "${text}" 中包含换行符，结果在 iPhone 上可能不准确`);
        }
        return super.measureTextWidth(text, fontSize);
    }
}