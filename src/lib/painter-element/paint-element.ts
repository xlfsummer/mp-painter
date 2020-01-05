import Painter, { PainterElementBaseOption } from "../painter";
import { Size, Position } from "../value";
export default abstract class PainterElement {
    anchorX = 0;
    anchorY = 0;
    left = 0;
    top = 0;
    contentHeight = 0;
    contentWidth = 0;
    position: Position;

    painter: Painter;

    constructor(painter: Painter, option: Partial<PainterElementBaseOption>) {
        this.painter    = painter;
        this.position   = option.position   ?? "static" ;
        this.left       = option.left       ?? 0        ;
        this.top        = option.top        ?? 0        ;
    }

    abstract layout(): Promise<Size> | Size;
    abstract paint(): void;

    get x(){
        if(this.position == "absolute") 
            return this.left
        if(this.position == "static")
            return this.left + this.anchorX;
    }
    get y(){
        if(this.position == "absolute") 
            return this.top;
        if(this.position == "static")
            return this.top + this.anchorY;
    }
    get totalHeight(){
        return this.top + this.contentHeight;
    }
    get totalWidth(){
        return this.left + this.contentWidth;
    }
}
