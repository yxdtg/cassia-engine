import { bounds } from "./Bounds";
import { color } from "./Color";
import { size } from "./Size";
import { vec2, Vec2 } from "./Vec2";

export interface IVec2 {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IBounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export function vec2ToIVec2(vec2: Vec2): IVec2 {
    return { x: vec2.x, y: vec2.y };
}
export function iVec2ToVec2(iVec2: IVec2): Vec2 {
    return vec2(iVec2.x, iVec2.y);
}

export function sizeToISize(size: ISize): ISize {
    return { width: size.width, height: size.height };
}
export function iSizeToSize(iSize: ISize): ISize {
    return size(iSize.width, iSize.height);
}

export function boundsToIBounds(bounds: IBounds): IBounds {
    return { top: bounds.top, bottom: bounds.bottom, left: bounds.left, right: bounds.right };
}
export function iBoundsToBounds(iBounds: IBounds): IBounds {
    return bounds(iBounds.top, iBounds.bottom, iBounds.left, iBounds.right);
}

export function colorToIColor(color: IColor): IColor {
    return { r: color.r, g: color.g, b: color.b, a: color.a };
}
export function iColorToColor(iColor: IColor): IColor {
    return color(iColor.r, iColor.g, iColor.b, iColor.a);
}
