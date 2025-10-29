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

export const SPRITE_RENDER_TYPE = {
    Simple: "simple",
    NineSlice: "nine-slice",
    Tiling: "tiling",
} as const;
export type SPRITE_RENDER_TYPE = (typeof SPRITE_RENDER_TYPE)[keyof typeof SPRITE_RENDER_TYPE];

export interface RenderSprite {
    /**
     * @internal
     */
    _spriteRenderer: SpriteRenderer | NineSliceSpriteRenderer | TilingSpriteRenderer | null;
}

export class RenderSprite extends RenderObject<Sprite> {
    protected override onRenderCreate(): void {
        this._spriteRenderer = new SpriteRenderer();
        this.renderContainer.addChild(this._spriteRenderer);

        this.renderNode.applySize = (): void => {
            if (!this._spriteRenderer) return;

            const size = this.node.size;
            this._spriteRenderer.setSize(size.width, size.height);
        };
        this.renderNode.applyColor = (): void => {
            if (!this._spriteRenderer) return;

            const color = this.node.color.toDecimal();
            const alpha = this.node.color.a / 255;

            this._spriteRenderer.tint = color;
            this._spriteRenderer.alpha = alpha;
        };
    }

    public applyRenderType(): void {
        const texture = this.component.texture;
        const renderType = this.component.renderType;

        if (renderType === SPRITE_RENDER_TYPE.Simple) {
            if (!this._spriteRenderer || !isSpriteRenderer(this._spriteRenderer)) {
                this._spriteRenderer?.destroy();
                this._spriteRenderer = null;

                this._spriteRenderer = new SpriteRenderer();
                this.renderContainer.addChild(this._spriteRenderer);
            }
        }

        if (renderType === SPRITE_RENDER_TYPE.NineSlice) {
            if (!this._spriteRenderer || !isNineSliceSpriteRenderer(this._spriteRenderer)) {
                this._spriteRenderer?.destroy();
                this._spriteRenderer = null;

                if (texture) {
                    this._spriteRenderer = new NineSliceSpriteRenderer(texture.data);
                    this.renderContainer.addChild(this._spriteRenderer);

                    this.applyNineSliceBounds();
                }
            }
        }

        if (renderType === SPRITE_RENDER_TYPE.Tiling) {
            if (!this._spriteRenderer || !isTilingSpriteRenderer(this._spriteRenderer)) {
                this._spriteRenderer?.destroy();
                this._spriteRenderer = null;

                this._spriteRenderer = new TilingSpriteRenderer();
                this.renderContainer.addChild(this._spriteRenderer);
            }
        }

        this.applyTexture();
    }

    public applyTexture(): void {
        const texture = this.component.texture;

        if (this.component.renderType === SPRITE_RENDER_TYPE.NineSlice && !this._spriteRenderer) {
            if (!texture) return;

            this._spriteRenderer = new NineSliceSpriteRenderer(texture.data);
            this.renderContainer.addChild(this._spriteRenderer);

            this.applyNineSliceBounds();
        }

        if (!this._spriteRenderer) return;

        this._spriteRenderer.texture = texture?.data!;
        this.applySizeAndColor();
    }

    public applyNineSliceBounds(): void {
        if (this.component.renderType !== SPRITE_RENDER_TYPE.NineSlice) return;
        if (!this._spriteRenderer) return;

        const bounds = this.component.nineSliceBounds;

        const renderer = this._spriteRenderer as NineSliceSpriteRenderer;
        renderer.topHeight = bounds.top;
        renderer.bottomHeight = bounds.bottom;
        renderer.leftWidth = bounds.left;
        renderer.rightWidth = bounds.right;
    }
}
