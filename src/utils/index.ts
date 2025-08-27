export function getOs(): OS_TYPE {
    if (!navigator) return OS_TYPE.Unknown;

    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return OS_TYPE.Windows;
    if (userAgent.includes("Mac")) return OS_TYPE.MacOS;
    if (userAgent.includes("Linux")) return OS_TYPE.Linux;
    if (userAgent.includes("Android")) return OS_TYPE.Android;
    if (userAgent.includes("iPhone")) return OS_TYPE.iOS;

    return OS_TYPE.Unknown;
}

export const OS_TYPE = {
    Windows: "windows",
    MacOS: "macos",
    Linux: "linux",
    Android: "android",
    iOS: "ios",
    Unknown: "unknown",
} as const;
export type OS_TYPE = (typeof OS_TYPE)[keyof typeof OS_TYPE];

/**
 * 克隆纯数据 (深拷贝纯数据 不包含函数和引用)
 * @param data 纯数据
 * @returns 克隆后的纯数据
 */
export function cloneData<T>(data: T, undefinedAs: any = undefined): T {
    if (typeof data === "undefined") return undefinedAs as T;
    return JSON.parse(JSON.stringify(data));
}

/**
 * 序列化纯数据 (不包含函数和引用)
 * @param data 纯数据
 * @returns 序列化后的纯数据
 */
export function serializationData(data: any): string {
    return JSON.stringify(data);
}

/**
 * 反序列化纯数据 (不包含函数和引用)
 * @param data 纯数据
 * @returns 反序列化后的纯数据
 */
export function deserializationData<T>(data: string): T {
    return JSON.parse(data);
}

export function defineObjectGetter(obj: any, propertyName: string, value: any): void {
    Object.defineProperty(obj, propertyName, {
        get: () => value,
    });
}

export function msToSeconds(ms: number): number {
    return ms / 1000;
}
export function secondsToMs(seconds: number): number {
    return seconds * 1000;
}

export function formatMsToTime(ms: number): string {
    const pad = (num: number) => num.toString().padStart(2, "0");

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function callAnyMethod(obj: any, method: string, ...args: any[]): any {
    if (obj[method] && typeof obj[method] === "function") {
        return obj[method](...args);
    } else {
        console.error(`Method ${method} not found on object ${obj}`);
    }
}
