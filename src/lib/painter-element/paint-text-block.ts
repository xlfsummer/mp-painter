import Painter, {PainterElementBaseOption} from "../painter";
import paintText, {PainterTextElementOption} from "./paint-text";
import { promiseQueue } from "../../utils/promiseQueue";
import LineSpliterContext from "../line-spliter";

export interface PainterTextBlockElementOption extends Omit<PainterTextElementOption, "type"> {
    type: "text-block",
  
    lineHeight: number
    lineClamp: number
    
    width: number;
    height: number | "auto";
  
}

let lineSplitCache: Record<string, string[]> = {};

export default async function paintTextBlock(this: Painter, textblock: PainterTextBlockElementOption){
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
        painter: this,
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
