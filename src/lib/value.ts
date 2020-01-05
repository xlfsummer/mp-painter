import { PainterElementBaseOption } from "./painter";

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


/** @example "#rrggbb" */
export type Color = string
export type FontWeight = "normal" | "bold";
export type BaseLine = "top" | "middle" | "bottom" | "normal";
export type TextAlign = "left" | "right" | "center";
export type ObjectFit = "fill" | "contain" // "cover" | "scale-down" | "none";
export type Position = "static" | "absolute";
export type OmitBaseOption<T> = Omit<T, keyof PainterElementBaseOption>
