import { Text } from "cassia-engine/component";
import { Color } from "cassia-engine/math";
import { GraphicsRenderer, TextRenderer } from "../define";
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
    protected onRenderCreate(): void {
        this._textRenderer = new TextRenderer();
        this.renderContainer.addChild(this._textRenderer);

        this._maskRenderer = new GraphicsRenderer();
        this.renderContainer.addChild(this._maskRenderer);

        this.renderNode.applySize = (): void => {
            const overflow = this.component.overflow;
            if (overflow === TEXT_OVER_FLOW.None) {
                // 更新文本尺寸 到 节点尺寸
                const textSize = this._textRenderer.getSize();
                this.node.size.set(textSize.width, textSize.height);

                this._textRenderer.x = 0;
                this._textRenderer.y = 0;

                this.node.applyAnchor();
                return;
            }
            if (overflow === TEXT_OVER_FLOW.Clamp) {
                // 更新节点尺寸 到 mask尺寸
                const size = this.node.size;
                const anchor = this.node.anchor;

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
        this.renderNode.applyColor = (): void => {
            const color = this.node.color.toDecimal();
            const alpha = this.node.color.a / 255;

            this._textRenderer.style.fill = color;
            this._textRenderer.alpha = alpha;
        };

        this.applyFontSize();
        this.applyFontFamily();
    }

    public applyOverflow(): void {
        const overflow = this.component.overflow;

        if (overflow === TEXT_OVER_FLOW.None) {
            this._textRenderer.mask = null;
            this._maskRenderer.visible = false;
            this.node.applySize();
            return;
        }
        if (overflow === TEXT_OVER_FLOW.Clamp) {
            this._textRenderer.mask = this._maskRenderer;
            this._maskRenderer.visible = true;
            this.node.applySize();
            return;
        }
    }

    public applyHorizontalAlign(): void {
        if (this.component.overflow !== TEXT_OVER_FLOW.Clamp) return;

        const horizontalAlign = this.component.horizontalAlign;
        const size = this.node.size;

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
        if (this.component.overflow !== TEXT_OVER_FLOW.Clamp) return;

        const verticalAlign = this.component.verticalAlign;
        const size = this.node.size;

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
        this._textRenderer.style.wordWrap = this.component.wordWrap;
        this._textRenderer.style.breakWords = this.component.wordWrap;

        if (this.component.wordWrap) {
            if (this.component.overflow === TEXT_OVER_FLOW.Clamp) {
                this.component.wrapWidth = this.node.width;
            }
        }

        this._textRenderer.style.wordWrapWidth = this.component.wrapWidth;
    }

    public applyText(): void {
        this._textRenderer.text = this.component.text;
        this.node.applySize();
    }

    public applyFontSize(): void {
        this._textRenderer.style.fontSize = this.component.fontSize;
        this.applyLineHeight();
    }

    public applyLineHeight(): void {
        this._textRenderer.style.lineHeight = this.component.fontSize * this.component.lineHeight;
        this.node.applySize();
    }

    public applyFontFamily(): void {
        this._textRenderer.style.fontFamily = this.component.fontFamily;
        this.node.applySize();
    }

    public applyBlod(): void {
        this._textRenderer.style.fontWeight = this.component.isBold ? "bold" : "normal";
        this.node.applySize();
    }

    public applyItalic(): void {
        this._textRenderer.style.fontStyle = this.component.isItalic ? "italic" : "normal";
        this.node.applySize();
    }

    public applyOutline(): void {
        if (this.component.outlineEnabled) {
            const outlineColor = this.component.outlineColor.toHex();
            const outlineWidth = (this.component.outlineWidth * this.component.fontSize) / 32;

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
        if (this.component.shadowEnabled) {
            const shadowColor = this.component.shadowColor.toHex();
            const shadowAngle = this.component.shadowOffset.toRadians();
            const shadowDistance = this.component.shadowOffset.length();

            this._textRenderer.style.dropShadow = {
                color: shadowColor,
                alpha: 1,
                angle: shadowAngle,
                distance: shadowDistance,
                blur: this.component.shadowBlur,
            };
        } else {
            this._textRenderer.style.dropShadow = false;
        }
    }
}
