import { defineComponent } from "cassia-engine/component";
import { Bounds } from "cassia-engine/math";
import { RenderSprite, SPRITE_RENDER_TYPE } from "cassia-engine/render";
import { RenderComponent } from "./RenderComponent";
import type { TextureResource } from "cassia-engine/resource";

@defineComponent({ componentName: "Sprite" })
export class Sprite extends RenderComponent<RenderSprite> {
    protected onRenderCreate(): RenderSprite {
        return new RenderSprite(this);
    }

    private _renderType: SPRITE_RENDER_TYPE = SPRITE_RENDER_TYPE.Simple;
    public get renderType(): SPRITE_RENDER_TYPE {
        return this._renderType;
    }
    public set renderType(value: SPRITE_RENDER_TYPE) {
        this._renderType = value;
        this.applyRenderType();
    }

    /**
     * @internal
     */
    public applyRenderType(): void {
        this.renderObject.applyRenderType();
    }

    private _texture: TextureResource | null = null;
    public get texture(): TextureResource | null {
        return this._texture;
    }
    public set texture(value: TextureResource | null) {
        this._texture = value;
        this.applyTexture();
    }

    /**
     * @internal
     */
    public applyTexture(): void {
        this.renderObject.applyTexture();
    }

    private _nineSliceBounds: Bounds = Bounds.zero;
    public get nineSliceBounds(): Bounds {
        return this._nineSliceBounds;
    }
    public set nineSliceBounds(value: Bounds) {
        this._nineSliceBounds.set(value);
        this.applyNineSliceBounds();
    }

    public get nineSliceTop(): number {
        return this._nineSliceBounds.top;
    }
    public set nineSliceTop(value: number) {
        this._nineSliceBounds.top = value;
        this.applyNineSliceBounds();
    }

    public get nineSliceBottom(): number {
        return this._nineSliceBounds.bottom;
    }
    public set nineSliceBottom(value: number) {
        this._nineSliceBounds.bottom = value;
        this.applyNineSliceBounds();
    }

    public get nineSliceLeft(): number {
        return this._nineSliceBounds.left;
    }
    public set nineSliceLeft(value: number) {
        this._nineSliceBounds.left = value;
        this.applyNineSliceBounds();
    }

    public get nineSliceRight(): number {
        return this._nineSliceBounds.right;
    }
    public set nineSliceRight(value: number) {
        this._nineSliceBounds.right = value;
        this.applyNineSliceBounds();
    }

    public setNineSliceBounds(bounds?: Bounds): void;
    public setNineSliceBounds(top?: number, bottom?: number, left?: number, right?: number): void;
    public setNineSliceBounds(boundsOrTop?: Bounds | number, bottom?: number, left?: number, right?: number): void;
    public setNineSliceBounds(...args: any[]): void {
        this._nineSliceBounds.set(...args);
        this.applyNineSliceBounds();
    }

    /**
     * @internal
     */
    public applyNineSliceBounds(): void {
        this.renderObject.applyNineSliceBounds();
    }
}
