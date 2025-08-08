export function getOs(): string {
    if (!navigator) return "unknown";

    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "windows";
    if (userAgent.includes("Mac")) return "macos";
    if (userAgent.includes("Linux")) return "linux";
    if (userAgent.includes("Android")) return "android";
    if (userAgent.includes("iPhone")) return "ios";
    return "unknown";
}
