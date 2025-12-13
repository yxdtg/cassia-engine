import { renderSystem, timeSystem, IS_BOTTOM_INPUT } from "cassia-engine";
import { Component, defineComponent, Text } from "cassia-engine/component";
import { type IPointerEvent, KEY_CODE } from "cassia-engine/input";
import { Node, NODE_EVENT_TYPE } from "cassia-engine/node";
import { TEXT_ALIGN_HORIZONTAL_TYPE, TEXT_OVER_FLOW_TYPE } from "cassia-engine/render";

@defineComponent({ componentName: "InputField", useEvents: [NODE_EVENT_TYPE.PointerUp] })
export class InputField extends Component {
    private _el: HTMLInputElement | null = null;

    private _textNode: Node | null = null;
    public get textNode(): Node | null {
        return this._textNode;
    }
    public set textNode(value: Node | null) {
        this._textNode = value;

        if (!this._textNode) return;

        const text = this._textNode.getComponent(Text);
        if (!text) {
            console.error("text component not found");
            return;
        }

        text.overflowType = TEXT_OVER_FLOW_TYPE.Clamp;
        text.alignHorizontalType = TEXT_ALIGN_HORIZONTAL_TYPE.Left;

        this._textNode.setSize(this.node.size);

        text.text = this._text;
    }

    private _text: string = "";
    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;

        if (this._textNode) {
            const text = this._textNode.getComponent(Text);
            if (text) {
                text.text = this._text;
            }
        }
    }

    protected override onPointerUp(event: IPointerEvent): void {
        if (!this._textNode) return console.error("textNode not found");

        const text = this._textNode.getComponent(Text);
        if (!text) return console.error("text component not found");

        if (this._el) return;

        this._el = document.createElement("input");
        this._el.id = "cassia-engine-input-field";
        this._el.type = "text";
        this._el.spellcheck = false;

        const elStyle = this._el.style;
        elStyle.margin = "0";
        elStyle.padding = "0";
        elStyle.resize = "none";
        elStyle.textAlign = "left";
        elStyle.position = "absolute";

        this._el.value = text.text;
        text.text = "";

        const updateInputPosition = (): void => {
            if (!window.visualViewport) return;

            const viewportHeight = window.visualViewport.height;
            const keyboardHeight = window.innerHeight - viewportHeight;
            this._el!.style.bottom = `${keyboardHeight}px`;
        };

        if (IS_BOTTOM_INPUT) {
            elStyle.padding = "0.5rem";
            elStyle.width = "95%";
            elStyle.height = "1.5rem";

            if (window.visualViewport) {
                window.visualViewport.addEventListener("resize", updateInputPosition);
            }
        } else {
            elStyle.border = "none";
            elStyle.outline = "none";
            elStyle.backgroundColor = "transparent";
        }

        document.getElementById("canvas-container")!.appendChild(this._el);

        this._el.addEventListener("blur", () => {
            if (IS_BOTTOM_INPUT) {
                if (window.visualViewport) {
                    window.visualViewport.removeEventListener("resize", updateInputPosition);
                }
            }

            this._text = this._el!.value;
            text.text = this._text;

            this._el?.remove();
            this._el = null;
        });
        this._el.addEventListener("keydown", (e: KeyboardEvent) => {
            e.stopPropagation();

            if (e.code === KEY_CODE.Enter || e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
                this._el?.blur();
            }
        });

        timeSystem.addTimerOnce(() => {
            if (!this._el) return;

            this._el.focus();
        });
    }

    protected override onLateUpdate(dt: number): void {
        if (!this._el) return;
        if (!this._textNode) return console.error("textNode not found");

        const text = this._textNode.getComponent(Text);
        if (!text) return console.error("text component not found");

        if (!this._textNode.size.equals(this.node.size)) {
            this._textNode.setSize(this.node.size);
        }

        const elStyle = this._el.style;
        const viewScale = renderSystem.viewScale;

        if (IS_BOTTOM_INPUT) return;

        const layerPosition = this.node.getLayerPosition();
        const screenPosition = this.node.currentLayer!.layerToScreen(layerPosition);

        const layerScale = this.node.getLayerScale();
        const layerSize = this.node.size.multiply(layerScale);
        const screenSize = layerSize.multiplyScalarSelf(viewScale);

        const oldLeft = parseFloat(elStyle.left) || 0;
        const newLeft = screenPosition.x - screenSize.width / 2;
        if (newLeft !== oldLeft) {
            elStyle.left = `${newLeft}px`;
        }

        const oldTop = parseFloat(elStyle.top) || 0;
        const newTop = screenPosition.y - screenSize.height / 2;
        if (newTop !== oldTop) {
            elStyle.top = `${newTop}px`;
        }

        elStyle.width = `${screenSize.width}px`;
        elStyle.height = `${screenSize.height}px`;

        const oldFontSize = parseFloat(elStyle.fontSize) || 0;
        const newFontSize = text.fontSize * viewScale;
        if (newFontSize !== oldFontSize) {
            elStyle.fontSize = `${newFontSize}px`;
        }

        const oldFontFamily = elStyle.fontFamily;
        const newFontFamily = text.fontFamily;
        if (newFontFamily !== oldFontFamily) {
            elStyle.fontFamily = newFontFamily;
        }

        const oldColor = elStyle.color || "rgb(0, 0, 0)";
        const newColor = this._textNode.color.toRGB();
        if (newColor !== oldColor) {
            elStyle.color = newColor;
        }
    }
}
