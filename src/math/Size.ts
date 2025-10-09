import type { Vec2 } from "./Vec2";

export class Size {
    public static readonly defaultWidth: number = 64;
    public static readonly defaultHeight: number = 64;

    public static get zero(): Size {
        return new Size(0, 0);
    }

    public static get default(): Size {
        return new Size(Size.defaultWidth, Size.defaultHeight);
    }

    public static from(iSize: ISize): Size;
    public static from(array: [number, number]): Size;
    public static from(iSizeOrArray: ISize | [number, number]): Size;
    public static from(iSizeOrArray: ISize | [number, number]): Size {
        if (Array.isArray(iSizeOrArray)) return new Size(...iSizeOrArray);

        return new Size(iSizeOrArray.width, iSizeOrArray.height);
    }

    public width: number;
    public height: number;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    public set(size?: Size): void;
    public set(width?: number, height?: number): void;
    public set(sizeOrWidth?: Size | number, height?: number): void;
    public set(sizeOrWidth?: Size | number, height?: number): void {
        if (sizeOrWidth && typeof sizeOrWidth === "object") {
            this.width = sizeOrWidth.width;
            this.height = sizeOrWidth.height;
        } else {
            this.width = sizeOrWidth ?? this.width;
            this.height = height ?? this.height;
        }
    }

    public clone(): Size {
        return new Size(this.width, this.height);
    }

    public equals(size: Size): boolean {
        return this.width === size.width && this.height === size.height;
    }

    public multiplySelf(vec2: Vec2): Size {
        this.width *= vec2.x;
        this.height *= vec2.y;
        return this;
    }
    public multiply(vec2: Vec2): Size {
        return this.clone().multiplySelf(vec2);
    }

    public multiplyScalarSelf(value: number): Size {
        this.width *= value;
        this.height *= value;
        return this;
    }
    public multiplyScalar(value: number): Size {
        return this.clone().multiplyScalarSelf(value);
    }

    public divideSelf(vec2: Vec2): Size {
        this.width /= vec2.x;
        this.height /= vec2.y;
        return this;
    }
    public divide(vec2: Vec2): Size {
        return this.clone().divideSelf(vec2);
    }

    public divideScalarSelf(value: number): Size {
        this.width /= value;
        this.height /= value;
        return this;
    }
    public divideScalar(value: number): Size {
        return this.clone().divideScalarSelf(value);
    }
}

export function size(width: number = 0, height: number = 0): Size {
    return new Size(width, height);
}

export interface ISize {
    width: number;
    height: number;
}
