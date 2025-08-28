import { Mathf } from "./Mathf";

export class Color {
    public static get white(): Color {
        return new Color(255, 255, 255);
    }
    public static get black(): Color {
        return new Color(0, 0, 0);
    }

    public static get red(): Color {
        return new Color(255, 0, 0);
    }
    public static get green(): Color {
        return new Color(0, 255, 0);
    }
    public static get blue(): Color {
        return new Color(0, 0, 255);
    }

    public static get yellow(): Color {
        return new Color(255, 255, 0);
    }
    public static get cyan(): Color {
        return new Color(0, 255, 255);
    }
    public static get magenta(): Color {
        return new Color(255, 0, 255);
    }

    public static get transparent(): Color {
        return new Color(0, 0, 0, 0);
    }

    public static get random(): Color {
        const max = 255 + 1;
        return new Color(Mathf.randomInt(max), Mathf.randomInt(max), Mathf.randomInt(max), 255);
    }
    public static get randomWithAlpha(): Color {
        const max = 255 + 1;
        return new Color(Mathf.randomInt(max), Mathf.randomInt(max), Mathf.randomInt(max), Mathf.randomInt(max));
    }

    public static from(iColor: IColor): Color;
    public static from(array: [number, number, number, number]): Color;
    public static from(iColorOrArray: IColor | [number, number, number, number]): Color;
    public static from(iColorOrArray: IColor | [number, number, number, number]): Color {
        if (Array.isArray(iColorOrArray)) return new Color(...iColorOrArray);
        return new Color(iColorOrArray.r, iColorOrArray.g, iColorOrArray.b, iColorOrArray.a);
    }

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public set(color?: Color): void;
    public set(r?: number, g?: number, b?: number, a?: number): void;
    public set(colorOrR?: Color | number, g?: number, b?: number, a?: number): void;
    public set(colorOrR?: Color | number, g?: number, b?: number, a?: number): void {
        if (colorOrR && typeof colorOrR === "object") {
            this.r = colorOrR.r;
            this.g = colorOrR.g;
            this.b = colorOrR.b;
            this.a = colorOrR.a;
        } else {
            this.r = colorOrR ?? this.r;
            this.g = g ?? this.g;
            this.b = b ?? this.b;
            this.a = a ?? this.a;
        }
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public equals(color: Color): boolean {
        return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
    }

    public toDecimal(): number {
        return (this.r << 16) | (this.g << 8) | this.b;
    }

    public toHex(): string {
        const _helperToHex = (value: number): string => {
            const hex = value.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };

        return `#${_helperToHex(this.r)}${_helperToHex(this.g)}${_helperToHex(this.b)}`;
    }

    public static hexToColor(hex: string): Color {
        hex = hex.replace("#", "");

        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        return new Color(r, g, b);
    }
}

export function color(r: number = 255, g: number = 255, b: number = 255, a: number = 255): Color {
    return new Color(r, g, b, a);
}

export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
