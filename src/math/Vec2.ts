import { Mathf } from "./Mathf";

export class Vec2 {
    public static get zero(): Vec2 {
        return new Vec2(0, 0);
    }
    public static get half(): Vec2 {
        return new Vec2(0.5, 0.5);
    }
    public static get one(): Vec2 {
        return new Vec2(1, 1);
    }

    public static distance(a: Vec2, b: Vec2): number {
        return Mathf.distance(a.x, a.y, b.x, b.y);
    }
    public static angle(a: Vec2, b: Vec2): number {
        return Mathf.angle(a.x, a.y, b.x, b.y);
    }

    public static radiansToVector(radians: number): Vec2 {
        return new Vec2(Math.cos(radians), Math.sin(radians));
    }
    public static degreesToVector(degrees: number): Vec2 {
        return Vec2.radiansToVector(Mathf.degreesToRadians(degrees));
    }

    public static from(iVec2: IVec2): Vec2;
    public static from(array: [number, number]): Vec2;
    public static from(iVec2OrArray: IVec2 | [number, number]): Vec2;
    public static from(iVec2OrArray: IVec2 | [number, number]): Vec2 {
        if (Array.isArray(iVec2OrArray)) return new Vec2(...iVec2OrArray);

        return new Vec2(iVec2OrArray.x, iVec2OrArray.y);
    }

    public static lerp(a: Vec2, b: Vec2, t: number): Vec2 {
        return new Vec2(Mathf.lerp(a.x, b.x, t), Mathf.lerp(a.y, b.y, t));
    }

    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public set(vec2?: Vec2): void;
    public set(x?: number, y?: number): void;
    public set(vec2OrX?: Vec2 | number, y?: number): void;
    public set(vec2OrX?: Vec2 | number, y?: number): void {
        if (vec2OrX && typeof vec2OrX === "object") {
            this.x = vec2OrX.x;
            this.y = vec2OrX.y;
        } else {
            this.x = vec2OrX ?? this.x;
            this.y = y ?? this.y;
        }
    }

    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalizeSelf(): Vec2 {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }
    public normalized(): Vec2 {
        return this.clone().normalizeSelf();
    }

    public addSelf(value: Vec2): Vec2 {
        this.x += value.x;
        this.y += value.y;
        return this;
    }
    public add(value: Vec2): Vec2 {
        return this.clone().addSelf(value);
    }

    public subtractSelf(value: Vec2): Vec2 {
        this.x -= value.x;
        this.y -= value.y;
        return this;
    }
    public subtract(value: Vec2): Vec2 {
        return this.clone().subtractSelf(value);
    }

    public multiplySelf(value: Vec2): Vec2 {
        this.x *= value.x;
        this.y *= value.y;
        return this;
    }
    public multiply(value: Vec2): Vec2 {
        return this.clone().multiplySelf(value);
    }

    public multiplyScalarSelf(value: number): Vec2 {
        this.x *= value;
        this.y *= value;
        return this;
    }
    public multiplyScalar(value: number): Vec2 {
        return this.clone().multiplyScalarSelf(value);
    }

    public divideSelf(value: Vec2): Vec2 {
        this.x /= value.x;
        this.y /= value.y;
        return this;
    }
    public divide(value: Vec2): Vec2 {
        return this.clone().divideSelf(value);
    }

    public divideScalarSelf(value: number): Vec2 {
        this.x /= value;
        this.y /= value;
        return this;
    }
    public divideScalar(value: number): Vec2 {
        return this.clone().divideScalarSelf(value);
    }

    public equals(value: Vec2): boolean {
        return this.x === value.x && this.y === value.y;
    }

    public rotateSelf(radians: number): Vec2 {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;

        this.x = newX;
        this.y = newY;
        return this;
    }
    public rotate(radians: number): Vec2 {
        return this.clone().rotateSelf(radians);
    }

    public toRadians(): number {
        return Math.atan2(this.y, this.x);
    }
    public toDegrees(): number {
        return (this.toRadians() * 180) / Math.PI;
    }
}

export function vec2(x: number = 0, y: number = 0): Vec2 {
    return new Vec2(x, y);
}

export interface IVec2 {
    x: number;
    y: number;
}
