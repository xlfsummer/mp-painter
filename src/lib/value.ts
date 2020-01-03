export interface Size {
    width: number,
    height: number
}

/** @example "#rrggbb" */
export type Color = string
export type FontWeight = "normal" | "bold";
export type BaseLine = "top" | "middle" | "bottom" | "normal";
export type TextAlign = "left" | "right" | "center";
export type ObjectFit = "fill" | "contain" // "cover" | "scale-down" | "none";
export type Position = "static" | "absolute";
