import { CHAR_WIDTH_SCALE_MAP } from "../const";
import { PainterUniContext } from "./context-uni";
import { PainterContext } from "./index";

export class PainterUniMpAlipayContext extends PainterUniContext implements PainterContext {
    // 在支付宝 iOS 中获取字符串宽度时, 如果字符串数量较多，可能获取不到正确的宽度
    // 获取到的宽度会始终比换行所需的宽度小，无法正确换行。
    measureTextWidth(text: string, fontSize: number){
        return text.split("").reduce((widthScaleSum, char) => {
            let code = char.charCodeAt(0);
            let widthScale = CHAR_WIDTH_SCALE_MAP[code - 0x20] || 1;
            return widthScaleSum + widthScale;
        }, 0) * fontSize;
    }
}