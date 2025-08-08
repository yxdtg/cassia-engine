import { Container, Graphics, NineSliceSprite, Sprite, Text, TilingSprite } from "pixi.js";

function defineRenderer(rendererName: string): Function {
    return function (constructor: any) {
        const rendererClassPrototype = constructor.prototype;

        Object.defineProperty(rendererClassPrototype, "rendererName", {
            get: (): string => rendererName,
        });
    };
}

@defineRenderer("ContainerRenderer")
export class ContainerRenderer extends Container {}

@defineRenderer("GraphicsRenderer")
export class GraphicsRenderer extends Graphics {}

@defineRenderer("TextRenderer")
export class TextRenderer extends Text {}

@defineRenderer("SpriteRenderer")
export class SpriteRenderer extends Sprite {}

@defineRenderer("NineSliceSpriteRenderer")
export class NineSliceSpriteRenderer extends NineSliceSprite {}

@defineRenderer("TilingSpriteRenderer")
export class TilingSpriteRenderer extends TilingSprite {}

export function isContainerRenderer(renderer: any): boolean {
    return renderer.rendererName === "ContainerRenderer";
}

export function isGraphicsRenderer(renderer: any): boolean {
    return renderer.rendererName === "GraphicsRenderer";
}

export function isSpriteRenderer(renderer: any): boolean {
    return renderer.rendererName === "SpriteRenderer";
}

export function isNineSliceSpriteRenderer(renderer: any): boolean {
    return renderer.rendererName === "NineSliceSpriteRenderer";
}

export function isTilingSpriteRenderer(renderer: any): boolean {
    return renderer.rendererName === "TilingSpriteRenderer";
}

export function isTextRenderer(renderer: any): boolean {
    return renderer.rendererName === "TextRenderer";
}
