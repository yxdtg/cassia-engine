import { defineComponent } from "cassia-engine/component";
import { Color, vec2, type Vec2 } from "cassia-engine/math";
import { RenderText } from "cassia-engine/render";
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
export class Text extends RenderComponent<RenderText> {
    protected onRenderCreate(): RenderText {
        return new RenderText(this);
    }

    /*************************** overflow ***************************/
    private _overflow: TEXT_OVER_FLOW = TEXT_OVER_FLOW.None;
    public get overflow(): TEXT_OVER_FLOW {
        return this._overflow;
    }
    public set overflow(value: TEXT_OVER_FLOW) {
        this._overflow = value;
        this.applyOverflow();
    }

    /**
     * @internal
     */
    public applyOverflow(): void {
        this.renderObject?.applyOverflow();
    }

    /*************************** horizontalAlign ***************************/
    private _horizontalAlign: TEXT_HORIZONTAL_ALIGN = TEXT_HORIZONTAL_ALIGN.Center;
    public get horizontalAlign(): TEXT_HORIZONTAL_ALIGN {
        return this._horizontalAlign;
    }
    public set horizontalAlign(value: TEXT_HORIZONTAL_ALIGN) {
        this._horizontalAlign = value;
        this.applyHorizontalAlign();
    }

    /**
     * @internal
     */
    public applyHorizontalAlign(): void {
        this.renderObject?.applyHorizontalAlign();
    }

    /*************************** verticalAlign ***************************/
    private _verticalAlign: TEXT_VERTICAL_ALIGN = TEXT_VERTICAL_ALIGN.Center;
    public get verticalAlign(): TEXT_VERTICAL_ALIGN {
        return this._verticalAlign;
    }
    public set verticalAlign(value: TEXT_VERTICAL_ALIGN) {
        this._verticalAlign = value;
        this.applyVerticalAlign();
    }

    /**
     * @internal
     */
    public applyVerticalAlign(): void {
        this.renderObject?.applyVerticalAlign();
    }

    /*************************** wordWrap ***************************/
    private _wordWrap: boolean = false;
    public get wordWrap(): boolean {
        return this._wordWrap;
    }
    public set wordWrap(value: boolean) {
        this._wordWrap = value;
        this.applyWordWrap();
    }

    private _wrapWidth: number = 200;
    public get wrapWidth(): number {
        return this._wrapWidth;
    }
    public set wrapWidth(value: number) {
        this._wrapWidth = value;
        this.applyWordWrap();
    }

    /**
     * @internal
     */
    public applyWordWrap(): void {
        this.renderObject?.applyWordWrap();
    }

    /*************************** text ***************************/
    private _text: string = "";
    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
        this.applyText();
    }

    /**
     * @internal
     */
    public applyText(): void {
        this.renderObject?.applyText();
    }

    /*************************** fontSize ***************************/
    private _fontSize: number = 32;
    public get fontSize(): number {
        return this._fontSize;
    }
    public set fontSize(value: number) {
        this._fontSize = value;
        this.applyFontSize();
    }

    /**
     * @internal
     */
    public applyFontSize(): void {
        this.renderObject?.applyFontSize();
        this.applyLineHeight();
    }

    /*************************** lineHeight ***************************/
    private _lineHeight: number = 1;
    public get lineHeight(): number {
        return this._lineHeight;
    }
    public set lineHeight(value: number) {
        this._lineHeight = value;
        this.applyLineHeight();
    }

    /**
     * @internal
     */
    public applyLineHeight(): void {
        this.renderObject?.applyLineHeight();
    }

    /*************************** fontFamily ***************************/
    private _fontFamily: string = "Arial";
    public get fontFamily(): string {
        return this._fontFamily;
    }
    public set fontFamily(value: string) {
        this._fontFamily = value;
        this.applyFontFamily();
    }

    /**
     * @internal
     */
    public applyFontFamily(): void {
        this.renderObject?.applyFontFamily();
    }

    /*************************** isBold ***************************/
    private _isBold: boolean = false;
    public get isBold(): boolean {
        return this._isBold;
    }
    public set isBold(value: boolean) {
        this._isBold = value;
        this.applyBlod();
    }

    /**
     * @internal
     */
    public applyBlod(): void {
        this.renderObject?.applyBlod();
    }

    /*************************** isItalic ***************************/
    private _isItalic: boolean = false;
    public get isItalic(): boolean {
        return this._isItalic;
    }
    public set isItalic(value: boolean) {
        this._isItalic = value;
        this.applyIsItalic();
    }

    /**
     * @internal
     */
    public applyIsItalic(): void {
        this.renderObject?.applyItalic();
    }

    /*************************** outline ***************************/
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

    /**
     * @internal
     */
    public applyOutline(): void {
        this.renderObject?.applyOutline();
    }

    /*************************** shadow ***************************/
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

    /**
     * @internal
     */
    public applyShadow(): void {
        this.renderObject?.applyShadow();
    }
}
