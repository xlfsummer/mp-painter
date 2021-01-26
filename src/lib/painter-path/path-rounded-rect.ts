import { PainterPath, PainterPathOption,  } from "./base";
import { BorderRadius, BorderRadius4 } from "../value";
import { PainterElement } from "../painter-element/base";

export interface PainterRoundedRectanglePathOption extends PainterPathOption {
    type: "rounded-rect",
    /** 路径的宽度 */
    width: number,
    /** 路径的高度 */
    height: number,
    /** 路径的圆角 */
    borderRadius: BorderRadius
}

export class PainterRoundedRectanglePath extends PainterPath {
    option: PainterRoundedRectanglePathOption;

    constructor (element: PainterElement, option: PainterRoundedRectanglePathOption){
        super(element, option);
        this.option = option;

        if(this.option.borderRadius){
            this.assertBorderRadius();
        }
    }

    private assertBorderRadius(){
        if(this.normalizedBorderRadius.some(radius => radius < 0)){
            console.warn("mp-painter:border radius must greater than 0, got:", this.normalizedBorderRadius.join(","));
            this.option.borderRadius = 0;
        }
    }

    paint(){
        this.reduceBorderRadius();

        const { ctx, upx2px } = this.painter;
        
        const uX = upx2px(this.pathX);
        const uY = upx2px(this.pathY);
        const uH = upx2px(this.option.height);
        const uW = upx2px(this.option.width);

        const [
          uTopLeftR,
          uTopRightR,
          uBottomRightR,
          uBottomLeftR
        ] = this.normalizedBorderRadius.map(r => upx2px(r));
    
        ctx.beginPath();

        //  ╭─────╮
        // →│1   2|
        //  │     |
        //  │4   3|
        //  ╰─────╯

        ctx.moveTo(
          uX,                       uY + uTopLeftR
        );

        // top left
        ctx.arcTo(
          uX,                       uY,
          uX + uTopLeftR,           uY,
          uTopLeftR
        );
    
        // top right
        ctx.arcTo(
          uX + uW,                  uY,
          uX + uW,                  uY + uTopRightR,
          uTopRightR
        );
    
        // bottom right
        ctx.arcTo(
          uX + uW,                  uY + uH,
          uX + uW - uBottomRightR,  uY + uH,
          uBottomRightR
        );
    
        // bottom left
        ctx.arcTo(
          uX,                       uY + uH,
          uX,                       uY + uH - uBottomLeftR,
          uBottomLeftR
        )
        
        ctx.closePath();
    }

    private get normalizedBorderRadius(): BorderRadius4 {
        if(typeof this.option.borderRadius == "number"){
          return Array.from({ length: 4 }).fill(this.option.borderRadius) as BorderRadius4;
        } else {
          return [...this.option.borderRadius];
        }
    }

    /**
     * @see https://www.w3.org/TR/css-backgrounds-3/#corner-overlap
     * Corner curves must not overlap: When the sum of any two adjacent border
     * radii exceeds the size of the border box, UAs must proportionally reduce
     * the used values of all border radii until none of them overlap.
     */
    private reduceBorderRadius(){

        let [topLeftR, topRightR, bottomRightR, bottomLeftR] = this.normalizedBorderRadius;

        let f = Math.min(
        // top
        this.option.width  / (topLeftR    + topRightR),
        // right
        this.option.height / (topRightR   + bottomRightR),
        // bottom
        this.option.width  / (bottomLeftR + bottomRightR),
        // left
        this.option.height / (topLeftR    + bottomLeftR)
        );

        if(f >= 1) return;

        this.option.borderRadius = this.normalizedBorderRadius.map(radius => radius * f) as BorderRadius4;
    }
}
