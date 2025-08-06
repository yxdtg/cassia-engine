export class Bounds {
    public static get zero(): Bounds {
        return new Bounds(0, 0, 0, 0);
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
    public set(bounds?: Bounds | number, bottom?: number, left?: number, right?: number): void {
        if (bounds != null && typeof bounds === "object") {
            this.top = bounds.top;
            this.bottom = bounds.bottom;
            this.left = bounds.left;
            this.right = bounds.right;
        } else {
            this.top = bounds ?? this.top;
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
