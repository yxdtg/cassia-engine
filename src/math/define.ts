import type { IBooleanPair } from "./BooleanPair";
import type { IBounds } from "./Bounds";
import type { IColor } from "./Color";
import type { ISize } from "./Size";
import type { IVec2 } from "./Vec2";

export function iVec2(x: number = 0, y: number = 0): IVec2 {
    return { x, y };
}

export function iSize(width: number = 0, height: number = 0): ISize {
    return { width, height };
}

export function iColor(r: number = 255, g: number = 255, b: number = 255, a: number = 255): IColor {
    return { r, g, b, a };
}

export function iBounds(top: number = 0, bottom: number = 0, left: number = 0, right: number = 0): IBounds {
    return { top, bottom, left, right };
}

export function iBooleanPair(x: boolean = false, y: boolean = false): IBooleanPair {
    return { x, y };
}
