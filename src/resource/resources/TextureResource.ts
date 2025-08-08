import type { Texture } from "pixi.js";
import { Resource } from "./Resource";

export class TextureResource extends Resource<Texture> {
    protected _onInit(): void {}
}
