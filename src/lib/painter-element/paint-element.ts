import Painter, { PainterElementBaseOption } from "../painter";
import { Size } from "../value";
export default abstract class PainterElement {
    protected elementOriginX = 0;
    protected elementOriginY = 0;
    painter: Painter;
    constructor(painter: Painter) {
        this.painter = painter;
    }
    abstract layout(): Promise<Size> | Size;
    abstract paint(): void;
}
