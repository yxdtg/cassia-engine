export class BooleanPair {
    public static get true(): BooleanPair {
        return new BooleanPair(true, true);
    }
    public static get false(): BooleanPair {
        return new BooleanPair(false, false);
    }

    public x: boolean;
    public y: boolean;

    constructor(x: boolean, y: boolean) {
        this.x = x;
        this.y = y;
    }

    public set(booleanPair?: BooleanPair): void;
    public set(x?: boolean, y?: boolean): void;
    public set(booleanPairOrX?: BooleanPair | boolean, y?: boolean): void;
    public set(booleanPairOrX?: BooleanPair | boolean, y?: boolean): void {
        if (booleanPairOrX && typeof booleanPairOrX === "object") {
            this.x = booleanPairOrX.x;
            this.y = booleanPairOrX.y;
        } else {
            this.x = booleanPairOrX ?? this.x;
            this.y = y ?? this.y;
        }
    }

    public clone(): BooleanPair {
        return new BooleanPair(this.x, this.y);
    }

    public equals(value: BooleanPair): boolean {
        return this.x === value.x && this.y === value.y;
    }
}

export function booleanPair(x: boolean, y: boolean): BooleanPair {
    return new BooleanPair(x, y);
}
