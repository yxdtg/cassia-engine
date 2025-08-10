import { Component, defineComponent } from "cassia-engine/component";
import type { RenderObject } from "cassia-engine/render";

@defineComponent({ componentName: "RenderComponent", isRenderComponent: true })
export class RenderComponent<T extends RenderObject = any> extends Component {
    protected _renderObject: T = null!;

    public onInit(): void {
        this._onRenderCreate();
    }
    protected _onRenderCreate(): void {}

    public onDestroy(): void {
        this._renderObject.destroy();
    }

    public onEnable(): void {
        this._renderObject.applyEnabled();
    }
    public onDisable(): void {
        this._renderObject.applyEnabled();
    }
}
