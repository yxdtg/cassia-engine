import { Component } from "cassia-engine/component";

export class RenderComponent extends Component {
    public onCreate(): void {
        this._onRenderCreate();

        this.node.applySize();
        this.node.applyColor();
    }
    protected _onRenderCreate(): void {}
}
