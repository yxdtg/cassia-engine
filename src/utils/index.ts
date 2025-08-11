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

export function defineObjectGetter(obj: any, propertyName: string, value: any): void {
    Object.defineProperty(obj, propertyName, {
        get: () => value,
    });
}
