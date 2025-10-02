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

function pad(num: number, size: number): string {
    return num.toString().padStart(size, "0");
}

export function formatMsToHours(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return pad(hours, 2);
}
export function formatMsToMinutes(ms: number): string {
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return pad(minutes, 2);
}
export function formatMsToSeconds(ms: number): string {
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return pad(seconds, 2);
}

export function formatMsToHoursMinutesSeconds(ms: number): string {
    return `${formatMsToHours(ms)}:${formatMsToMinutes(ms)}:${formatMsToSeconds(ms)}`;
}
export function formatMsToHoursMinutes(ms: number): string {
    return `${formatMsToHours(ms)}:${formatMsToMinutes(ms)}`;
}
export function formatMsToMinutesSeconds(ms: number): string {
    return `${formatMsToMinutes(ms)}:${formatMsToSeconds(ms)}`;
}

export function callAnyMethod(obj: any, method: string, ...args: any[]): any {
    if (obj[method] && typeof obj[method] === "function") {
        return obj[method](...args);
    } else {
        console.error(`Method ${method} not found on object ${obj}`);
    }
}

/**
 * 注意如果是event 则必须要 event.x 和 event.y 而不是 event.clientX 和 event.clientY 特别注意
 * @param x 如果是event 必须要event.x
 * @param y 如果是event 必须要event.y
 * @param element
 * @returns 是否在元素内
 */
export function isPointInElement(x: number, y: number, element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
        x >= rect.left + window.scrollX &&
        x <= rect.right + window.scrollX &&
        y >= rect.top + window.scrollY &&
        y <= rect.bottom + window.scrollY
    );
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

export function getOs(): OS_TYPE {
    if (typeof navigator === "undefined") return OS_TYPE.Unknown;

    const userAgent = navigator.userAgent.toLowerCase();

    if (/win(dows )?/i.test(userAgent)) return OS_TYPE.Windows;
    if (/macintosh|mac os x/i.test(userAgent)) return OS_TYPE.MacOS;
    if (/linux/i.test(userAgent)) return OS_TYPE.Linux;
    if (/android/i.test(userAgent)) return OS_TYPE.Android;
    if (/iphone|ipad|ipod/i.test(userAgent)) return OS_TYPE.iOS;

    return OS_TYPE.Unknown;
}

export function isMobile(): boolean {
    if (typeof navigator === "undefined") return false;

    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|iphone|ipod|blackberry|windows phone/i.test(ua);
    const isIPad = /macintosh/.test(ua) && "ontouchend" in document && navigator.maxTouchPoints > 0;

    return isMobileUA || isIPad;
}

export function isBottomInput(): boolean {
    if (isMobile() && window.visualViewport) return true;
    return false;
}
