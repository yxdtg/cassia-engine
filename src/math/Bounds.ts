export class Bounds {
    public static get zero(): Bounds {
        return new Bounds(0, 0, 0, 0);
    }

    public static from(iBounds: IBounds): Bounds;
    public static from(array: [number, number, number, number]): Bounds;
    public static from(iBoundsOrArray: IBounds | [number, number, number, number]): Bounds;
    public static from(iBoundsOrArray: IBounds | [number, number, number, number]): Bounds {
        if (Array.isArray(iBoundsOrArray)) return new Bounds(...iBoundsOrArray);
        return new Bounds(iBoundsOrArray.top, iBoundsOrArray.bottom, iBoundsOrArray.left, iBoundsOrArray.right);
    }

    public top: number = 0;
    public bottom: number = 0;
    public left: number = 0;
    public right: number = 0;

    constructor(top: number, bottom: number, left: number, right: number) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }

    public set(bounds: Bounds): void;
    public set(top?: number, bottom?: number, left?: number, right?: number): void;
    public set(boundsOrTop?: Bounds | number, bottom?: number, left?: number, right?: number): void;
    public set(boundsOrTop?: Bounds | number, bottom?: number, left?: number, right?: number): void {
        if (boundsOrTop != null && typeof boundsOrTop === "object") {
            this.top = boundsOrTop.top;
            this.bottom = boundsOrTop.bottom;
            this.left = boundsOrTop.left;
            this.right = boundsOrTop.right;
        } else {
            this.top = boundsOrTop ?? this.top;
            this.bottom = bottom ?? this.bottom;
            this.left = left ?? this.left;
            this.right = right ?? this.right;
        }
    }

    public clone(): Bounds {
        return new Bounds(this.top, this.bottom, this.left, this.right);
    }

    public equals(bounds: Bounds): boolean {
        return (
            this.top === bounds.top &&
            this.bottom === bounds.bottom &&
            this.left === bounds.left &&
            this.right === bounds.right
        );
    }
}

export function bounds(top: number = 0, bottom: number = 0, left: number = 0, right: number = 0): Bounds {
    return new Bounds(top, bottom, left, right);
}

export interface IBounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
