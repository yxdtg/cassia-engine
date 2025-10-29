import { Component, defineComponent } from "cassia-engine/component";
import type { RenderObject } from "cassia-engine/render";

@defineComponent({ componentName: "RenderComponent", isRenderComponent: true })
export class RenderComponent<T extends RenderObject = any> extends Component {
    private _renderObject: T = null!;
    public get renderObject(): T {
        return this._renderObject;
    }

    protected override onCreate(): void {
        this._renderObject = this.onRenderCreate();
    }
    protected onRenderCreate(): T {
        throw new Error("onRenderCreate method not implemented");
    }

    protected override onDestroy(): void {
        this._renderObject.destroy();
    }

    protected override onEnable(): void {
        this._renderObject.applyEnabled();
    }
    protected override onDisable(): void {
        this._renderObject.applyEnabled();
    }
}
