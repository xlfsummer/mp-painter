import Painter from "../painter";
import { Size, Position } from "../value";

export interface PainterElementOption {
    type: string
    /** 定位方式 */
    position: Position
    left: number
    top: number
}

export abstract class PainterElement {
    parent?: PainterElement;
    offsetTop = 0;
    offsetLeft = 0;
    left: number;
    top:  number;

    contentHeight = 0;
    contentWidth = 0;
    position: Position;

    painter: Painter;


    //  +---------------------------------+ canvas-box
    //  |                   anchorY       | parent 
    //  |         +----------------------+| element
    //  |         |          top         ||   
    //  |         |      +--------------+|| 
    //  | anchorX | left | width/height ||| 
    //  |         |      +--------------+||
    //  |         +----------------------+|
    //  +---------------------------------+
    constructor(
        painter: Painter,
        option: Partial<PainterElementOption>,
        parent?: PainterElement
    ) {
        this.painter    = painter;
        this.parent     = parent;
        this.position   = option.position   ?? "static" ;
        this.left       = option.left       ?? 0        ;
        this.top        = option.top        ?? 0        ;
    }

    protected abstract _layout(): Promise<Size> | Size;
    async layout(){
        let size = await this._layout();
        this.contentHeight = size.height;
        this.contentWidth = size.width;
        return size;
    }

    abstract paint(): void;

    get anchorX(): number{
        return this.parent?.elementX ?? 0;
    }
    get anchorY(): number{
        return this.parent?.elementY ?? 0;
    }
    get elementX(){
        switch (this.position){
            case "absolute" : return this.left + this.anchorX;
            case "static"   : return this.left + this.offsetLeft + this.anchorX;
            default: throw new TypeError("unknown position type");
        }
    }
    get elementY(){
        switch (this.position){
            case "absolute" : return this.top + this.anchorY;
            case "static"   : return this.top + this.offsetTop + this.anchorY;
            default: throw new TypeError("unknown position type");
        }
    }
    get offsetHeight(){
        return this.top + this.contentHeight;
    }
    get offsetWidth(){
        return this.left + this.contentWidth;
    }
}
