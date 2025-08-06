import { Component, defineComponent } from "cassia-engine/component";
import { Color, vec2, type Vec2 } from "cassia-engine/math";
import { ContainerRenderer, GraphicsRenderer, TextRenderer } from "cassia-engine/render";
import { RenderComponent } from "./RenderComponent";

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

@defineComponent({ componentName: "Text" })
export class Text extends RenderComponent {
    private _renderContainer!: ContainerRenderer;
    protected _onRenderCreate(): void {
        const renderNode = this.node.renderNode;
        this._renderContainer = renderNode.renderContainer;

        this._textRenderer = new TextRenderer();
        this._renderContainer.addChild(this._textRenderer);

        this._maskRenderer = new GraphicsRenderer();
        this._renderContainer.addChild(this._maskRenderer);

        renderNode.applySize = (): void => {
            const overflow = this._overflow;
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
        renderNode.applyColor = (): void => {
            const color = this.node.color.toDecimal();
            const alpha = this.node.color.a / 255;

            this._textRenderer.style.fill = color;
            this._textRenderer.alpha = alpha;
        };

        this.applyFontSize();
        this.applyFontFamily();
    }

    private _textRenderer!: TextRenderer;
    private _maskRenderer!: GraphicsRenderer;

    public applyOverflow(): void {
        const overflow = this._overflow;

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
    private _overflow: TEXT_OVER_FLOW = TEXT_OVER_FLOW.None;

    public get overflow(): TEXT_OVER_FLOW {
        return this._overflow;
    }
    public set overflow(value: TEXT_OVER_FLOW) {
        this._overflow = value;
        this.applyOverflow();
    }

    public applyHorizontalAlign(): void {
        if (this._overflow !== TEXT_OVER_FLOW.Clamp) return;

        const horizontalAlign = this._horizontalAlign;
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
    private _horizontalAlign: TEXT_HORIZONTAL_ALIGN = TEXT_HORIZONTAL_ALIGN.Center;

    public get horizontalAlign(): TEXT_HORIZONTAL_ALIGN {
        return this._horizontalAlign;
    }
    public set horizontalAlign(value: TEXT_HORIZONTAL_ALIGN) {
        this._horizontalAlign = value;
        this.applyHorizontalAlign();
    }

    public applyVerticalAlign(): void {
        if (this._overflow !== TEXT_OVER_FLOW.Clamp) return;

        const verticalAlign = this._verticalAlign;
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
    private _verticalAlign: TEXT_VERTICAL_ALIGN = TEXT_VERTICAL_ALIGN.Center;

    public get verticalAlign(): TEXT_VERTICAL_ALIGN {
        return this._verticalAlign;
    }
    public set verticalAlign(value: TEXT_VERTICAL_ALIGN) {
        this._verticalAlign = value;
        this.applyVerticalAlign();
    }

    public applyWordWrap(): void {
        this._textRenderer.style.wordWrap = this._wordWrap;
        this._textRenderer.style.breakWords = this._wordWrap;

        if (this._wordWrap) {
            if (this._overflow === TEXT_OVER_FLOW.Clamp) {
                this._wrapWidth = this.node.width;
            }
        }

        this._textRenderer.style.wordWrapWidth = this._wrapWidth;
    }
    private _wordWrap: boolean = false;

    public get wordWrap(): boolean {
        return this._wordWrap;
    }
    public set wordWrap(value: boolean) {
        this._wordWrap = value;
        this.applyWordWrap();
    }

    public applyWrapWidth(): void {
        this.applyWordWrap();
    }
    public _wrapWidth: number = 200;
    public get wrapWidth(): number {
        return this._wrapWidth;
    }
    public set wrapWidth(value: number) {
        this._wrapWidth = value;
        this.applyWrapWidth();
    }

    public applyText(): void {
        this._textRenderer.text = this._text;
        this.node.applySize();
    }
    private _text: string = "";
    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
        this.applyText();
    }

    public applyFontSize(): void {
        this._textRenderer.style.fontSize = this._fontSize;
        this.applyLineHeight();
    }
    private _fontSize: number = 32;
    public get fontSize(): number {
        return this._fontSize;
    }
    public set fontSize(value: number) {
        this._fontSize = value;
        this.applyFontSize();
    }

    public applyLineHeight(): void {
        this._textRenderer.style.lineHeight = this._fontSize * this._lineHeight;
        this.node.applySize();
    }
    private _lineHeight: number = 1;
    public get lineHeight(): number {
        return this._lineHeight;
    }
    public set lineHeight(value: number) {
        this._lineHeight = value;
        this.applyLineHeight();
    }

    public applyFontFamily(): void {
        this._textRenderer.style.fontFamily = this._fontFamily;
        this.node.applySize();
    }
    private _fontFamily: string = "Arial";
    public get fontFamily(): string {
        return this._fontFamily;
    }
    public set fontFamily(value: string) {
        this._fontFamily = value;
        this.applyFontFamily();
    }

    public applyBlod(): void {
        this._textRenderer.style.fontWeight = this._isBold ? "bold" : "normal";
        this.node.applySize();
    }
    private _isBold: boolean = false;
    public get isBold(): boolean {
        return this._isBold;
    }
    public set isBold(value: boolean) {
        this._isBold = value;
        this.applyBlod();
    }

    public applyItalic(): void {
        this._textRenderer.style.fontStyle = this._isItalic ? "italic" : "normal";
        this.node.applySize();
    }
    private _isItalic: boolean = false;
    public get isItalic(): boolean {
        return this._isItalic;
    }
    public set isItalic(value: boolean) {
        this._isItalic = value;
        this.applyItalic();
    }

    public applyOutline(): void {
        if (this._outlineEnabled) {
            const outlineColor = this._outlineColor.toHex();
            const outlineWidth = (this._outlineWidth * this._fontSize) / 32;

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
    private _outlineEnabled: boolean = false;
    public get outlineEnabled(): boolean {
        return this._outlineEnabled;
    }
    public set outlineEnabled(value: boolean) {
        this._outlineEnabled = value;
        this.applyOutline();
    }

    private _outlineColor: Color = Color.black;
    public get outlineColor(): Color {
        return this._outlineColor;
    }
    public set outlineColor(value: Color) {
        this._outlineColor = value;
        this.applyOutline();
    }

    private _outlineWidth: number = 2;
    public get outlineWidth(): number {
        return this._outlineWidth;
    }
    public set outlineWidth(value: number) {
        this._outlineWidth = value;
        this.applyOutline();
    }

    public applyShadow(): void {
        if (this._shadowEnabled) {
            const shadowColor = this._shadowColor.toHex();
            const shadowAngle = this._shadowOffset.toRadians();
            const shadowDistance = this._shadowOffset.length();

            this._textRenderer.style.dropShadow = {
                color: shadowColor,
                alpha: 1,
                angle: shadowAngle,
                distance: shadowDistance,
                blur: this._shadowBlur,
            };
        } else {
            this._textRenderer.style.dropShadow = false;
        }
    }
    private _shadowEnabled: boolean = false;
    public get shadowEnabled(): boolean {
        return this._shadowEnabled;
    }
    public set shadowEnabled(value: boolean) {
        this._shadowEnabled = value;
        this.applyShadow();
    }

    private _shadowColor: Color = Color.black;

    public get shadowColor(): Color {
        return this._shadowColor;
    }
    public set shadowColor(value: Color) {
        this._shadowColor = value;
        this.applyShadow();
    }

    private _shadowOffset: Vec2 = vec2(2, 2);

    public get shadowOffset(): Vec2 {
        return this._shadowOffset;
    }
    public set shadowOffset(value: Vec2) {
        this._shadowOffset = value;
        this.applyShadow();
    }

    public get shadowOffsetX(): number {
        return this._shadowOffset.x;
    }
    public set shadowOffsetX(value: number) {
        this._shadowOffset.x = value;
        this.applyShadow();
    }

    public get shadowOffsetY(): number {
        return this._shadowOffset.y;
    }
    public set shadowOffsetY(value: number) {
        this._shadowOffset.y = value;
        this.applyShadow();
    }

    private _shadowBlur: number = 2;

    public get shadowBlur(): number {
        return this._shadowBlur;
    }
    public set shadowBlur(value: number) {
        this._shadowBlur = value;
        this.applyShadow();
    }
}
