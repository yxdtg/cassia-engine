import { defineComponent } from "cassia-engine/component";
import { Bounds } from "cassia-engine/math";
import { RenderSprite, SPRITE_TYPE } from "cassia-engine/render";
import { RenderComponent } from "./RenderComponent";
import type { TextureResource } from "cassia-engine/resource";

@defineComponent({ componentName: "Sprite" })
export class Sprite extends RenderComponent<RenderSprite> {
    protected _onRenderCreate(): void {
        this._renderObject = new RenderSprite(this);
    }

    private _spriteType: SPRITE_TYPE = SPRITE_TYPE.Simple;
    public get spriteType(): SPRITE_TYPE {
        return this._spriteType;
    }
    public set spriteType(value: SPRITE_TYPE) {
        this._spriteType = value;
        this.applySpriteType();
    }

    public applySpriteType(): void {
        this._renderObject.applySpriteType();
    }

    private _texture: TextureResource | null = null;
    public get texture(): TextureResource | null {
        return this._texture;
    }
    public set texture(value: TextureResource | null) {
        this._texture = value;
        this.applyTexture();
    }

    public applyTexture(): void {
        this._renderObject.applyTexture();
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
    public setNineSliceBounds(...args: any[]): void {
        this._nineSliceBounds.set(...args);
        this.applyNineSliceBounds();
    }

    public applyNineSliceBounds(): void {
        this._renderObject.applyNineSliceBounds();
    }
}
