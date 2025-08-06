import type { IVec2 } from "./define";

function ivec2(x: number, y: number): IVec2 {
    return { x, y };
}

export class Mathf {
    public static Rad2Deg: number = 180 / Math.PI;
    public static Deg2Rad: number = Math.PI / 180;

    /**
     * 线性插值
     * @param a 起始值
     * @param b 目标值
     * @param t 速率 (0 ~ 1)
     * @returns 值
     */
    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /**
     * 随机选择一个值
     * @param values 值序列
     * @returns 值
     */
    public static choose<T>(...values: T[]): T {
        const index = Mathf.randomInt(values.length);
        return values[index];
    }

    /**
     * 限制值在最小值和最大值之间
     * @param value 值
     * @param min 最小值
     * @param max 最大值
     * @returns 值
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * 计算二维距离
     * @param x1 x点1
     * @param y1 y点1
     * @param x2 x点2
     * @param y2 y点2
     * @returns 距离
     */
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    /**
     * 计算一维距离
     * @param x1 点1
     * @param x2 点2
     * @returns 距离
     */
    public static distance1d(x1: number, x2: number): number {
        return Math.abs(x2 - x1);
    }

    /**
     * 计算两点之间的角度
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns
     */
    public static angle(x1: number, y1: number, x2: number, y2: number): number {
        return Mathf.radiansToDegrees(Math.atan2(y2 - y1, x2 - x1));
    }

    /**
     * 弧度转角度
     * @param radians 弧度
     * @returns 角度
     */
    public static radiansToDegrees(radians: number): number {
        return radians * this.Rad2Deg;
    }
    /**
     * 角度转弧度
     * @param degrees 角度
     * @returns 弧度
     */
    public static degreesToRadians(degrees: number): number {
        return degrees * this.Deg2Rad;
    }

    /**
     * 获取随机数
     * @param max 最大值
     * @returns 随机数 ( >= 0 && < max )
     */
    public static random(max: number): number {
        return Math.random() * max;
    }
    /**
     * 获取指定范围随机数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机数 ( >= min && < max )
     */
    public static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 获取随机整数
     * @param max 最大值
     * @returns 随机整数 ( >= 0 && < max )
     */
    public static randomInt(max: number): number {
        return Math.floor(Mathf.random(max));
    }
    /**
     * 获取指定范围随机整数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机整数 ( >= min && < max )
     */
    public static randomRangeInt(min: number, max: number): number {
        return Math.floor(Mathf.randomRange(min, max));
    }

    public static createRectangleVertices(startPosition: IVec2, endPosition: IVec2): IVec2[] {
        return [
            ivec2(startPosition.x, startPosition.y),
            ivec2(endPosition.x, startPosition.y),
            ivec2(endPosition.x, endPosition.y),
            ivec2(startPosition.x, endPosition.y),
        ];
    }

    public static calculatePolygonVertices(
        x: number,
        y: number,
        width: number,
        height: number,
        scaleX: number,
        scaleY: number,
        anchorX: number,
        anchorY: number,
        radians: number
    ): IVec2[] {
        let offsetX = width * anchorX;
        let offsetY = height * anchorY;

        // 获取四个顶点
        let vertices: IVec2[] = [
            ivec2(-offsetX, -offsetY),
            ivec2(width - offsetX, -offsetY),
            ivec2(width - offsetX, height - offsetY),
            ivec2(-offsetX, height - offsetY),
        ];

        // 应用缩放
        vertices = vertices.map((v) => ivec2(v.x * scaleX, v.y * scaleY));

        // 应用旋转
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        vertices = vertices.map((v) => {
            const rotatedX = v.x * cos - v.y * sin;
            const rotatedY = v.x * sin + v.y * cos;

            return ivec2(rotatedX + x, rotatedY + y);
        });

        return vertices;
    }

    public static isPointInPolygon(point: IVec2, polygon: IVec2[]): boolean {
        let x = point.x;
        let y = point.y;

        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i].x;
            let xj = polygon[j].x;
            let yi = polygon[i].y;
            let yj = polygon[j].y;

            let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    public static isPolygonContained(outer: IVec2[], inner: IVec2[]): boolean {
        for (let point of inner) {
            if (!this.isPointInPolygon(point, outer)) {
                return false;
            }
        }

        for (let i = 0, j = inner.length - 1; i < inner.length; j = i++) {
            for (let k = 0, l = outer.length - 1; k < outer.length; l = k++) {
                if (this._doLineSegmentsIntersect(inner[i], inner[j], outer[k], outer[l])) {
                    return false;
                }
            }
        }

        return true;
    }
    private static _doLineSegmentsIntersect(a: IVec2, b: IVec2, c: IVec2, d: IVec2): boolean {
        return this._ccw(a, c, d) !== this._ccw(b, c, d) && this._ccw(a, b, c) !== this._ccw(a, b, d);
    }
    private static _ccw(a: IVec2, b: IVec2, c: IVec2) {
        return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    }
}
