import Painter from "./painter";
import { Size } from "./value";

interface PainterElementOption {
    position: "static" | "absolute"
    left: number
    top: number
}

interface PainterRectangleElementOption extends PainterElementOption {
    type: "rect",
    width: number,
    height: number,
    background: string
}

abstract class PainterElement {
    protected x = 0
    protected y = 0
    protected width = 0
    protected height = 0
    protected layoutInfo = {}
    painter: Painter
    constructor(painter: Painter, option: PainterElementOption){
        this.painter = painter
    }
    abstract layout(): Promise<Size> | Size;
    abstract paint(): void
}

class PainterRectangleElement extends PainterElement {
    option: Partial<PainterRectangleElementOption>;
    painter: Painter
    constructor(painter: Painter, option: PainterRectangleElementOption){
        super(painter, option);
        this.painter = painter;
        this.option = option;
    }
    async layout(){
        return { width: this.option.width = 0, height: this.option.height = 0 };
    }
    async paint(){
        this.option.background && this.painter.setFillStyle(this.option.background);
        // this.painter.ctx.fillRect(
        //     this.painter.upx2px(this.option.left), 
        //     this.painter.upx2px(this.option.top),
        //     this.painter.upx2px(this.option.width), 
        //     this.painter.upx2px(this.option.height)
        // );
    }
}

let painter = new Painter(uni.createCanvasContext("a"))
