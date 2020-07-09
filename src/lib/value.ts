import { PainterElementOption } from "./painter-element/base";

export interface Size {
    width: number,
    height: number
}

export interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export type BaseLine = "top" | "middle" | "bottom" | "normal";
export type BorderRadius = number | [number, number, number, number]
export type BorderStyle = "solid" | "dashed";
/** @example "#rrggbb" | "#rgb" | "colorName" */
export type Color = string
export interface ColorStop {
    offset: number,
    color: Color
}
export type FillStrokeStyle = string | CanvasGradient | CanvasPattern;

export type FontWeight = "normal" | "bold";
export type FontStyle = "normal" | "italic";
export type ObjectFit = "fill" | "contain" | "cover"; // "scale-down" | "none";
export type ObjectPosition = ["left" | "center" | "right", "top" | "center" | "bottom"];
export type Position = "static" | "absolute";
export type TextAlign = "left" | "right" | "center";
export type TextDecoration = "none" | "line-through";
/** left-top right-top right-bottom left-bottom */

export type OmitBaseOption<T> = Omit<T, keyof PainterElementOption>


export function cssBorderStyleToLinePattern(borderStyle: BorderStyle, borderWidth: number){
    const map: Record<BorderStyle, [number, number]> = {
        "dashed":   [borderWidth, borderWidth],
        "solid":    [10, 0]
    };
    return map[borderStyle];
}
