import { Component } from "cassia-engine/component";
import type { RenderObject } from "cassia-engine/render";

export class RenderComponent<T extends RenderObject = any> extends Component {
    protected _renderObject: T = null!;

    public onInit(): void {
        this._onRenderCreate();

        this.node.applySize();
        this.node.applyColor();
    }
    protected _onRenderCreate(): void {}
}
