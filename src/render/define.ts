import { Container, Graphics, Text } from "pixi.js";

function defineRenderer(rendererName: string): Function {
    return function (constructor: any) {
        const renderer = constructor.prototype;

        Object.defineProperty(renderer, "rendererName", {
            get(): string {
                return rendererName;
            },
        });
    };
}

@defineRenderer("ContainerRenderer")
export class ContainerRenderer extends Container {}

@defineRenderer("TextRenderer")
export class TextRenderer extends Text {}

@defineRenderer("GraphicsRenderer")
export class GraphicsRenderer extends Graphics {}
