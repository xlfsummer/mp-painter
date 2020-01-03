import Painter, { PainterElementBaseOption } from "../painter";
import { Size, Position } from "../value";
export default abstract class PainterElement {
    originX = 0;
    originY = 0;
    left = 0;
    top = 0;
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

    get contentLeft(){
        if(this.position == "absolute") 
            return this.left
        if(this.position == "static")
            return this.left + this.originX;
    }
    get contentTop(){
        if(this.position == "absolute") 
            return this.top;
        if(this.position == "static")
            return this.top + this.originY;
    }
}
