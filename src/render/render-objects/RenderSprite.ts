import type { Sprite } from "cassia-engine/component";
import { RenderObject } from "./RenderObject";
import {
    isNineSliceSpriteRenderer,
    isSpriteRenderer,
    isTilingSpriteRenderer,
    NineSliceSpriteRenderer,
    SpriteRenderer,
    TilingSpriteRenderer,
} from "../define";

export const SPRITE_TYPE = {
    Simple: "simple",
    NineSlice: "nine-slice",
    Tiling: "tiling",
} as const;
export type SPRITE_TYPE = (typeof SPRITE_TYPE)[keyof typeof SPRITE_TYPE];

export interface RenderSprite {
    /**
     * @internal
     */
    _spriteRenderer: SpriteRenderer | NineSliceSpriteRenderer | TilingSpriteRenderer | null;
}

export class RenderSprite extends RenderObject<Sprite> {
    protected _onRenderCreate(): void {
        this._spriteRenderer = new SpriteRenderer();
        this._renderContainer.addChild(this._spriteRenderer);

        this._renderNode.applySize = (): void => {
            if (!this._spriteRenderer) return;

            const size = this._node.size;
            this._spriteRenderer.setSize(size.width, size.height);
        };
        this._renderNode.applyColor = (): void => {
            if (!this._spriteRenderer) return;

            const color = this._node.color.toDecimal();
            const alpha = this._node.color.a / 255;

            this._spriteRenderer.tint = color;
            this._spriteRenderer.alpha = alpha;
        };
    }

    public applySpriteType(): void {
        const texture = this._component.texture;

        if (this._component.spriteType === SPRITE_TYPE.Simple) {
            if (!this._spriteRenderer || !isSpriteRenderer(this._spriteRenderer)) {
                this._spriteRenderer?.destroy();
                this._spriteRenderer = null;

                this._spriteRenderer = new SpriteRenderer();
                this._renderContainer.addChild(this._spriteRenderer);
            }
        }

        if (this._component.spriteType === SPRITE_TYPE.NineSlice) {
            if (!this._spriteRenderer || !isNineSliceSpriteRenderer(this._spriteRenderer)) {
                this._spriteRenderer?.destroy();
                this._spriteRenderer = null;

                if (texture) {
                    this._spriteRenderer = new NineSliceSpriteRenderer(texture.data);
                    this._renderContainer.addChild(this._spriteRenderer);

                    this.applyNineSliceBounds();
                }
            }
        }

        if (this._component.spriteType === SPRITE_TYPE.Tiling) {
            if (!this._spriteRenderer || !isTilingSpriteRenderer(this._spriteRenderer)) {
                this._spriteRenderer?.destroy();
                this._spriteRenderer = null;

                this._spriteRenderer = new TilingSpriteRenderer();
                this._renderContainer.addChild(this._spriteRenderer);
            }
        }

        this.applyTexture();
    }

    public applyTexture(): void {
        const texture = this._component.texture;

        if (this._component.spriteType === SPRITE_TYPE.NineSlice && !this._spriteRenderer) {
            if (!texture) return;

            this._spriteRenderer = new NineSliceSpriteRenderer(texture.data);
            this._renderContainer.addChild(this._spriteRenderer);

            this.applyNineSliceBounds();
        }

        if (!this._spriteRenderer) return;

        this._spriteRenderer.texture = texture?.data!;
        this._applySizeAndColor();
    }

    public applyNineSliceBounds(): void {
        if (this._component.spriteType !== SPRITE_TYPE.NineSlice) return;
        if (!this._spriteRenderer) return;

        const bounds = this._component.nineSliceBounds;

        const renderer = this._spriteRenderer as NineSliceSpriteRenderer;
        renderer.topHeight = bounds.top;
        renderer.bottomHeight = bounds.bottom;
        renderer.leftWidth = bounds.left;
        renderer.rightWidth = bounds.right;
    }
}
