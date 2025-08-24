import { DEPRECATED_SCALE_MODES, type Texture } from "pixi.js";
import { Resource } from "./Resource";

export class TextureResource extends Resource<Texture> {
    protected onInit(): void {
        const options = this.resourceInfo.options;
        const pixelStyle = options?.pixelStyle ?? false;

        const texture = this.data;
        const source = texture.source;

        if (pixelStyle) {
            source.scaleMode = DEPRECATED_SCALE_MODES.NEAREST;
        }
    }
}
