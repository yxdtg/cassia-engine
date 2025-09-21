export function createBuiltinCanvas(): HTMLCanvasElement {
    const document = window.document;
    if (!document) throw new Error("document is not defined");

    const bodyStyle = document.body.style;
    bodyStyle.margin = "0";
    bodyStyle.padding = "0";
    bodyStyle.overflow = "hidden";
    bodyStyle.touchAction = "none";

    const canvasContainer = document.createElement("div");
    canvasContainer.id = "canvas-container";
    canvasContainer.style.position = "relative";

    const canvasContainerStyle = canvasContainer.style;
    canvasContainerStyle.width = "100vw";
    canvasContainerStyle.height = "100vh";
    canvasContainerStyle.display = "flex";
    canvasContainerStyle.justifyContent = "center";
    canvasContainerStyle.alignItems = "center";

    const canvas = document.createElement("canvas");
    canvasContainer.appendChild(canvas);

    document.body.appendChild(canvasContainer);

    return canvas;
}
