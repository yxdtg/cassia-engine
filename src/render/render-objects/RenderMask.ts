import type { Mask } from "cassia-engine/component";
import { RenderObject } from "./RenderObject";
import { GraphicsRenderer, isGraphicsRenderer, isSpriteRenderer, SpriteRenderer } from "../define";
import { color } from "cassia-engine/math";

export const MASK_TYPE = {
    Rect: "rect",
    Ellipse: "ellipse",
    Texture: "texture",
} as const;
export type MASK_TYPE = (typeof MASK_TYPE)[keyof typeof MASK_TYPE];

export interface RenderMask {
    /**
     * @internal
     */
    _maskRenderer: GraphicsRenderer | SpriteRenderer;
}

export class RenderMask extends RenderObject<Mask> {
    protected override onRenderCreate(): void {
        this._maskRenderer = new GraphicsRenderer();
        this.renderContainer.addChild(this._maskRenderer);

        this.renderNode.applySize = (): void => {
            const size = this.node.size;
            this._maskRenderer.setSize(size.width, size.height);

            this.applyMask();
        };
    }

    public applyMask(): void {
        const nodeRenderer = this.renderNode.renderer;
        if (!nodeRenderer) return;

        if (this.component.maskType === MASK_TYPE.Texture) {
            if (!this._maskRenderer || !isSpriteRenderer(this._maskRenderer)) {
                this._maskRenderer?.destroy();
                this._maskRenderer = null!;

                this._maskRenderer = new SpriteRenderer();
                this.renderContainer.addChild(this._maskRenderer);

                nodeRenderer.setMask({
                    mask: this._maskRenderer,
                    inverse: this.component.inverse,
                });
            }
        } else {
            if (!this._maskRenderer || !isGraphicsRenderer(this._maskRenderer)) {
                this._maskRenderer?.destroy();
                this._maskRenderer = null!;

                this._maskRenderer = new GraphicsRenderer();
                this.renderContainer.addChild(this._maskRenderer);

                nodeRenderer.setMask({
                    mask: this._maskRenderer,
                    inverse: this.component.inverse,
                });
            }
        }

        if (isGraphicsRenderer(this._maskRenderer)) {
            const renderer = this._maskRenderer as GraphicsRenderer;
            renderer.clear();

            const size = this.node.size;

            if (this.component.maskType === MASK_TYPE.Rect) {
                renderer.rect(0, 0, size.width, size.height).fill({
                    color: color(255, 255, 255).toHex(),
                    alpha: 0,
                });
            } else {
                if (this.component.maskType === MASK_TYPE.Ellipse) {
                    renderer.ellipse(size.width * 0.5, size.height * 0.5, size.width * 0.5, size.height * 0.5).fill({
                        color: color(255, 255, 255).toHex(),
                        alpha: 0,
                    });
                }
            }
        } else {
            if (isSpriteRenderer(this._maskRenderer)) {
                const renderer = this._maskRenderer as SpriteRenderer;
                const texture = this.component.maskTexture?.data ?? null!;
                renderer.texture = texture;
            }
        }

        const size = this.node.size;
        this._maskRenderer.setSize(size.width, size.height);

        nodeRenderer.setMask({
            mask: this._maskRenderer,
            inverse: this.component.inverse,
        });
    }

    public clearMask(): void {
        const nodeRenderer = this.renderNode.renderer;
        if (!nodeRenderer) return;

        nodeRenderer.mask = null;
    }
}
