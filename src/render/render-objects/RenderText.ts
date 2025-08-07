import { Text } from "cassia-engine/component";
import { Color } from "cassia-engine/math";
import { Node } from "cassia-engine/node";
import { ContainerRenderer, GraphicsRenderer, TextRenderer } from "../define";
import { RenderObject } from "./RenderObject";

export const TEXT_OVER_FLOW = {
    None: "none",
    Clamp: "clamp",
} as const;
export type TEXT_OVER_FLOW = (typeof TEXT_OVER_FLOW)[keyof typeof TEXT_OVER_FLOW];

export const TEXT_HORIZONTAL_ALIGN = {
    Left: "left",
    Center: "center",
    Right: "right",
} as const;
export type TEXT_HORIZONTAL_ALIGN = (typeof TEXT_HORIZONTAL_ALIGN)[keyof typeof TEXT_HORIZONTAL_ALIGN];

export const TEXT_VERTICAL_ALIGN = {
    Top: "top",
    Center: "center",
    Bottom: "bottom",
} as const;
export type TEXT_VERTICAL_ALIGN = (typeof TEXT_VERTICAL_ALIGN)[keyof typeof TEXT_VERTICAL_ALIGN];

export interface RenderText {
    /**
     * @internal
     */
    _textRenderer: TextRenderer;
    /**
     * @internal
     */
    _maskRenderer: GraphicsRenderer;
}

export class RenderText extends RenderObject<Text> {
    protected _onRenderCreate(): void {
        this._textRenderer = new TextRenderer();
        this._renderContainer.addChild(this._textRenderer);

        this._maskRenderer = new GraphicsRenderer();
        this._renderContainer.addChild(this._maskRenderer);

        this._renderNode.applySize = (): void => {
            const overflow = this._component.overflow;
            if (overflow === TEXT_OVER_FLOW.None) {
                // 更新文本尺寸 到 节点尺寸
                const textSize = this._textRenderer.getSize();
                this._node.size.set(textSize.width, textSize.height);

                this._textRenderer.x = 0;
                this._textRenderer.y = 0;

                this._node.applyAnchor();
                return;
            }
            if (overflow === TEXT_OVER_FLOW.Clamp) {
                // 更新节点尺寸 到 mask尺寸
                const size = this._node.size;
                const anchor = this._node.anchor;

                this._maskRenderer.clear();
                this._maskRenderer.setSize(size.width, size.height);
                this._maskRenderer.position.set(anchor.x * size.width, anchor.y * size.height);
                this._maskRenderer
                    .rect(-anchor.x * size.width, -anchor.y * size.height, size.width, size.height)
                    .fill({ color: Color.white.toHex() });

                this.applyHorizontalAlign();
                this.applyVerticalAlign();
                return;
            }
        };
        this._renderNode.applyColor = (): void => {
            const color = this._node.color.toDecimal();
            const alpha = this._node.color.a / 255;

            this._textRenderer.style.fill = color;
            this._textRenderer.alpha = alpha;
        };

        this.applyFontSize();
        this.applyFontFamily();
    }

    public applyOverflow(): void {
        const overflow = this._component.overflow;

        if (overflow === TEXT_OVER_FLOW.None) {
            this._textRenderer.mask = null;
            this._maskRenderer.visible = false;
            this._node.applySize();
            return;
        }
        if (overflow === TEXT_OVER_FLOW.Clamp) {
            this._textRenderer.mask = this._maskRenderer;
            this._maskRenderer.visible = true;
            this._node.applySize();
            return;
        }
    }

    public applyHorizontalAlign(): void {
        if (this._component.overflow !== TEXT_OVER_FLOW.Clamp) return;

        const horizontalAlign = this._component.horizontalAlign;
        const size = this._node.size;

        if (horizontalAlign === TEXT_HORIZONTAL_ALIGN.Left) {
            this._textRenderer.x = 0;
            return;
        }
        if (horizontalAlign === TEXT_HORIZONTAL_ALIGN.Center) {
            this._textRenderer.x = (size.width - this._textRenderer.width) / 2;
            return;
        }
        if (horizontalAlign === TEXT_HORIZONTAL_ALIGN.Right) {
            this._textRenderer.x = size.width - this._textRenderer.width;
            return;
        }
    }

    public applyVerticalAlign(): void {
        if (this._component.overflow !== TEXT_OVER_FLOW.Clamp) return;

        const verticalAlign = this._component.verticalAlign;
        const size = this._node.size;

        if (verticalAlign === TEXT_VERTICAL_ALIGN.Top) {
            this._textRenderer.y = 0;
            return;
        }
        if (verticalAlign === TEXT_VERTICAL_ALIGN.Center) {
            this._textRenderer.y = (size.height - this._textRenderer.height) / 2;
            return;
        }
        if (verticalAlign === TEXT_VERTICAL_ALIGN.Bottom) {
            this._textRenderer.y = size.height - this._textRenderer.height;
            return;
        }
    }

    public applyWordWrap(): void {
        this._textRenderer.style.wordWrap = this._component.wordWrap;
        this._textRenderer.style.breakWords = this._component.wordWrap;

        if (this._component.wordWrap) {
            if (this._component.overflow === TEXT_OVER_FLOW.Clamp) {
                this._component.wrapWidth = this._node.width;
            }
        }

        this._textRenderer.style.wordWrapWidth = this._component.wrapWidth;
    }

    public applyText(): void {
        this._textRenderer.text = this._component.text;
        this._node.applySize();
    }

    public applyFontSize(): void {
        this._textRenderer.style.fontSize = this._component.fontSize;
        this.applyLineHeight();
    }

    public applyLineHeight(): void {
        this._textRenderer.style.lineHeight = this._component.fontSize * this._component.lineHeight;
        this._node.applySize();
    }

    public applyFontFamily(): void {
        this._textRenderer.style.fontFamily = this._component.fontFamily;
        this._node.applySize();
    }

    public applyBlod(): void {
        this._textRenderer.style.fontWeight = this._component.isBold ? "bold" : "normal";
        this._node.applySize();
    }

    public applyItalic(): void {
        this._textRenderer.style.fontStyle = this._component.isItalic ? "italic" : "normal";
        this._node.applySize();
    }

    public applyOutline(): void {
        if (this._component.outlineEnabled) {
            const outlineColor = this._component.outlineColor.toHex();
            const outlineWidth = (this._component.outlineWidth * this._component.fontSize) / 32;

            this._textRenderer.style.stroke = {
                color: outlineColor,
                width: outlineWidth,
            };
        } else {
            this._textRenderer.style.stroke = {
                width: 0,
            };
        }
    }

    public applyShadow(): void {
        if (this._component.shadowEnabled) {
            const shadowColor = this._component.shadowColor.toHex();
            const shadowAngle = this._component.shadowOffset.toRadians();
            const shadowDistance = this._component.shadowOffset.length();

            this._textRenderer.style.dropShadow = {
                color: shadowColor,
                alpha: 1,
                angle: shadowAngle,
                distance: shadowDistance,
                blur: this._component.shadowBlur,
            };
        } else {
            this._textRenderer.style.dropShadow = false;
        }
    }
}
