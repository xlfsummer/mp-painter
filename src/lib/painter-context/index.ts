import Painter from "../painter";
import { adaptH5Context } from "./context-h5";

export type CompatableContext = CanvasContext | CanvasRenderingContext2D;

export type PainterContext = Omit<CanvasContext, "drawImage"> & {
    drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number): Promise<void>
    drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx: number, dy: number, dWidth: number, dHeight: number): Promise<void>
};

export function adaptContext(painter: Painter, ctx: CompatableContext): PainterContext{

    if(ctx instanceof CanvasRenderingContext2D){
        return adaptH5Context(painter, ctx);
    }

    return ctx as unknown as PainterContext;
}
