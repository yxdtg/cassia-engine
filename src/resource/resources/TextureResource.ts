import { Resource } from "./Resource";
import type { RESOURCE_TYPE } from "../define";

export class TextureResource extends Resource<typeof RESOURCE_TYPE.Texture> {
    protected override onInit(): void {
        const options = this.resourceInfo.options;
        if (!options) return;

        const source = this.data.source;

        if (options.scaleMode) {
            source.scaleMode = options.scaleMode;
        }
    }
}
