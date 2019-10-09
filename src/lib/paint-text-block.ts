import Painter, {PaintBaseOption} from "./painter";
import paintText, {CanvasText} from "./paint-text";
import { promiseQueue } from "../utils/promiseQueue";
import LineSpliterContext from "./lineSpliter";

type fontWeight = "normal" | "bold";
type baseline = "top" | "middle" | "bottom" | "normal";
type align = "left" | "right" | "center";

export interface CanvasTextBlock extends Omit<CanvasText, "type"> {
    type: "text-block",
  
    // color: string,
    // fontSize: number
    // fontWeight: fontWeight
    // fontFamily: string
    // baseline: baseline
    // align: align
    // content: string;

    lineHeight: number
    lineClamp: number
    
    width: number;
    height: number | "auto";
  
}

let lineSplitCache: Record<string, string[]> = {};

export default async function paintTextBlock(this: Painter, textblock: CanvasTextBlock){
    // this.debug("绘制文本块");

    let {
      width = 100,
      fontSize = 30,
      content = "",
      lineHeight = 40,
      lineClamp = 0
    } = textblock;

    if(content === null) content = "";

    let cacheKey = JSON.stringify({fontSize, lineClamp, width, content});
    if(!lineSplitCache[cacheKey]){
      lineSplitCache[cacheKey] = new LineSpliterContext({
        fontSize, lineClamp, width,
        ctx: this.ctx,
        content
      }).split();
    }

    let lines = lineSplitCache[cacheKey];

    await promiseQueue(
      lines.map((line, row) => () => paintText.call(this, {
          ...textblock,
          type: "text",
          top: textblock.top + row * lineHeight,
          content: line
        }))
    );

    return {
      width: width,
      height: (lines.length - 1 ) * lineHeight + fontSize
    };
  }
